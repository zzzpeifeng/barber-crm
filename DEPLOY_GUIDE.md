# 部署指南

## 快速部署

使用部署脚本进行快速部署：

```bash
# 添加执行权限
chmod +x deploy.sh

# 部署所有服务
./deploy.sh all

# 仅部署后端
./deploy.sh backend

# 仅部署管理后台
./deploy.sh admin

# 仅部署H5商家端
./deploy.sh h5

# 部署所有前端服务
./deploy.sh frontend

# 查看服务状态
./deploy.sh status
```

## 手动部署步骤

### 1. 修改后端代码后

```bash
# 进入后端目录
cd packages/backend

# 构建项目
npm run build

# 重启后端服务
pm2 restart barber-backend

# 查看日志
pm2 logs barber-backend --lines 20
```

### 2. 修改前端代码后

#### 管理后台
```bash
cd packages/admin-web
npm run build
pm2 restart barber-admin
pm2 logs barber-admin --lines 10
```

#### H5商家端
```bash
cd packages/h5-merchant
npm run build
pm2 restart barber-h5
pm2 logs barber-h5 --lines 10
```

## 常用 PM2 命令

```bash
# 查看所有进程状态
pm2 list

# 查看进程详细信息
pm2 describe barber-backend
pm2 describe barber-admin
pm2 describe barber-h5

# 查看实时日志
pm2 logs

# 查看特定进程日志
pm2 logs barber-backend --lines 50

# 重启所有进程
pm2 restart all

# 重启指定进程
pm2 restart barber-backend

# 停止所有进程
pm2 stop all

# 停止指定进程
pm2 stop barber-backend

# 删除所有进程
pm2 delete all

# 清空日志
pm2 flush

# 监控进程
pm2 monit
```

## 服务访问地址

| 服务名称 | 端口 | 访问地址 |
|---------|------|---------|
| 后端API | 3000 | http://localhost:3000 |
| H5商家端 | 3001 | http://localhost:3001 |
| 管理后台 | 3002 | http://localhost:3002 |

## 故障排查

### 查看错误日志
```bash
# 后端错误日志
tail -f packages/backend/logs/backend-error.log

# 管理后台错误日志
tail -f packages/admin-web/logs/admin-error.log

# H5商家端错误日志
tail -f packages/h5-merchant/logs/h5-error.log
```

### 检查端口占用
```bash
lsof -i :3000
lsof -i :3001
lsof -i :3002
```

### 测试服务是否正常
```bash
curl http://localhost:3000
curl http://localhost:3001
curl http://localhost:3002
```

## 环境配置

### 前端环境变量

生产环境配置文件：
- `packages/admin-web/.env.production`
- `packages/h5-merchant/.env.production`

如果修改了环境变量，需要重新构建前端项目：

```bash
cd packages/admin-web
npm run build
pm2 restart barber-admin
```

### 后端环境变量

后端环境变量配置在项目根目录的 `.env` 文件中。

修改后需要重启后端服务：

```bash
pm2 restart barber-backend
```

## 开发模式 vs 生产模式

### 开发模式
```bash
# 后端
cd packages/backend
npm run start:dev

# 管理后台
cd packages/admin-web
npm run dev

# H5商家端
cd packages/h5-merchant
npm run dev
```

### 生产模式
```bash
# 使用 PM2 管理
./deploy.sh all
```

## 注意事项

1. **修改代码后必须重新构建**：
   - 前端：执行 `npm run build`
   - 后端：执行 `npm run build`

2. **构建完成后重启服务**：
   - 使用 `pm2 restart` 命令

3. **检查服务状态**：
   - 部署后查看日志确认服务正常启动

4. **环境变量修改**：
   - 前端修改环境变量需要重新构建
   - 后端修改环境变量只需要重启

5. **端口冲突**：
   - 确保3000、3001、3002端口未被占用
