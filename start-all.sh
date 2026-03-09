#!/bin/bash

# Color definitions
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "${BLUE}=== Starting Member System Services ===${NC}"

# Cleanup function to kill all child processes on exit
cleanup() {
    echo "\n${BLUE}=== Stopping all services... ===${NC}"
    # Kill all background jobs
    kill $(jobs -p) 2>/dev/null
    echo "${GREEN}All services stopped${NC}"
    exit
}

# Trap SIGINT (Ctrl+C)
trap cleanup SIGINT

# 1. Start Backend (NestJS)
echo "${GREEN}[1/3] Starting Backend (member-backend)...${NC}"
cd packages/backend
npm run start:dev &
BACKEND_PID=$!
cd ../..

# Wait a moment for backend to initialize
sleep 2

# 2. Start H5 Frontend (Vite)
echo "${GREEN}[2/3] Starting H5 Frontend (member-h5)...${NC}"
cd packages/h5-merchant
npm run dev &
H5_PID=$!
cd ../..

# 3. Start Admin Web (Vite)
echo "${GREEN}[3/3] Starting Admin Web (member-admin-web)...${NC}"
cd packages/admin-web
npm run dev &
ADMIN_PID=$!
cd ../..

echo "${BLUE}=== All services started ===${NC}"
echo "Backend API: http://localhost:3000"
echo "H5 Preview:  http://localhost:3001"
echo "Admin Web:   http://localhost:3002"
echo "${BLUE}Press Ctrl+C to stop all services${NC}"

# Wait for all background processes
wait