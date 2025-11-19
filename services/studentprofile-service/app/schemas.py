from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import date, datetime

# --- 1. Document Schema  ---
class DocumentSchema(BaseModel):
    document_id: Optional[int] = None
    student_id: int = Field(..., description="Foreign Key to Student Profile")
    type: str = Field(..., description="Loại tài liệu: Transcript, Certificate, etc.")
    file_url: str
    upload_date: Optional[datetime] = None

    class Config:
        orm_mode = True 

# --- 2. StudentProfile Schema ---
class StudentProfileBase(BaseModel):
    full_name: str
    major: str
    gpa: float = Field(..., ge=0.0, le=4.0)
    skills: str 
    preferences: Optional[str] = None
    #date_of_birth: Optional[date] = None 
    
    class Config:
        orm_mode = True

class StudentProfileSchema(StudentProfileBase):
    # Các trường để READ 
    student_id: int = Field(..., description="Primary Key, also FK to User Account")
    documents: List[DocumentSchema] = [] 
    
    class Config:
        orm_mode = True