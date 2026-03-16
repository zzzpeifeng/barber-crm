#!/bin/bash

# ==========================================
# 快速部署脚本 - 最简版本
# ==========================================

set -e

echo "🚀 开始快速部署..."

# 检查 PM2
if ! command -v pm2 &> /dev/null; then
    echo "❌ PM2 未安装，正在安装..."
    npm install -g pm2 http-server
fi

# 安装依赖
echo "📦 安装依赖..."
npm install || pnpm install

# 构建
echo "🔨 构建项目..."
cd packages/backend && npm run build && cd ../..
cd packages/admin-web && npm run build && cd ../..
cd packages/h5-merchant && npm run build && cd ../..

# 停止现有服务
echo "⏹️  停止现有服务..."
pm2 delete barber-backend 2>/dev/null || true
pm2 delete barber-h5 2>/dev/null || true
pm2 delete barber-admin 2>/dev/null || true

# 启动服务
echo "▶️  启动服务..."
cd packages/backend && pm2 start npm --name barber-backend -- run start:prod && cd ../..
cd packages/h5-merchant && pm2 serve ./dist 3001 --name barber-h5 --spa && cd ../..
cd packages/admin-web && pm2 serve ./dist 3002 --name barber-admin --spa && cd ../..

# 保存配置
echo "💾 保存 PM2 配置..."
pm2 save

echo ""
echo "✅ 部署完成！"
echo ""
echo "访问地址:"
echo "  后端：http://localhost:3000"
echo "  H5:   http://localhost:3001"
echo "  管理：http://localhost:3002"
echo ""
echo "查看状态：pm2 status"
echo "查看日志：pm2 logs"
