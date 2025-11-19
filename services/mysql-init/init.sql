-- services/mysql-init/init.sql
CREATE DATABASE IF NOT EXISTS edumathdb;
CREATE DATABASE IF NOT EXISTS edumatch_applications_db;
CREATE DATABASE IF NOT EXISTS edumatch_users_db;
CREATE DATABASE IF NOT EXISTS student_profile_db;
CREATE DATABASE IF NOT EXISTS edumatch_admin_db;
-- Đảm bảo user có quyền (phòng hờ)
GRANT ALL PRIVILEGES ON *.* TO 'user'@'%';
FLUSH PRIVILEGES;