# === Giai đoạn 1: Build ===
FROM node:18-slim AS builder
# Cài đặt đầy đủ thư viện cần thiết cho Prisma
RUN apt-get update -y && apt-get install -y openssl ca-certificates procps
WORKDIR /app

RUN npm install -g pnpm
ENV NODE_ENV=development

COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --no-frozen-lockfile --prod=false

# Copy schema và generate Prisma client
COPY prisma ./prisma
RUN pnpm exec prisma generate

# Copy mã nguồn và build
COPY src ./src
COPY tsconfig.json .
RUN pnpm build

# === Giai đoạn 2: Production ===
FROM node:18-slim
# Cài đặt đầy đủ thư viện cần thiết cho Prisma
RUN apt-get update -y && apt-get install -y openssl ca-certificates procps
WORKDIR /app

RUN npm install -g pnpm
ENV NODE_ENV=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json

# Copy Prisma client đã generate
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

RUN pnpm install --prod --no-frozen-lockfile

EXPOSE 3000
CMD ["node", "dist/index.js"]