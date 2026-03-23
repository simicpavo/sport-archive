# Stage 1: Build
FROM node:22-bookworm-slim AS build

WORKDIR /usr/src/app

# Copy root and backend package files
COPY package*.json ./
COPY backend/package*.json ./backend/

# Install all dependencies (including devDependencies for build)
RUN npm install

# Install playwright dependencies
RUN npx playwright install-deps chromium
RUN npx playwright install

# Copy backend source code
COPY backend/ ./backend/
WORKDIR /usr/src/app/backend

RUN npx prisma generate
RUN npm run build

# Stage 2: Production
FROM node:22-bookworm-slim

WORKDIR /usr/src/app

# Copy root and backend package files
COPY package*.json ./
COPY backend/package*.json ./backend/

RUN npm install --omit=dev

# Install playwright for runtime scraping
RUN npx playwright install-deps chromium
RUN npx playwright install

WORKDIR /usr/src/app/backend

# Copy built app and Prisma artifacts
COPY --from=build /usr/src/app/backend/dist ./dist
COPY --from=build /usr/src/app/backend/generated ./generated
COPY --from=build /usr/src/app/backend/prisma ./prisma

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]
