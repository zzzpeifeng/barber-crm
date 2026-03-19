#!/bin/bash

# 快速部署脚本 - 根据传入的参数构建并重启对应服务

set -e

PROJECT_ROOT="/Users/SL/CodeBuddy/20260201123311"
cd "$PROJECT_ROOT"

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
    echo "用法: $0 [服务名称]"
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
    echo "  $0 all        # 部署所有服务"
    echo "  $0 backend    # 仅部署后端"
    echo "  $0 status     # 查看状态"
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
    
    cd "$PROJECT_ROOT/packages/backend"
    
    print_info "构建后端项目..."
    npm run build
    
    print_info "重启后端服务..."
    cd "$PROJECT_ROOT"
    pm2 restart barber-backend
    
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
    
    cd "$PROJECT_ROOT/packages/admin-web"
    
    print_info "构建管理后台..."
    npm run build
    
    print_info "重启管理后台服务..."
    cd "$PROJECT_ROOT"
    pm2 restart barber-admin
    
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
    
    cd "$PROJECT_ROOT/packages/h5-merchant"
    
    print_info "构建H5商家端..."
    npm run build
    
    print_info "重启H5商家端服务..."
    cd "$PROJECT_ROOT"
    pm2 restart barber-h5
    
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
