import os
from sqlalchemy import create_engine, Column, Integer, String, DECIMAL, ForeignKey, Text, DateTime, Date
from sqlalchemy.orm import sessionmaker, relationship
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

# Lấy thông tin từ biến môi trường đã thống nhất
DB_USER = os.getenv("MYSQL_USER", "user")
DB_PASSWORD = os.getenv("MYSQL_PASSWORD", "password")
DB_HOST = os.getenv("MYSQL_HOST", "mysql-db") 
DB_PORT = os.getenv("MYSQL_PORT", 3306)
DB_NAME = os.getenv("MYSQL_DB", "edumatch_student_db")

# Tạo URL kết nối 
DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# Khởi tạo Base và Engine
Base = declarative_base()
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Dependency để lấy DB Session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Bảng Student (StudentProfile)
class Student(Base):
    __tablename__ = 'student'
    student_id = Column(String(255), primary_key=True, index=True)
    full_name = Column(String(100))
    major = Column(String(100))
    gpa = Column(DECIMAL(3, 2))
    skills = Column(Text)
    preferences = Column(Text)
    #date_of_birth = Column(Date, nullable=True) 
    
    # Mối quan hệ với Document (1:N)
    documents = relationship("Document", back_populates="owner")

class Document(Base):
    __tablename__ = 'document'
    document_id = Column(Integer, primary_key=True, index=True)
    
    # ✅ SỬA: Đổi Integer -> String(255) cho khớp với student_id
    student_id = Column(String(255), ForeignKey('student.student_id')) 
    type = Column(String(50))
    file_url = Column(String(255))
    upload_date = Column(DateTime, default=datetime.utcnow)
    owner = relationship("Student", back_populates="documents")