# Stage 1: Build Angular Universal app
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build Angular app with SSR
RUN npm run build

# Stage 2: Run the SSR server
FROM node:20-alpine AS runtime

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev --legacy-peer-deps

COPY --from=build /app/dist ./dist

EXPOSE 4000

CMD ["node", "dist/frontend/server/server.mjs"]
