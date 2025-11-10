# Stage 1: Build Angular Application with SSR
FROM node:20-alpine AS build

# Accept build argument for API URL
ARG API_URL

WORKDIR /app

# Copy root package.json and frontend package.json
COPY ../package*.json ./
COPY ./package*.json ./frontend/

# Install dependencies for the workspace
RUN npm install

# Copy frontend source code
COPY . ./frontend
WORKDIR /app/frontend

# Replace API_URL placeholder with actual value
RUN sed -i "s|API_URL|${API_URL}|g" src/environments/environment.prod.ts

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
