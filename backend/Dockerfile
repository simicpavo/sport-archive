# Base image
FROM node:22-bookworm-slim

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Install playwright dependencies
RUN npx playwright install-deps chromium
RUN npx playwright install

# Copy app source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the app
RUN npm run build

# Expose port
EXPOSE 3000

# Run migrations before starting the application
CMD sh -c "npx prisma migrate deploy && npm run start:prod"