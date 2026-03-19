#!/bin/bash

echo "=========================================="
echo "API配置验证测试"
echo "=========================================="

# 测试1: 后端服务直接访问
echo -e "\n[测试1] 直接访问后端服务 (localhost:3000)"
echo "URL: http://localhost:3000/merchants"
RESPONSE1=$(curl -s http://localhost:3000/merchants)
if echo "$RESPONSE1" | grep -q '"message":"Unauthorized"'; then
    echo "✅ 后端服务正常 (需要认证)"
else
    echo "❌ 后端服务异常"
    echo "响应: $RESPONSE1"
fi

# 测试2: 前端页面访问
echo -e "\n[测试2] 前端页面访问 (localhost:3002)"
echo "URL: http://localhost:3002/"
RESPONSE2=$(curl -s http://localhost:3002 | head -5)
if echo "$RESPONSE2" | grep -q "DOCTYPE html"; then
    echo "✅ 前端页面正常"
else
    echo "❌ 前端页面异常"
fi

# 测试3: 检查构建文件中的API配置
echo -e "\n[测试3] 检查构建文件中的API URL配置"
echo "Admin Web:"
if grep -q "http://localhost:3000" /Users/SL/CodeBuddy/20260201123311/packages/admin-web/dist/assets/*.js; then
    echo "✅ admin-web 正确配置 API URL: http://localhost:3000"
else
    echo "❌ admin-web API URL 配置错误"
fi

echo "H5 Merchant:"
if grep -q "http://localhost:3000" /Users/SL/CodeBuddy/20260201123311/packages/h5-merchant/dist/assets/*.js; then
    echo "✅ h5-merchant 正确配置 API URL: http://localhost:3000"
else
    echo "❌ h5-merchant API URL 配置错误"
fi

# 测试4: PM2 进程状态
echo -e "\n[测试4] PM2 进程状态"
pm2 list --no-color

echo -e "\n=========================================="
echo "测试完成"
echo "=========================================="
echo -e "\n说明："
echo "1. Vite 的 proxy 配置仅在开发环境 (npm run dev) 下生效"
echo "2. 生产环境使用 serve 静态服务器，需要明确配置 VITE_API_URL"
echo "3. 已创建 .env.production 文件并更新了 ecosystem.config.js"
echo "4. 前端应用已重新构建，API 请求现在将直接发送到 http://localhost:3000"
