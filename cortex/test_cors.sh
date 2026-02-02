#!/bin/bash

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Testing CORS Configuration...${NC}\n"

# Test 1: Preflight
echo -e "${YELLOW}1. Testing preflight request (OPTIONS)...${NC}"
PREFLIGHT_STATUS=$(curl -X OPTIONS http://localhost:5000/api/v1/auth/login \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type,Authorization" \
  -s -o /dev/null -w "%{http_code}")

if [ "$PREFLIGHT_STATUS" = "200" ] || [ "$PREFLIGHT_STATUS" = "204" ]; then
  echo -e "${GREEN}✓ Preflight request successful (Status: $PREFLIGHT_STATUS)${NC}\n"
else
  echo -e "${RED}✗ Preflight request failed (Status: $PREFLIGHT_STATUS)${NC}\n"
fi

# Test 2: Login
echo -e "${YELLOW}2. Testing login request (POST)...${NC}"
LOGIN_RESPONSE=$(curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Origin: http://localhost:5173" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bgce.com","password":"Admin@123"}' \
  -s -w "\n%{http_code}")

LOGIN_STATUS=$(echo "$LOGIN_RESPONSE" | tail -n1)
LOGIN_BODY=$(echo "$LOGIN_RESPONSE" | head -n-1)

if [ "$LOGIN_STATUS" = "200" ]; then
  echo -e "${GREEN}✓ Login request successful (Status: $LOGIN_STATUS)${NC}"
  echo "$LOGIN_BODY" | jq '.' 2>/dev/null || echo "$LOGIN_BODY"
  echo ""
else
  echo -e "${RED}✗ Login request failed (Status: $LOGIN_STATUS)${NC}"
  echo "$LOGIN_BODY"
  echo ""
fi

# Test 3: CORS Headers
echo -e "${YELLOW}3. Checking CORS headers...${NC}"
CORS_HEADERS=$(curl -X OPTIONS http://localhost:5000/api/v1/auth/login \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: POST" \
  -s -i | grep -i "access-control")

if [ -n "$CORS_HEADERS" ]; then
  echo -e "${GREEN}✓ CORS headers present:${NC}"
  echo "$CORS_HEADERS"
  echo ""
else
  echo -e "${RED}✗ No CORS headers found${NC}\n"
fi

# Test 4: Protected Route
echo -e "${YELLOW}4. Testing protected route...${NC}"
if [ "$LOGIN_STATUS" = "200" ]; then
  TOKEN=$(echo "$LOGIN_BODY" | jq -r '.data.token' 2>/dev/null)
  
  if [ -n "$TOKEN" ] && [ "$TOKEN" != "null" ]; then
    PROFILE_STATUS=$(curl -X GET http://localhost:5000/api/v1/users/profile \
      -H "Origin: http://localhost:5173" \
      -H "Authorization: Bearer $TOKEN" \
      -s -o /dev/null -w "%{http_code}")
    
    if [ "$PROFILE_STATUS" = "200" ]; then
      echo -e "${GREEN}✓ Protected route accessible with token (Status: $PROFILE_STATUS)${NC}\n"
    else
      echo -e "${RED}✗ Protected route failed (Status: $PROFILE_STATUS)${NC}\n"
    fi
  else
    echo -e "${YELLOW}⚠ Could not extract token from login response${NC}\n"
  fi
else
  echo -e "${YELLOW}⚠ Skipping (login failed)${NC}\n"
fi

# Summary
echo -e "${YELLOW}================================${NC}"
echo -e "${YELLOW}Summary${NC}"
echo -e "${YELLOW}================================${NC}"

if [ "$PREFLIGHT_STATUS" = "200" ] || [ "$PREFLIGHT_STATUS" = "204" ]; then
  if [ "$LOGIN_STATUS" = "200" ]; then
    echo -e "${GREEN}✓ CORS is working correctly!${NC}"
    echo -e "${GREEN}✓ Frontend should be able to connect${NC}"
  else
    echo -e "${YELLOW}⚠ CORS works but login failed${NC}"
    echo -e "${YELLOW}  Check if database is seeded: make seed-docker${NC}"
  fi
else
  echo -e "${RED}✗ CORS is not working${NC}"
  echo -e "${RED}  Try: make docker-restart${NC}"
fi

echo ""
