#!/bin/bash

# Color definitions
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting deployment process...${NC}"

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo -e "${RED}PM2 is not installed. Installing PM2 globally...${NC}"
    npm install -g pm2
fi

# Check if serve is installed (for static files)
if ! command -v serve &> /dev/null; then
    echo -e "${RED}serve is not installed. Installing serve globally...${NC}"
    npm install -g serve
fi

# 1. Install Dependencies
echo -e "${GREEN}[1/4] Installing dependencies...${NC}"
npm install

# 2. Build Backend
echo -e "${GREEN}[2/4] Building Backend...${NC}"
cd packages/backend
npm install
npm run build
cd ../..

# 3. Build H5 Merchant
echo -e "${GREEN}[3/4] Building H5 Merchant...${NC}"
cd packages/h5-merchant
npm install
npm run build
cd ../..

# 4. Build Admin Web
echo -e "${GREEN}[4/4] Building Admin Web...${NC}"
cd packages/admin-web
npm install
npm run build
cd ../..

# 5. Start with PM2
echo -e "${GREEN}[5/5] Starting services with PM2...${NC}"
pm2 start ecosystem.config.js
pm2 save

echo -e "${GREEN}Deployment complete!${NC}"
echo -e "Backend: http://localhost:3000"
echo -e "H5 Merchant: http://localhost:3001"
echo -e "Admin Web: http://localhost:3002"
