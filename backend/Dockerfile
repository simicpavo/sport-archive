# Stage 1: Build
FROM node:22-bookworm-slim AS build

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --include=dev --ignore-scripts

# Install playwright dependencies
RUN npx playwright install chromium-deps chromium
RUN npx playwright install chromium

COPY . .

RUN npx prisma generate
RUN npm run build

# Stage 2: Production
FROM node:22-bookworm-slim

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --omit=dev --ignore-scripts

# Install playwright for runtime scraping
RUN npx playwright install chromium-deps chromium
RUN npx playwright install chromium

# Copy built app and Prisma artifacts
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/generated ./generated
COPY --from=build /usr/src/app/prisma ./prisma

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]
