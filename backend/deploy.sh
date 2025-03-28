#!/bin/bash

echo "🚀 Starting deployment process..."

echo "📥 Pulling latest changes..."
git pull

echo "📦 Installing dependencies..."
npm install

echo "🛠️ Converting TypeScript config files to JavaScript..."
node convert-config.js

echo "💾 Setting up memory optimization..."
export NODE_OPTIONS="--max-old-space-size=512"

echo "🔨 Building application..."
npm run build

echo "🔄 Restarting PM2 process..."
pm2 stop strapi || true
pm2 del strapi || true
pm2 start ecosystem.config.js
pm2 save

echo "✅ Deployment complete!"
echo "📊 Checking PM2 status..."
pm2 list
echo "📝 Checking logs..."
pm2 logs --lines 20