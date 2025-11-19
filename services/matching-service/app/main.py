# import os
# import requests 
# from fastapi import FastAPI, Depends, HTTPException, Body
# from sqlalchemy.orm import Session
# from logic import calculate_score
# from database import get_db, save_matching_result

# app = FastAPI(title="Matching Service")

# # Lấy URL của các service khác từ biến môi trường
# USER_SERVICE_URL = os.getenv("USER_SERVICE_URL", "http://user-service:8080")
# OPPORTUNITY_SERVICE_URL = os.getenv("OPPORTUNITY_SERVICE_URL", "http://opportunity-service:8080")
# APPLICATION_SERVICE_URL = os.getenv("APPLICATION_SERVICE_URL", "http://application-service:8080")

# class ServiceCallException(Exception):
#     """Lỗi tùy chỉnh khi không gọi được service khác"""
#     pass

# def get_data_from_service(url: str, service_name: str) -> dict:
#     """Hàm helper để gọi các service khác và xử lý lỗi"""
#     try:
#         response = requests.get(url)
#         response.raise_for_status() # Báo lỗi nếu status code là 4xx hoặc 5xx
#         return response.json()
#     except requests.exceptions.RequestException as e:
#         raise ServiceCallException(f"Lỗi khi gọi {service_name}: {str(e)}")


# @app.post("/api/v1/trigger-match")
# async def trigger_matching(payload: dict = Body(...), db: Session = Depends(get_db)):
#     """
#     Endpoint chính, được gọi (ví dụ: bởi application-service)
#     để bắt đầu quá trình matching.
    
#     Body mong đợi: {"application_id": 123}
#     """
#     try:
#         application_id = payload["application_id"]

#         # ================== PHẦN MOCK BẮT ĐẦU ==================
        
#         # 1. TẠM THỜI BÌNH LUẬN (COMMENT) TẤT CẢ CÁC CUỘC GỌI API THẬT
#         # app_url = f"{APPLICATION_SERVICE_URL}/api/applications/{application_id}"
#         # app_data = get_data_from_service(app_url, "Application Service")
        
#         # (Giả sử app_data trả về 2 key này)
#         # student_id = app_data.get("studentId") 
#         # scholarship_id = app_data.get("scholarshipId")

#         # 2. LẤY STUDENT PROFILE VÀ SCHOLARSHIP
#         # student_url = f"{USER_SERVICE_URL}/api/v1/students/{student_id}" 
#         # student_profile = get_data_from_service(student_url, "User Service")

#         # scholarship_url = f"{OPPORTUNITY_SERVICE_URL}/api/scholarships/{scholarship_id}"
#         # scholarship = get_data_from_service(scholarship_url, "Opportunity Service")

#         # 2. TẠO DỮ LIỆU GIẢ (MOCK DATA)
#         # (Những key này phải khớp với những gì logic.py của bạn cần)
        
#         print(f"[TESTING] Đang chạy với dữ liệu MOCK cho application_id: {application_id}")

#         # Dữ liệu giả vờ lấy từ application-service
#         app_data = {
#             "studentId": 101,    # (Dùng một ID giả)
#             "scholarshipId": 202 # (Dùng một ID giả)
#         }
        
#         # Dữ liệu giả vờ lấy từ user-service
#         student_profile = {
#             "student_id": 101,
#             "major": "cs",
#             "gpa": 3.2,
#             "skills": "sql,react"
#         }
        
#         # Dữ liệu giả vờ lấy từ opportunity-service
#         scholarship = {
#             "scholarship_id": 202,
#             "eligibility": "major:cs,gpa:3.5,skills:python"
#         }
        
#         # =================== PHẦN MOCK KẾT THÚC ===================

#         # 3. Chạy logic tính điểm (với dữ liệu MOCK ở trên)
#         score = calculate_score(student_profile, scholarship)

#         # 4. Lưu kết quả (vào CSDL THẬT)
#         save_matching_result(db, application_id, score)

#         return {
#             "success": True, 
#             "message": "Matching thành công (với dữ liệu MOCK)",
#             "application_id": application_id, 
#             "score": score
#         }

#     except KeyError:
#         raise HTTPException(status_code=400, detail="Thiếu 'application_id' trong body")
#     except ServiceCallException as e:
#         raise HTTPException(status_code=502, detail=str(e)) # 502 Bad Gateway
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Lỗi máy chủ nội bộ: {str(e)}")


# @app.get("/")
# def read_root():
#     return {"service": "matching-service", "status": "OK"}


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

        # 2. Gọi User Service để lấy hồ sơ sinh viên
        # API: GET /api/users/{id} (CẦN BỔ SUNG API NÀY BÊN USER SERVICE)
        student_url = f"{USER_SERVICE_URL}/api/users/{student_id}"
        student_profile = get_data_from_service(student_url, "User Service")

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