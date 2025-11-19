FROM python:3.10-slim

WORKDIR /app

# Copy requirements
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir --upgrade -r requirements.txt

# Copy source code
COPY app/ ./app

# Expose port (Đã thống nhất 8005 trong docker-compose.yml)
EXPOSE 8005

# Lệnh khởi chạy
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8005"]