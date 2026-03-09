
# 部署指南 (Deployment Guide)

本项目采用 Docker Compose 进行一键部署，包含后端 API、H5 商家端和 Web 管理后台。

## 1. 前置要求

服务器需安装：
- Docker
- Docker Compose

## 2. 部署步骤

### 步骤 1：上传代码
将整个项目目录上传到服务器（建议使用 git clone）。

### 步骤 2：配置环境变量
在项目根目录创建 `.env` 文件，填入以下内容：

```env
# 数据库配置
DB_HOST=152.136.49.209
DB_PORT=3306
DB_USERNAME=member_sys
DB_PASSWORD=member_sys@@
DB_DATABASE=barber_crm

# JWT 配置
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=24h
```

### 步骤 3：启动服务
在项目根目录下运行：

```bash
docker-compose up -d --build
```

此命令将自动构建镜像并启动所有容器。

## 3. 访问服务

- **后端 API**: `http://<服务器IP>:3000`
- **H5 商家端**: `http://<服务器IP>:3001`
- **Web 管理后台**: `http://<服务器IP>:3002`

## 4. 常用维护命令

- 查看日志：`docker-compose logs -f`
- 重启服务：`docker-compose restart`
- 停止服务：`docker-compose down`
- 更新部署：
  ```bash
  git pull
  docker-compose up -d --build
  ```
