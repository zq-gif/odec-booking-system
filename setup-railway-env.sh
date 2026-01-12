#!/bin/bash

# Railway Environment Setup Script for ODEC Booking System
# This script configures all necessary environment variables for Railway deployment

set -e

echo "🚀 Setting up Railway Environment Variables..."
echo ""

# Check if railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Error: Railway CLI is not installed."
    echo "Install it with: npm install -g @railway/cli"
    exit 1
fi

# Check if logged in
if ! railway whoami &> /dev/null; then
    echo "❌ Error: Not logged into Railway."
    echo "Run: railway login"
    exit 1
fi

# Check if project is linked
if ! railway status &> /dev/null; then
    echo "❌ Error: No Railway project linked."
    echo "Run: railway link"
    exit 1
fi

echo "✅ Railway CLI configured correctly"
echo ""

# Get APP_KEY from local .env
APP_KEY=$(grep -E "^APP_KEY=" .env | cut -d '=' -f2)

if [ -z "$APP_KEY" ]; then
    echo "⚠️  No APP_KEY found in .env file. Generating new one..."
    APP_KEY=$(php artisan key:generate --show)
fi

echo "📝 Setting environment variables..."
echo ""

# Application Settings
railway variables set APP_NAME="ODEC Booking System"
railway variables set APP_ENV=production
railway variables set APP_DEBUG=false
railway variables set APP_KEY="$APP_KEY"

# Database Configuration (Railway MySQL)
# Note: Railway automatically injects MYSQLHOST, MYSQLPORT, etc. from the MySQL service
# We just need to tell Laravel to use them directly
railway variables set DB_CONNECTION=mysql
railway variables set DB_HOST='${{MYSQLHOST}}'
railway variables set DB_PORT='${{MYSQLPORT}}'
railway variables set DB_DATABASE='${{MYSQLDATABASE}}'
railway variables set DB_USERNAME='${{MYSQLUSER}}'
railway variables set DB_PASSWORD='${{MYSQLPASSWORD}}'

# Session & Cache
railway variables set SESSION_DRIVER=file
railway variables set SESSION_LIFETIME=120
railway variables set CACHE_DRIVER=file
railway variables set QUEUE_CONNECTION=sync

# Filesystem
railway variables set FILESYSTEM_DISK=public

# Logging
railway variables set LOG_CHANNEL=stack
railway variables set LOG_LEVEL=error

# Security
railway variables set TRUST_PROXIES="*"

# Localization
railway variables set APP_LOCALE=en
railway variables set APP_FALLBACK_LOCALE=en

echo ""
echo "✅ All environment variables set successfully!"
echo ""
echo "📋 Next steps:"
echo "   1. Deploy your application: railway up"
echo "   2. Generate domain: railway domain"
echo "   3. Set APP_URL with your domain: railway variables set APP_URL='https://your-domain.up.railway.app'"
echo "   4. Create admin user: railway run php artisan tinker"
echo ""
echo "🎉 Setup complete!"
