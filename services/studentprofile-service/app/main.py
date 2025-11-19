from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from . import schemas
from .database import get_db, Student, Document, UserAccount

# Khởi tạo FastAPI App
app = FastAPI(title="Student Profile Service")

# --- GET PROFILE  ---
@app.get("/api/v1/students/{student_id}", response_model=schemas.StudentProfileSchema)
def get_student_profile(student_id: int, db: Session = Depends(get_db)):
    """
    Lấy hồ sơ sinh viên chi tiết. Endpoint này được MatchingService gọi tới.
    """
    # Lấy hồ sơ và tải các tài liệu liên quan
    student = db.query(Student).filter(Student.student_id == student_id).first()
    
    if student is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student Profile not found")
        
    return student

# --- 2. CREATE PROFILE  ---
@app.post("/api/v1/students", response_model=schemas.StudentProfileSchema, status_code=status.HTTP_201_CREATED)
def create_student_profile(
    student_id: int,
    profile_data: schemas.StudentProfileBase, 
    db: Session = Depends(get_db)
):
    """
    Tạo hồ sơ sinh viên mới. Yêu cầu UserAccount phải tồn tại 
    """
    
    # Kiểm tra xem user có tồn tại k
    user_exists = db.query(UserAccount).filter(UserAccount.user_id == student_id).first()
    if not user_exists:
         raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User account not found. Cannot create profile.")

    new_profile = Student(
        student_id=student_id,
        full_name=profile_data.full_name,
        major=profile_data.major,
        gpa=profile_data.gpa,
        skills=profile_data.skills,
        preferences=profile_data.preferences,
        date_of_birth=profile_data.date_of_birth
    )
    try:
        db.add(new_profile)
        db.commit()
        db.refresh(new_profile)
        return new_profile
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Profile already exists for this user ID.")
    except Exception as e:
        db.rollback()
        print(f"Database error: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Lỗi server khi tạo hồ sơ.")

# --- 3.  UPDATE PROFILE  ---
@app.put("/api/v1/students/{student_id}", response_model=schemas.StudentProfileSchema)
def update_student_profile(
    student_id: int, 
    profile_data: schemas.StudentProfileBase, 
    db: Session = Depends(get_db)
):
    """
    Cập nhật hồ sơ sinh viên hiện có.
    """
    student = db.query(Student).filter(Student.student_id == student_id).first()
    if student is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student Profile not found")
        
    # Cập nhật các trường
    student.full_name = profile_data.full_name
    student.major = profile_data.major
    student.gpa = profile_data.gpa
    student.skills = profile_data.skills
    student.preferences = profile_data.preferences
    #student.date_of_birth = profile_data.date_of_birth
    
    db.commit()
    db.refresh(student)
    return student

@app.get("/")
def read_root():
    return {"service": "student-profile-service", "status": "Running"}