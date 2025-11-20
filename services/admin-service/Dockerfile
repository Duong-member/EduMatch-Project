# === Giai đoạn 1: Build ===
FROM node:18-slim AS builder
RUN apt-get update -y && apt-get install -y openssl ca-certificates procps
WORKDIR /app
RUN npm install -g pnpm
ENV NODE_ENV=development
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --no-frozen-lockfile --prod=false
COPY prisma ./prisma
# Fix lỗi mạng khi generate
RUN PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1 pnpm exec prisma generate
COPY src ./src
COPY tsconfig.json .
RUN pnpm build

# === Giai đoạn 2: Production ===
FROM node:18-slim
RUN apt-get update -y && apt-get install -y openssl ca-certificates procps
WORKDIR /app
RUN npm install -g pnpm
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src/generated ./dist/generated
RUN pnpm install --prod --no-frozen-lockfile

EXPOSE 8006
CMD ["node", "dist/index.js"]