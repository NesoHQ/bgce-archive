#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

API_URL="http://localhost:5000/api/v1"

echo -e "${YELLOW}Testing Cortex Authentication API${NC}\n"

# Test 1: Register a new user
echo -e "${YELLOW}1. Testing user registration...${NC}"
REGISTER_RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "full_name": "Test User"
  }')

echo "$REGISTER_RESPONSE" | jq '.'

if echo "$REGISTER_RESPONSE" | jq -e '.status == true' > /dev/null; then
  echo -e "${GREEN}✓ Registration successful${NC}\n"
else
  echo -e "${RED}✗ Registration failed${NC}\n"
fi

# Test 2: Login
echo -e "${YELLOW}2. Testing user login...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }')

echo "$LOGIN_RESPONSE" | jq '.'

TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.token')

if [ "$TOKEN" != "null" ] && [ -n "$TOKEN" ]; then
  echo -e "${GREEN}✓ Login successful${NC}"
  echo -e "Token: ${TOKEN:0:50}...\n"
else
  echo -e "${RED}✗ Login failed${NC}\n"
  exit 1
fi

# Test 3: Get Profile
echo -e "${YELLOW}3. Testing get profile (protected route)...${NC}"
PROFILE_RESPONSE=$(curl -s -X GET "$API_URL/users/profile" \
  -H "Authorization: Bearer $TOKEN")

echo "$PROFILE_RESPONSE" | jq '.'

if echo "$PROFILE_RESPONSE" | jq -e '.status == true' > /dev/null; then
  echo -e "${GREEN}✓ Profile retrieved successfully${NC}\n"
else
  echo -e "${RED}✗ Profile retrieval failed${NC}\n"
fi

# Test 4: Update Profile
echo -e "${YELLOW}4. Testing update profile...${NC}"
UPDATE_RESPONSE=$(curl -s -X PUT "$API_URL/users/profile" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Updated Test User"
  }')

echo "$UPDATE_RESPONSE" | jq '.'

if echo "$UPDATE_RESPONSE" | jq -e '.status == true' > /dev/null; then
  echo -e "${GREEN}✓ Profile updated successfully${NC}\n"
else
  echo -e "${RED}✗ Profile update failed${NC}\n"
fi

# Test 5: Create Category (protected route)
echo -e "${YELLOW}5. Testing create category (protected route)...${NC}"
CATEGORY_RESPONSE=$(curl -s -X POST "$API_URL/categories" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "test-category",
    "label": "Test Category",
    "description": "A test category"
  }')

echo "$CATEGORY_RESPONSE" | jq '.'

if echo "$CATEGORY_RESPONSE" | jq -e '.status' > /dev/null; then
  echo -e "${GREEN}✓ Category created successfully${NC}\n"
else
  echo -e "${RED}✗ Category creation failed${NC}\n"
fi

# Test 6: Test without token (should fail)
echo -e "${YELLOW}6. Testing protected route without token (should fail)...${NC}"
NO_AUTH_RESPONSE=$(curl -s -X POST "$API_URL/categories" \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "test-category-2",
    "label": "Test Category 2"
  }')

echo "$NO_AUTH_RESPONSE" | jq '.'

if echo "$NO_AUTH_RESPONSE" | jq -e '.message | contains("Unauthorized")' > /dev/null; then
  echo -e "${GREEN}✓ Correctly rejected unauthorized request${NC}\n"
else
  echo -e "${RED}✗ Should have rejected unauthorized request${NC}\n"
fi

echo -e "${GREEN}All tests completed!${NC}"
