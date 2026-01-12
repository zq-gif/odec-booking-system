#!/bin/bash

# Railway MySQL Connection Fix Script
# This script properly sets Railway environment variables to reference the MySQL service

echo "🔧 Fixing Railway MySQL Environment Variables..."
echo ""

# Check if railway CLI is installed and logged in
if ! command -v railway &> /dev/null; then
    echo "❌ Error: Railway CLI is not installed."
    echo "Install it with: npm install -g @railway/cli"
    exit 1
fi

if ! railway whoami &> /dev/null; then
    echo "❌ Error: Not logged into Railway."
    echo "Run: railway login"
    exit 1
fi

echo "✅ Railway CLI ready"
echo ""
echo "📝 Setting MySQL environment variables as references..."
echo ""

# Remove old variables (if they exist)
railway variables --remove DB_HOST 2>/dev/null || true
railway variables --remove DB_PORT 2>/dev/null || true
railway variables --remove DB_DATABASE 2>/dev/null || true
railway variables --remove DB_USERNAME 2>/dev/null || true
railway variables --remove DB_PASSWORD 2>/dev/null || true

# Set database connection variables as references to MySQL service
# Note: Railway CLI doesn't support setting references directly via command line
# You MUST do this via the Railway Dashboard web interface

echo "⚠️  IMPORTANT: Railway CLI cannot set variable references directly."
echo ""
echo "Please follow these steps in the Railway Dashboard:"
echo ""
echo "1. Go to https://railway.app"
echo "2. Select your project → Click 'Web Service' (NOT MySQL)"
echo "3. Go to 'Variables' tab"
echo "4. Delete these variables if they exist:"
echo "   - DB_HOST"
echo "   - DB_PORT"
echo "   - DB_DATABASE"
echo "   - DB_USERNAME"
echo "   - DB_PASSWORD"
echo ""
echo "5. Click 'New Variable' and select 'Add a Reference'"
echo "6. Add each of these as REFERENCES (not raw variables):"
echo ""
echo "   Variable Name: DB_HOST"
echo "   Reference: MySQL.MYSQLHOST"
echo ""
echo "   Variable Name: DB_PORT"
echo "   Reference: MySQL.MYSQLPORT"
echo ""
echo "   Variable Name: DB_DATABASE"
echo "   Reference: MySQL.MYSQLDATABASE"
echo ""
echo "   Variable Name: DB_USERNAME"
echo "   Reference: MySQL.MYSQLUSER"
echo ""
echo "   Variable Name: DB_PASSWORD"
echo "   Reference: MySQL.MYSQLPASSWORD"
echo ""
echo "7. Ensure DB_CONNECTION=mysql exists"
echo ""
echo "8. Railway will automatically redeploy with correct variables"
echo ""
echo "✅ After setting these, your MySQL connection will work!"
