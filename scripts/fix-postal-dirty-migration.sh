#!/bin/bash

# Script to fix dirty migration state in postal database

echo "🔧 Fixing dirty migration state in postal_db..."
echo ""

# Database connection details
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_USER="${DB_USER:-postgres}"
DB_PASSWORD="${DB_PASSWORD:-root}"
DB_NAME="postal_db"

echo "📊 Database: $DB_NAME"
echo ""

# Check current migration state
echo "🔍 Checking current migration state..."
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT * FROM postal_schema_migrations;"

echo ""
echo "🗑️  Fixing dirty state by setting dirty=false..."

# Fix the dirty state
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "UPDATE postal_schema_migrations SET dirty = false WHERE version = 1;"

if [ $? -eq 0 ]; then
    echo "✅ Dirty state fixed!"
    echo ""
    echo "🔍 New migration state:"
    PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT * FROM postal_schema_migrations;"
    echo ""
    echo "✅ Done! Now you can restart postal service:"
    echo "   make dev"
else
    echo "❌ Failed to fix dirty state"
    echo ""
    echo "💡 Alternative: Drop and recreate the database:"
    echo "   PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -c 'DROP DATABASE IF EXISTS postal_db;'"
    echo "   PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -c 'CREATE DATABASE postal_db;'"
    exit 1
fi
