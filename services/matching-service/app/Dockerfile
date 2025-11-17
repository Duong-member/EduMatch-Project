FROM python:3.10-slim

WORKDIR /code

COPY requirements.txt .

# Cài đặt các thư viện
RUN pip install --no-cache-dir --upgrade -r requirements.txt

# Copy toàn bộ code vào container
COPY . .

# Expose port 8080 
EXPOSE 8080

# khởi chạy server API khi container chạy
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]