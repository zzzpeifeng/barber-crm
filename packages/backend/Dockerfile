
# Base image
FROM node:18-alpine

# Working directory
WORKDIR /app

# Copy root package files
COPY package.json ./
COPY pnpm-workspace.yaml ./
COPY packages/backend/package.json ./packages/backend/

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy source code
COPY packages/backend ./packages/backend

# Build the application
WORKDIR /app/packages/backend
ENV PATH /app/node_modules/.bin:$PATH
ENV NODE_ENV=production

# Use TypeScript compiler directly instead of nest build
RUN npx tsc -p tsconfig.json && \
    echo "Build successful!" && \
    ls -la dist/

# Expose port
EXPOSE 3000

# Start command
CMD ["node", "dist/main.js"]
