# # -----------------------------------------------
# # EduMatch - Application Service (Multi-stage)
# # -----------------------------------------------

# # === Giai đoạn 1: Build ===
# FROM node:18-alpine AS builder
# WORKDIR /app

# # Cài pnpm
# RUN npm install -g pnpm

# # Đặt môi trường dev để cài devDependencies
# ENV NODE_ENV=development

# # Copy file cấu hình
# COPY package.json pnpm-lock.yaml* ./

# # Cài dependencies (bao gồm dev)
# RUN pnpm install --no-frozen-lockfile --prod=false

# # Copy toàn bộ mã nguồn và build TypeScript
# COPY . .
# RUN pnpm exec prisma generate
# RUN pnpm build

# # === Giai đoạn 2: Production ===
# FROM node:18-alpine
# WORKDIR /app

# # Cài pnpm và chỉ cài dependencies production
# RUN npm install -g pnpm
# ENV NODE_ENV=production

# COPY --from=builder /app/dist ./dist
# COPY --from=builder /app/package.json ./package.json

# COPY --from=builder /app/prisma ./prisma

# # Chỉ cài production dependencies
# RUN pnpm install --prod --no-frozen-lockfile

# # Port cho Application Service
# EXPOSE 4002

# # Lệnh chạy service
# CMD ["node", "dist/index.js"]

# services/application-service/Dockerfile

# === Giai đoạn 1: Build ===
FROM node:18-slim AS builder
# Cài đặt đầy đủ thư viện cần thiết cho Prisma
RUN apt-get update -y && apt-get install -y openssl ca-certificates procps
WORKDIR /app

RUN npm install -g pnpm
ENV NODE_ENV=development

COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --no-frozen-lockfile --prod=false

# Copy schema và tạo client
COPY prisma ./prisma
RUN pnpm exec prisma generate

# Copy code và build
COPY . .
RUN pnpm build

# === Giai đoạn 2: Production ===
FROM node:18-slim
# Cài đặt đầy đủ thư viện cần thiết cho Prisma
RUN apt-get update -y && apt-get install -y openssl ca-certificates procps
WORKDIR /app

RUN npm install -g pnpm
ENV NODE_ENV=production

# Copy file build
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json

# ✅ QUAN TRỌNG: Copy thư mục prisma sang để lệnh 'db push' tìm thấy file schema
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src/generated ./dist/generated
# Cài dependency production (bao gồm cả prisma CLI)
RUN pnpm install --prod --no-frozen-lockfile
# Đảm bảo gói prisma có mặt
RUN pnpm add -D prisma 

EXPOSE 4002
CMD ["node", "dist/index.js"]