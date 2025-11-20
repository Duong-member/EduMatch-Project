from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from . import schemas
# ✅ SỬA: Bỏ import UserAccount, thêm engine và Base
from .database import get_db, Student, Document, engine, Base

# ✅ THÊM: Tự động tạo bảng khi khởi động (Fix lỗi bảng không tồn tại)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Student Profile Service")

# --- GET PROFILE ---
@app.get("/api/v1/students/{student_id}", response_model=schemas.StudentProfileSchema)
def get_student_profile(student_id: str, db: Session = Depends(get_db)): # ✅ SỬA: int -> str
    student = db.query(Student).filter(Student.student_id == student_id).first()
    if student is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student Profile not found")
    return student

# --- CREATE PROFILE ---
@app.post("/api/v1/students", response_model=schemas.StudentProfileSchema, status_code=status.HTTP_201_CREATED)
def create_student_profile(
    profile_input: schemas.StudentProfileCreate, 
    db: Session = Depends(get_db)
):
    # Lấy ID từ trong body
    student_id = profile_input.student_id
        # Kiểm tra xem profile đã tồn tại chưa
    existing = db.query(Student).filter(Student.student_id == student_id).first()
    if existing:
         raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Profile already exists")

    new_profile = Student(
        student_id=student_id,
        full_name=profile_input.full_name,
        major=profile_input.major,
        gpa=profile_input.gpa,
        skills=profile_input.skills,
        preferences=profile_input.preferences
    )
    try:
        db.add(new_profile)
        db.commit()
        db.refresh(new_profile)
        return new_profile
    except Exception as e:
        db.rollback()
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Server Error")

# --- UPDATE PROFILE ---
# (Nhớ sửa student_id: int -> str ở hàm update nữa nhé)
@app.put("/api/v1/students/{student_id}", response_model=schemas.StudentProfileSchema)
def update_student_profile(
    student_id: str, # ✅ SỬA
    profile_data: schemas.StudentProfileBase, 
    db: Session = Depends(get_db)
):
    # ... (giữ nguyên logic update)
    student = db.query(Student).filter(Student.student_id == student_id).first()
    if student is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student Profile not found")
    
    # Update fields...
    student.full_name = profile_data.full_name
    student.major = profile_data.major
    student.gpa = profile_data.gpa
    student.skills = profile_data.skills
    student.preferences = profile_data.preferences

    db.commit()
    db.refresh(student)
    return student

@app.get("/")
def read_root():
    return {"status": "ok"}