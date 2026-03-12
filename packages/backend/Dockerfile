
# Base image
FROM node:18-alpine

# Working directory
WORKDIR /app

# Copy package files
# Note: In a monorepo structure, we might need root package.json for some contexts,
# but for a standalone build we focus on the package dependencies.
# Assuming we want to build this package using npm workspaces or just as a standalone if possible.
# Since we are switching to npm, we will copy package.json and install.

COPY package.json ./
COPY packages/backend/package.json ./packages/backend/

# Install dependencies using npm
# We install dependencies in the root to respect workspaces if configured, or just for the package.
# For simplicity and robust building in Docker, we often install in the package directory or root.
# Here we will try to install from root to handle any shared deps if they exist, or just for the package.
RUN npm install

# Copy source code
COPY packages/backend ./packages/backend
# Build the application
WORKDIR /app/packages/backend
# Explicitly add root node_modules to PATH so that nest binary can be found
ENV PATH /app/node_modules/.bin:$PATH

# Re-installing in the package directory might be needed if not using workspaces correctly in Docker context,
# but let's try running build from here. If dependencies are at root/node_modules, node resolution should find them.
# However, nest cli might be local.
RUN npm run build

# Expose port
EXPOSE 3000

# Start command
CMD ["npm", "run", "start:prod"]
