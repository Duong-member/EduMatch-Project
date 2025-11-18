-- =========================================================
-- CƠ SỞ DỮ LIỆU ĐỘC LẬP: STUDENT PROFILE SERVICE
-- Dịch vụ này sở hữu StudentProfile, UserAccount, và Document.
-- =========================================================

-- 1. Bảng UserAccount (PK: user_id)
-- Quản lý tài khoản (email, password, role) - Cần thiết cho Foreign Key của bảng student
DROP TABLE IF EXISTS `useraccount`;
CREATE TABLE `useraccount` (
  -- Sử dụng INT NOT NULL AUTO_INCREMENT như trong file SQL gốc của bạn
  `user_id` INT NOT NULL AUTO_INCREMENT, 
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('student', 'professor', 'admin') NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Bảng Student (StudentProfile) (PK: student_id)
-- Chứa hồ sơ chi tiết (GPA, skills, major)
DROP TABLE IF EXISTS `student`;
CREATE TABLE `student` (
  `student_id` INT NOT NULL, 
  `full_name` VARCHAR(100) DEFAULT NULL,
  `major` VARCHAR(100) DEFAULT NULL,
  `gpa` DECIMAL(3,2) DEFAULT NULL, -- Float trong sơ đồ, dùng DECIMAL(3,2) trong MySQL
  `skills` TEXT, -- 
  `preferences` TEXT,
  PRIMARY KEY (`student_id`),
  -- Khóa ngoại (FK) trỏ về UserAccount (1-1 relationship)
  CONSTRAINT `fk_student_user` FOREIGN KEY (`student_id`) REFERENCES `useraccount` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- 3. Bảng Document (FK trỏ đến StudentProfile)
-- Quản lý tài liệu liên quan đến hồ sơ (bảng điểm, chứng chỉ)
DROP TABLE IF EXISTS `document`;
CREATE TABLE `document` (
  `document_id` INT NOT NULL AUTO_INCREMENT,
  `student_id` INT NOT NULL, 
  `type` VARCHAR(50) NOT NULL, 
  `file_url` VARCHAR(255) NOT NULL, 
  `upload_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`document_id`),
  -- Khóa ngoại (FK) trỏ về Student (Mối quan hệ 1-N)
  CONSTRAINT `fk_document_student` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
