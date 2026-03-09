
# Build stage
FROM node:18-alpine as builder

WORKDIR /app
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-workspace.yaml ./
COPY packages/h5-merchant/package.json ./packages/h5-merchant/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY packages/h5-merchant ./packages/h5-merchant

# Build
WORKDIR /app/packages/h5-merchant
RUN pnpm build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/packages/h5-merchant/dist /usr/share/nginx/html
COPY packages/h5-merchant/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
