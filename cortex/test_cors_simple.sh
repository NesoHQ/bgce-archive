#!/bin/bash

echo "Testing CORS..."
echo ""

# Test OPTIONS request
echo "1. Testing OPTIONS (preflight):"
curl -X OPTIONS http://localhost:5000/api/v1/auth/login \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -i 2>&1 | grep -i "access-control"

echo ""
echo "2. Testing POST request:"
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Origin: http://localhost:5173" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bgce.com","password":"Admin@123"}' \
  -i 2>&1 | head -20

echo ""
echo "Done!"
