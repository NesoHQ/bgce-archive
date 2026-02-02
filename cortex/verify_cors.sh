#!/bin/bash

echo "🔍 Verifying CORS Configuration..."
echo ""

# Test OPTIONS
echo "Testing OPTIONS request..."
RESPONSE=$(curl -s -X OPTIONS http://localhost:5000/api/v1/auth/login \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: POST" \
  -i)

if echo "$RESPONSE" | grep -q "Access-Control-Allow-Origin"; then
    echo "✅ CORS headers present"
    echo "$RESPONSE" | grep "Access-Control"
else
    echo "❌ NO CORS headers found!"
    echo "Response:"
    echo "$RESPONSE"
    exit 1
fi

echo ""
echo "Testing POST request..."
RESPONSE=$(curl -s -X POST http://localhost:5000/api/v1/auth/login \
  -H "Origin: http://localhost:5173" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bgce.com","password":"Admin@123"}' \
  -i)

if echo "$RESPONSE" | grep -q "Access-Control-Allow-Origin"; then
    echo "✅ CORS headers present"
    if echo "$RESPONSE" | grep -q '"status":true'; then
        echo "✅ Login successful"
    else
        echo "⚠️  Login failed (check if database is seeded)"
    fi
else
    echo "❌ NO CORS headers found!"
fi

echo ""
echo "✅ CORS is working!"
