import re

def _parse_eligibility(eligibility: str) -> dict:
    """
    Hàm nội bộ để phân tích chuỗi yêu cầu
    Ví dụ: "major:cs,gpa:3.5,skills:python|java"
    """
    rules = {}
    if not eligibility:
        return rules
        
    for rule in eligibility.split(','):
        try:
            key, value = rule.split(':', 1)
            rules[key.strip()] = value.strip()
        except ValueError:
            continue # Bỏ qua nếu rule bị lỗi
            
    return rules # Trả về: {'major': 'cs', 'gpa': '3.5', 'skills': 'python|java'}

def calculate_score(student: dict, scholarship: dict) -> int:
    """
    Tính toán điểm phù hợp (match score) giữa sinh viên và học bổng.
    
    - student: dict từ user-service
    - scholarship: dict từ opportunity-service
    """
    score = 0
    
    # Lấy eligibility từ scholarship (hoặc 'description' nếu không có)
    eligibility_str = scholarship.get('eligibility', '')
    requirements = _parse_eligibility(eligibility_str)

    if not requirements:
        return 50 # Nếu không có yêu cầu, cho điểm trung bình

    # 1. Tính điểm GPA (ví dụ: 40% trọng số)
    required_gpa = float(requirements.get('gpa', 0))
    student_gpa = float(student.get('gpa', 0))
    
    if student_gpa >= required_gpa:
        score += 40
    elif student_gpa >= required_gpa - 0.5:
        score += 20 # Gần đủ

    # 2. Tính điểm chuyên ngành (ví dụ: 30% trọng số)
    required_major = requirements.get('major')
    student_major = student.get('major', '').lower()
    
    if required_major and student_major == required_major.lower():
        score += 30

    # 3. Tính điểm kỹ năng (ví dụ: 30% trọng số)
    required_skills = set(requirements.get('skills', '').split('|')) # "python|java"
    student_skills = set(student.get('skills', '').split(',')) # "python,sql"
    
    if '' in required_skills:
        required_skills.remove('')

    if not required_skills:
        score += 30 # Không yêu cầu kỹ năng
    else:
        matched_skills = student_skills.intersection(required_skills)
        score += (len(matched_skills) / len(required_skills)) * 30

    return int(score) # Trả về điểm số nguyên (ví dụ: 85)