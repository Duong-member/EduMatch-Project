# =======================
# 1. BUILD STAGE
# =======================
FROM node:18-slim AS builder

# Cài OpenSSL 3 để Prisma hoạt động
RUN apt-get update && apt-get install -y openssl ca-certificates && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Cài pnpm
RUN npm install -g pnpm

ENV NODE_ENV=development

# Copy package
COPY package.json pnpm-lock.yaml* ./

# Install đầy đủ dependency
RUN pnpm install --no-frozen-lockfile

# Copy toàn bộ source
COPY . .

# Generate Prisma Client
RUN pnpm exec prisma generate

# Build TypeScript
RUN pnpm build



# =======================
# 2. PRODUCTION STAGE
# =======================
FROM node:18-slim

# CÀI OPENSSL 3 — BẮT BUỘC
RUN apt-get update && apt-get install -y openssl ca-certificates && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app
RUN npm install -g pnpm

ENV NODE_ENV=production

# Copy package
COPY package.json pnpm-lock.yaml* ./

# Install chỉ production deps
RUN pnpm install --prod --no-frozen-lockfile

# Copy dist từ build stage
COPY --from=builder /app/dist ./dist

# Copy Prisma schema
COPY --from=builder /app/prisma ./prisma

# Copy generated Prisma client
COPY --from=builder /app/src/generated ./src/generated

EXPOSE 4002

CMD ["node", "dist/index.js"]
