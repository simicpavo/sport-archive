# Stage 1: Build Angular Universal (SSR)
FROM node:20-alpine AS build

WORKDIR /app

# Copy root package.json and frontend package.json
COPY ../package*.json ./
COPY ./package*.json ./frontend/

# Install dependencies for the workspace
RUN npm install

# Copy frontend source code
COPY . ./frontend
WORKDIR /app/frontend

# Build the Angular app
RUN npm run build --configuration=production

# Stage 2: Run SSR with Node
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY ../package*.json ./
COPY ./package*.json ./frontend/

# Install only production dependencies
RUN npm install --omit=dev

# Copy the built application
COPY --from=build /app/frontend/dist ./frontend/dist

EXPOSE 4000

CMD ["node", "frontend/dist/frontend/server/server.mjs"]
