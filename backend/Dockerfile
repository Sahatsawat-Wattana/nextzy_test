FROM node:22-alpine AS dependencies
WORKDIR /app
COPY package.json package-lock.json ./
COPY frontend/package.json frontend/package.json
COPY backend/package.json backend/package.json
RUN npm ci

FROM dependencies AS builder
WORKDIR /app
COPY backend backend
RUN npm run db:generate
RUN npm run build -w @nextzy/api

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
COPY frontend/package.json frontend/package.json
COPY backend/package.json backend/package.json
COPY backend/prisma backend/prisma
RUN npm ci --omit=dev && npm run db:generate
COPY --from=builder /app/backend/dist backend/dist
EXPOSE 4000
USER node
CMD ["sh", "-c", "./node_modules/.bin/prisma migrate deploy --schema=backend/prisma/schema.prisma && node backend/dist/main.js"]
