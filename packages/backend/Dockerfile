
# Base image
FROM node:18-alpine

# Working directory
WORKDIR /app

# Copy package files
COPY package.json ./
COPY packages/backend/package.json ./packages/backend/

# Install dependencies using npm
# Use --legacy-peer-deps to avoid potential conflicts
RUN npm install --legacy-peer-deps

# Copy source code
COPY packages/backend ./packages/backend

# Build the application
WORKDIR /app/packages/backend
# Explicitly add root node_modules to PATH so that nest binary can be found
ENV PATH /app/node_modules/.bin:$PATH

# Re-enable build step to catch errors early
RUN npm run build

# Expose port
EXPOSE 3000

# Start command
CMD ["npm", "run", "start:prod"]
