# Stage 1: Build Angular Application with SSR
FROM node:20-alpine AS build

# Accept build arguments for API and Keycloak URLs
ARG API_URL
ARG KEYCLOAK_URL

WORKDIR /app

# Copy root and frontend package files
COPY package*.json ./
COPY frontend/package*.json ./frontend/

# Install dependencies for the workspace
RUN npm install

# Copy frontend source code
COPY frontend/ ./frontend/
WORKDIR /app/frontend

# Replace placeholders with actual values
RUN sed -i "s|API_URL|${API_URL}|g" src/environments/environment.prod.ts
RUN sed -i "s|KEYCLOAK_URL|${KEYCLOAK_URL}|g" src/environments/environment.prod.ts

# Build the Angular app with SSR (builds both browser and server bundles)
RUN npm run build --configuration=production

# Stage 2: Serve with Node.js for SSR
FROM node:20-alpine

WORKDIR /app

# Copy built application (includes browser, server, and server entry point)
COPY --from=build /app/frontend/dist/frontend ./dist/frontend
COPY --from=build /app/frontend/package*.json ./

# Install only production dependencies
RUN npm install --production

EXPOSE 4000

# Run the SSR server
CMD ["node", "dist/frontend/server/server.mjs"]
