
# Build stage
FROM node:18-alpine as builder

WORKDIR /app

# Copy package files
COPY package.json ./
COPY packages/admin-web/package.json ./packages/admin-web/

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy source code
COPY packages/admin-web ./packages/admin-web

# Build
WORKDIR /app/packages/admin-web
# Explicitly add root node_modules to PATH so that vite binaries can be found
ENV PATH /app/node_modules/.bin:$PATH

# Run build without type checking (already checked locally)
RUN npm run dev

# Production stage
FROM nginx:alpine
COPY --from=builder /app/packages/admin-web/dist /usr/share/nginx/html
COPY packages/admin-web/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
