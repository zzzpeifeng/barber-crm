
# 部署指南 (Deployment Guide)

本项目采用 PM2 进行进程管理部署，包含后端 API、H5 商家端和 Web 管理后台。

## 1. 前置要求

服务器需安装：
- Node.js (推荐 v18 或更高版本)
- pnpm (或 npm)
- PM2
- MySQL

### 安装依赖
```bash
# 安装 PM2
npm install -g pm2

# 安装项目依赖
pnpm install
```

## 2. 部署步骤

### 步骤 1：上传代码
将整个项目目录上传到服务器（建议使用 git clone）。

### 步骤 2：配置环境变量
在项目根目录创建 `.env` 文件，填入以下内容：

```env
# 数据库配置
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password_here
DB_DATABASE=barber_crm

# JWT 配置
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=24h
```

### 步骤 3：部署服务

#### 本地部署（仅用于开发测试）
```bash
./deploy.sh all
```

#### 服务器部署（推荐）
```bash
# 将 <服务器IP> 替换为实际的服务器 IP 地址
./deploy.sh all <服务器IP>

# 例如：服务器 IP 为 192.168.1.100
./deploy.sh all 192.168.1.100
```

#### 部署单个服务
```bash
# 仅部署后端
./deploy.sh backend

# 仅部署管理后台（需要指定服务器 IP）
./deploy.sh admin <服务器IP>

# 仅部署 H5 商家端（需要指定服务器 IP）
./deploy.sh h5 <服务器IP>

# 部署所有前端服务（需要指定服务器 IP）
./deploy.sh frontend <服务器IP>
```

#### 查看服务状态
```bash
./deploy.sh status
```

#### 查看帮助信息
```bash
./deploy.sh help
```

## 3. 访问服务

- **后端 API**: `http://<服务器IP>:3000`
- **H5 商家端**: `http://<服务器IP>:3001`
- **Web 管理后台**: `http://<服务器IP>:3002`

## 4. 常用维护命令

### PM2 命令
```bash
# 查看所有进程状态
pm2 list

# 查看日志
pm2 logs

# 重启所有服务
pm2 restart all

# 重启指定服务
pm2 restart barber-backend
pm2 restart barber-admin
pm2 restart barber-h5

# 停止所有服务
pm2 stop all

# 删除所有服务
pm2 delete all
```

### 更新部署
```bash
# 拉取最新代码
git pull

# 重新部署所有服务
./deploy.sh all <服务器IP>
```

### 查看日志
```bash
# 查看后端日志
pm2 logs barber-backend

# 查看管理后台日志
pm2 logs barber-admin

# 查看H5商家端日志
pm2 logs barber-h5
```

## 5. 注意事项

1. **首次部署必须指定服务器 IP**：前端构建时需要传入实际的服务器 IP 地址，否则登录会提示网络错误。

2. **环境变量配置**：确保 `.env` 文件配置正确，特别是数据库连接信息。

3. **端口占用**：确保 3000、3001、3002 端口没有被其他服务占用。

4. **防火墙设置**：确保服务器防火墙已开放相关端口（3000、3001、3002）。

5. **数据持久化**：定期备份数据库，避免数据丢失。

