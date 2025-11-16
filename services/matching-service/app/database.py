import os
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from sqlalchemy.engine.url import URL

# ĐỌC CÁC BIẾN MÔI TRƯỜNG 
DB_HOST = os.getenv("MYSQL_HOST", "mysql-db") 
DB_USER = os.getenv("MYSQL_USER", "user")
DB_PASSWORD = os.getenv("MYSQL_PASSWORD", "password")
DB_NAME = os.getenv("MYSQL_DB", "edumatch_users_db")
DB_PORT = os.getenv("MYSQL_PORT", 3306)

# Tạo URL kết nối
DATABASE_URL = URL.create(
    drivername="mysql+pymysql",
    username=DB_USER,
    password=DB_PASSWORD,
    host=DB_HOST,
    port=int(DB_PORT),
    database=DB_NAME
)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def save_matching_result(db, application_id: int, score: int):
    query = text(
        """
        INSERT INTO matchingresult (application_id, matched_date, score) 
        VALUES (:app_id, NOW(), :score)
        """
    )
    db.execute(query, {"app_id": application_id, "score": score})
    db.commit()
