
# 部署指南 (PM2 方式)

本项目使用 PM2 进行进程管理，支持后端 API、H5 商家端和 Web 管理后台的一键部署。

## 1. 前置要求

服务器需安装：
- Node.js (v16+)
- npm

## 2. 部署步骤

### 步骤 1：上传代码
将整个项目目录上传到服务器。

### 步骤 2：配置环境变量
在 `packages/backend/` 目录下创建 `.env` 文件，填入数据库配置（参考 `packages/backend/.env.example` 或之前的配置）。

### 步骤 3：执行部署脚本
在项目根目录下运行：

```bash
./deploy.sh
```

此脚本会自动：
1. 安装全局依赖 (pm2, serve)
2. 安装项目依赖
3. 构建所有子项目 (Backend, H5, Admin)
4. 使用 PM2 启动服务

## 3. 访问服务

- **Backend API**: `http://<服务器IP>:3000`
- **H5 Merchant**: `http://<服务器IP>:3001`
- **Admin Web**: `http://<服务器IP>:3002`

## 4. 常用维护命令

- 查看服务状态：`pm2 status`
- 查看日志：`pm2 logs`
- 重启所有服务：`pm2 restart all`
- 停止所有服务：`pm2 stop all`
