#!/bin/bash

# ==========================================
# 理发店会员管理系统 - PM2 一键部署脚本
# ==========================================

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查命令是否存在
check_command() {
    if ! command -v "$1" &> /dev/null; then
        log_error "$1 未安装，请先安装: $2"
        exit 1
    fi
}

# 获取项目根目录
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_ROOT"

echo "=========================================="
echo "  理发店会员管理系统 - PM2 一键部署"
echo "=========================================="
echo ""

# 检查 Node.js 和 PM2
log_info "检查系统环境..."
check_command "node" "https://nodejs.org/"
check_command "npm" "https://nodejs.org/"
check_command "pm2" "npm install -g pm2"

NODE_VERSION=$(node -v)
PM2_VERSION=$(pm2 -v)
log_success "Node.js 版本：$NODE_VERSION"
log_success "PM2 版本：$PM2_VERSION"

# 检查 pnpm
if command -v pnpm &> /dev/null; then
    PNPM_VERSION=$(pnpm -v)
    log_success "pnpm 版本：$PNPM_VERSION"
    USE_PNPM=true
else
    log_warning "pnpm 未安装，将使用 npm"
    USE_PNPM=false
fi

# 安装依赖
log_info "安装项目依赖..."

if [ "$USE_PNPM" = true ]; then
    log_info "使用 pnpm 安装依赖..."
    pnpm install
else
    log_info "使用 npm 安装依赖..."
    npm install
fi

log_success "根依赖安装完成"

# 安装各个包的依赖
log_info "安装各个模块依赖..."

if [ "$USE_PNPM" = true ]; then
    pnpm install --filter @barber-crm/backend
    pnpm install --filter @barber-crm/admin-web
    pnpm install --filter @barber-crm/h5-merchant
else
    cd packages/backend && npm install && cd ../..
    cd packages/admin-web && npm install && cd ../..
    cd packages/h5-merchant && npm install && cd ../..
fi

log_success "所有模块依赖安装完成"

# 构建后端
log_info "构建后端服务..."
cd packages/backend
if [ "$USE_PNPM" = true ]; then
    pnpm run build
else
    npm run build
fi
cd ../..
log_success "后端构建完成"

# 构建前端
log_info "构建管理后台前端..."
cd packages/admin-web
if [ "$USE_PNPM" = true ]; then
    pnpm run build
else
    npm run build
fi
cd ../..
log_success "管理后台前端构建完成"

log_info "构建商家端 H5 前端..."
cd packages/h5-merchant
if [ "$USE_PNPM" = true ]; then
    pnpm run build
else
    npm run build
fi
cd ../..
log_success "商家端 H5 前端构建完成"

# 停止现有的 PM2 应用
log_info "停止现有的 PM2 应用..."
pm2 stop barber-backend 2>/dev/null || true
pm2 stop barber-h5 2>/dev/null || true
pm2 stop barber-admin 2>/dev/null || true

# 删除现有的 PM2 应用
log_info "删除现有的 PM2 应用..."
pm2 delete barber-backend 2>/dev/null || true
pm2 delete barber-h5 2>/dev/null || true
pm2 delete barber-admin 2>/dev/null || true

# 启动后端服务
log_info "启动后端服务..."
cd packages/backend
pm2 start npm --name barber-backend -- run start:prod
cd ../..
log_success "后端服务已启动"

# 安装 http-server 用于静态文件服务
log_info "检查并安装 http-server..."
if ! npm list -g http-server &> /dev/null; then
    npm install -g http-server
fi

# 启动 H5 商家端
log_info "启动 H5 商家端 (端口 3001)..."
cd packages/h5-merchant
pm2 serve ./dist 3001 --name barber-h5 --spa
cd ../..
log_success "H5 商家端已启动 (端口 3001)"

# 启动管理后台
log_info "启动管理后台 (端口 3002)..."
cd packages/admin-web
pm2 serve ./dist 3002 --name barber-admin --spa
cd ../..
log_success "管理后台已启动 (端口 3002)"

# 等待服务启动
log_info "等待服务启动..."
sleep 5

# 查看 PM2 状态
echo ""
log_info "=== PM2 应用状态 ==="
pm2 status

# 保存 PM2 配置
log_info "保存 PM2 配置..."
pm2 save

# 显示访问信息
echo ""
echo "=========================================="
echo -e "${GREEN}  部署完成！${NC}"
echo "=========================================="
echo ""
echo "服务访问地址:"
echo "  🔹 后端 API:      http://localhost:3000"
echo "  🔹 H5 商家端：http://localhost:3001"
echo "  🔹 管理后台：http://localhost:3002"
echo ""
echo "PM2 常用命令:"
echo "  pm2 status          # 查看应用状态"
echo "  pm2 logs            # 查看日志"
echo "  pm2 restart all     # 重启所有应用"
echo "  pm2 stop all        # 停止所有应用"
echo "  pm2 delete all      # 删除所有应用"
echo "  pm2 monit           # 监控资源使用"
echo ""
echo "开机自启命令:"
echo "  pm2 startup"
echo "  pm2 save"
echo ""
log_success "部署成功！"
