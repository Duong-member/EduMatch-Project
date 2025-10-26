# Giai đoạn 1: Build
FROM node:18-alpine AS builder
WORKDIR /app

# Dùng pnpm
RUN npm install -g pnpm

# Đặt môi trường là 'development' ĐỂ CÀI devDependencies
ENV NODE_ENV=development

# Cài đặt dependencies
COPY package.json pnpm-lock.yaml* ./

# ==========================================================
# THAY ĐỔI QUAN TRỌNG:
# Thêm cờ '--prod=false' để BẮT BUỘC pnpm cài devDependencies
# và cũng để phá vỡ cache của Docker
RUN pnpm install --no-frozen-lockfile --prod=false
# ==========================================================

# Copy source code và build
COPY . .
RUN pnpm build

# Giai đoạn 2: Production
FROM node:18-alpine
WORKDIR /app

# CHỈ CÀI production dependencies cho image cuối cùng
RUN npm install -g pnpm
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
RUN pnpm install --prod --no-frozen-lockfile

EXPOSE 8001
CMD ["node", "dist/index.js"]