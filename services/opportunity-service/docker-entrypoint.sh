#!/bin/sh
set -e

echo "[entrypoint] Waiting for MySQL (if needed)..."

# Nếu muốn chờ DB kỹ hơn, có thể bật đoạn này:
# until nc -z mysql-db 3306; do
#   echo "⏳ Waiting for MySQL..."
#   sleep 2
# done

echo "[entrypoint] Running prisma db push..."
pnpm exec prisma db push --accept-data-loss || {
  echo "[entrypoint] Prisma DB Push failed (continue anyway)"
}

echo "[entrypoint] Starting server..."
exec "$@"
