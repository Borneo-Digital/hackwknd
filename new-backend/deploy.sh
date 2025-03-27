#!/bin/bash

echo "🚀 Starting deployment process..."

echo "📥 Pulling latest changes..."
git pull

echo "📦 Installing dependencies..."
npm install

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