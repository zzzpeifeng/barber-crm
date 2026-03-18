
# Base image
FROM node:18-alpine

# Working directory
WORKDIR /app

# Copy root package files
COPY package.json ./
COPY pnpm-workspace.yaml ./
COPY packages/backend/package.json ./packages/backend/

# Install all dependencies (including devDependencies for build)
RUN npm install --legacy-peer-deps

# Copy source code
COPY packages/backend ./packages/backend

# Copy .env file for build time
COPY packages/backend/.env ./packages/backend/

# Build the application
WORKDIR /app/packages/backend
ENV PATH=/app/node_modules/.bin:$PATH
ENV NODE_ENV=production

# Use nest build instead of tsc directly
RUN npm run build && \
    echo "Build successful!" && \
    ls -la dist/

# Expose port
EXPOSE 3000

# Start command
# Set NODE_OPTIONS for production
ENV NODE_OPTIONS="--max-old-space-size=4096"
CMD ["node", "dist/main.js"]
