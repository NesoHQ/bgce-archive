#!/bin/bash

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}🔄 Rebuilding Cortex with CORS fix...${NC}\n"

# Step 1: Clean
echo -e "${YELLOW}Step 1: Cleaning Docker resources...${NC}"
docker compose down -v
docker rmi cortex:local 2>/dev/null || true
echo -e "${GREEN}✓ Cleaned${NC}\n"

# Step 2: Build
echo -e "${YELLOW}Step 2: Building Docker image...${NC}"
docker build -t cortex:local .
if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Build failed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Built${NC}\n"

# Step 3: Start
echo -e "${YELLOW}Step 3: Starting services...${NC}"
docker compose up -d
echo -e "${GREEN}✓ Started${NC}\n"

# Step 4: Wait
echo -e "${YELLOW}Step 4: Waiting for services to be healthy (30s)...${NC}"
sleep 30
echo -e "${GREEN}✓ Ready${NC}\n"

# Step 5: Seed
echo -e "${YELLOW}Step 5: Seeding database...${NC}"
docker compose exec bgce_cortex /app/main seed
echo -e "${GREEN}✓ Seeded${NC}\n"

# Step 6: Test
echo -e "${YELLOW}Step 6: Testing CORS...${NC}"
./test_cors_simple.sh

echo -e "\n${GREEN}✅ Rebuild complete!${NC}"
echo -e "\n${YELLOW}Next steps:${NC}"
echo -e "1. Restart frontend: ${GREEN}cd ../archive-admin && yarn dev${NC}"
echo -e "2. Clear browser cache"
echo -e "3. Login at: ${GREEN}http://localhost:5173/login${NC}"
echo -e "4. Use: ${GREEN}admin@bgce.com / Admin@123${NC}"
