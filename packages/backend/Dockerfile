
# Base image
FROM node:18-alpine

# Working directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-workspace.yaml ./
COPY packages/backend/package.json ./packages/backend/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY packages/backend ./packages/backend

# Build the application
WORKDIR /app/packages/backend
RUN pnpm build

# Expose port
EXPOSE 3000

# Start command
CMD ["pnpm", "start:prod"]
