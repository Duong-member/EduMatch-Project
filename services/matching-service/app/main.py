import os
import requests 
from fastapi import FastAPI, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from logic import calculate_score
from database import get_db, save_matching_result

app = FastAPI(title="Matching Service")

# Cấu hình URL của các service khác (Dựa theo docker-compose.yml)
# User Service chạy port 8001
USER_SERVICE_URL = os.getenv("USER_SERVICE_URL", "http://user-service:8001")
# Opportunity Service chạy port 3000
OPPORTUNITY_SERVICE_URL = os.getenv("OPPORTUNITY_SERVICE_URL", "http://opportunity-service:3000")
# Application Service chạy port 4002
APPLICATION_SERVICE_URL = os.getenv("APPLICATION_SERVICE_URL", "http://application-service:4002")
# Student Profile Service chạy port 8005
STUDENT_PROFILE_URL = os.getenv("STUDENT_PROFILE_URL", "http://studentprofile-service:8005")

class ServiceCallException(Exception):
    """Lỗi khi gọi service khác thất bại"""
    pass

def get_data_from_service(url: str, service_name: str) -> dict:
    try:
        print(f"[INFO] Calling {service_name}: {url}")
        response = requests.get(url)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"[ERROR] Failed to call {service_name}: {e}")
        raise ServiceCallException(f"Không thể lấy dữ liệu từ {service_name}")

@app.post("/api/v1/trigger-match")
async def trigger_matching(payload: dict = Body(...), db: Session = Depends(get_db)):
    """
    Nhận application_id -> Lấy dữ liệu -> Tính điểm -> Lưu DB
    """
    try:
        application_id = payload.get("application_id")
        if not application_id:
            raise HTTPException(status_code=400, detail="Thiếu 'application_id'")

        # 1. Gọi Application Service để lấy thông tin đơn nộp
        # API: GET /api/application/{id}
        app_url = f"{APPLICATION_SERVICE_URL}/api/application/{application_id}"
        application = get_data_from_service(app_url, "Application Service")
        
        student_id = application.get("student_id")
        opportunity_id = application.get("opportunity_id")

        # 2. Gọi Student Profile Service để lấy hồ sơ học thuật (GPA, Skills...)
        # API: GET /api/profiles/{user_id}
        profile_url = f"{STUDENT_PROFILE_URL}/api/profiles/{student_id}"
        student_profile = get_data_from_service(profile_url, "Student Profile Service")

        # 3. Gọi Opportunity Service để lấy yêu cầu học bổng
        # API: GET /api/opportunities/{id}
        opp_url = f"{OPPORTUNITY_SERVICE_URL}/api/opportunities/{opportunity_id}"
        scholarship = get_data_from_service(opp_url, "Opportunity Service")

        # 4. Tính điểm (Logic AI)
        score = calculate_score(student_profile, scholarship)

        # 5. Lưu kết quả
        save_matching_result(db, application_id, score)

        return {
            "success": True,
            "message": "Matching hoàn tất",
            "data": {
                "application_id": application_id,
                "student": student_profile.get("name"),
                "opportunity": scholarship.get("title"),
                "match_score": score
            }
        }

    except ServiceCallException as e:
        raise HTTPException(status_code=502, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi server: {str(e)}")

@app.get("/")
def health_check():
    return {"status": "OK", "service": "Matching Service"}