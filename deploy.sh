#!/bin/bash

# 快速部署脚本 - 根据传入的参数构建并重启对应服务
# 使用说明: 在项目根目录下执行 ./deploy.sh [选项] [服务器IP]

set -e

# 获取脚本所在目录的父目录（项目根目录）
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# 获取服务器IP地址（默认localhost）
SERVER_IP="${2:-localhost}"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 显示帮助信息
show_help() {
    echo "用法: ./deploy.sh [服务名称]"
    echo ""
    echo "服务选项:"
    echo "  backend     - 仅部署后端服务"
    echo "  admin       - 仅部署管理后台"
    echo "  h5          - 仅部署H5商家端"
    echo "  frontend    - 部署所有前端服务"
    echo "  all         - 部署所有服务 (默认)"
    echo "  status      - 查看服务状态"
    echo ""
    echo "示例:"
    echo "  ./deploy.sh            # 部署所有服务"
    echo "  ./deploy.sh all        # 部署所有服务"
    echo "  ./deploy.sh backend    # 仅部署后端"
    echo "  ./deploy.sh admin      # 仅部署管理后台"
    echo "  ./deploy.sh h5         # 仅部署H5商家端"
    echo "  ./deploy.sh frontend   # 部署所有前端服务"
    echo "  ./deploy.sh status     # 查看状态"
    echo ""
    echo "说明: 脚本自动检测项目根目录，可以在任何位置执行"
}

# 查看服务状态
show_status() {
    print_info "PM2 服务状态"
    echo ""
    pm2 list
    echo ""
    print_info "服务详细信息"
    echo ""
    pm2 info barber-backend
    pm2 info barber-admin
    pm2 info barber-h5
}

# 部署后端
deploy_backend() {
    print_info "开始部署后端服务..."

    cd "$SCRIPT_DIR/packages/backend"

    print_info "构建后端项目..."
    npm run build

    print_info "启动/重启后端服务..."
    cd "$SCRIPT_DIR"

    # 检查进程是否存在
    if pm2 describe barber-backend > /dev/null 2>&1; then
        print_info "后端服务已存在，执行重启..."
        pm2 restart barber-backend
    else
        print_info "首次部署后端服务，执行启动..."
        pm2 start ecosystem.config.js --only barber-backend
    fi

    sleep 2

    if pm2 describe barber-backend | grep -q "status.*online"; then
        print_success "后端服务部署成功！"
    else
        print_error "后端服务部署失败，请查看日志"
        pm2 logs barber-backend --lines 20
        exit 1
    fi
}

# 部署管理后台
deploy_admin() {
    print_info "开始部署管理后台..."

    cd "$SCRIPT_DIR/packages/admin-web"

    print_info "构建管理后台 (API URL: http://${SERVER_IP}:3000)..."
    VITE_API_URL="http://${SERVER_IP}:3000" npm run build

    print_info "启动/重启管理后台服务..."
    cd "$SCRIPT_DIR"

    # 检查进程是否存在
    if pm2 describe barber-admin > /dev/null 2>&1; then
        print_info "管理后台服务已存在，执行重启..."
        pm2 restart barber-admin
    else
        print_info "首次部署管理后台服务，执行启动..."
        pm2 start ecosystem.config.js --only barber-admin
    fi

    sleep 2

    if pm2 describe barber-admin | grep -q "status.*online"; then
        print_success "管理后台部署成功！"
    else
        print_error "管理后台部署失败，请查看日志"
        pm2 logs barber-admin --lines 20
        exit 1
    fi
}

# 部署H5商家端
deploy_h5() {
    print_info "开始部署H5商家端..."

    cd "$SCRIPT_DIR/packages/h5-merchant"

    print_info "构建H5商家端 (API URL: http://${SERVER_IP}:3000)..."
    VITE_API_URL="http://${SERVER_IP}:3000" npm run build

    print_info "启动/重启H5商家端服务..."
    cd "$SCRIPT_DIR"

    # 检查进程是否存在
    if pm2 describe barber-h5 > /dev/null 2>&1; then
        print_info "H5商家端服务已存在，执行重启..."
        pm2 restart barber-h5
    else
        print_info "首次部署H5商家端服务，执行启动..."
        pm2 start ecosystem.config.js --only barber-h5
    fi

    sleep 2

    if pm2 describe barber-h5 | grep -q "status.*online"; then
        print_success "H5商家端部署成功！"
    else
        print_error "H5商家端部署失败，请查看日志"
        pm2 logs barber-h5 --lines 20
        exit 1
    fi
}

# 部署所有前端服务
deploy_frontend() {
    print_info "开始部署所有前端服务..."
    deploy_admin
    deploy_h5
}

# 部署所有服务
deploy_all() {
    print_info "开始部署所有服务..."
    deploy_backend
    deploy_frontend
    
    print_success "所有服务部署完成！"
    echo ""
    print_info "服务访问地址:"
    echo "  - 后端API: http://localhost:3000"
    echo "  - H5商家端: http://localhost:3001"
    echo "  - 管理后台: http://localhost:3002"
}

# 主逻辑
case "${1:-all}" in
    backend)
        deploy_backend
        ;;
    admin)
        deploy_admin
        ;;
    h5)
        deploy_h5
        ;;
    frontend)
        deploy_frontend
        ;;
    all)
        deploy_all
        ;;
    status)
        show_status
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        print_error "未知的服务: $1"
        echo ""
        show_help
        exit 1
        ;;
esac
