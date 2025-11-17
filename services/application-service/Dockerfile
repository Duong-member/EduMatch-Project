# -----------------------------------------------
# EduMatch - Application Service (Multi-stage)
# -----------------------------------------------

# === Giai đoạn 1: Build ===
FROM node:18-alpine AS builder
WORKDIR /app

# Cài pnpm
RUN npm install -g pnpm

# Đặt môi trường dev để cài devDependencies
ENV NODE_ENV=development

# Copy file cấu hình
COPY package.json pnpm-lock.yaml* ./

# Cài dependencies (bao gồm dev)
RUN pnpm install --no-frozen-lockfile --prod=false

# Copy toàn bộ mã nguồn và build TypeScript
COPY . .
RUN pnpm build

# === Giai đoạn 2: Production ===
FROM node:18-alpine
WORKDIR /app

# Cài pnpm và chỉ cài dependencies production
RUN npm install -g pnpm
ENV NODE_ENV=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json

# Chỉ cài production dependencies
RUN pnpm install --prod --no-frozen-lockfile

# Port cho Application Service
EXPOSE 4002

# Lệnh chạy service
CMD ["node", "dist/index.js"]
