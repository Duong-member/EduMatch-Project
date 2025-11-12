# apps/web-react/Dockerfile
FROM node:20-alpine
WORKDIR /app

# Cài pnpm
RUN npm install -g pnpm

# Đặt môi trường là 'development' ĐỂ CÀI devDependencies
ENV NODE_ENV=development

# Cài dependencies
COPY package.json pnpm-lock.yaml* ./

# ==========================================================
# THAY ĐỔI QUAN TRỌNG:
# Thêm cờ '--prod=false' để BẮT BUỘC pnpm cài devDependencies
# và cũng để phá vỡ cache của Docker
RUN pnpm install --no-frozen-lockfile --prod=false
# ==========================================================

# Copy toàn bộ source code
COPY . .

# Mở port 3000
EXPOSE 3000

# Chạy dev server
CMD ["pnpm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]