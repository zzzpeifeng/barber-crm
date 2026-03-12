
# Build stage
FROM node:18-alpine as builder

WORKDIR /app

# Copy package files
COPY package.json ./
COPY packages/admin-web/package.json ./packages/admin-web/

# Install dependencies
RUN npm install

# Copy source code
COPY packages/admin-web ./packages/admin-web

# Build
WORKDIR /app/packages/admin-web
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/packages/admin-web/dist /usr/share/nginx/html
COPY packages/admin-web/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
