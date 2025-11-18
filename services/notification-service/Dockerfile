# 1. Image Node gọn nhẹ
FROM node:20-alpine

# 2. Thư mục làm việc trong container
WORKDIR /app

# 3. Copy file cấu hình (package.json, package-lock nếu có)
COPY package*.json ./

# 4. Cài dependencies (chỉ dependencies, bỏ devDependencies)
RUN npm install --omit=dev

# 5. Copy toàn bộ source code vào container
COPY . .

# 6. Mở port cho HTTP + Socket.IO
EXPOSE 8090

# 7. Lệnh khởi động service
CMD ["node", "src/index.js"]
