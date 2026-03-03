#!/bin/bash
set -e

echo "[v0] Generating Prisma Client..."
npx prisma generate

echo "[v0] Prisma Client generated successfully!"
echo "[v0] Setup complete - you can now start the development server"
