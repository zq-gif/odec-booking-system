#!/bin/bash

echo "🚀 Starting Railway Deployment Script..."

# Install dependencies
echo "📦 Installing Composer dependencies..."
composer install --optimize-autoloader --no-dev --no-interaction

# Install Node dependencies
echo "📦 Installing Node dependencies..."
npm ci

# Build assets
echo "🔨 Building frontend assets..."
npm run build

# Clear caches
echo "🧹 Clearing Laravel caches..."
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear

# Optimize for production
echo "⚡ Optimizing for production..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run migrations
echo "🗄️ Running database migrations..."
php artisan migrate --force

# Create storage link
echo "🔗 Creating storage symlink..."
php artisan storage:link

# Generate application key if not set
if [ -z "$APP_KEY" ]; then
  echo "🔑 Generating application key..."
  php artisan key:generate --force
fi

echo "✅ Deployment complete!"
echo "🌐 Starting application server..."
