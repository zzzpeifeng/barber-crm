# PM2 部署快速指南

## 前置要求

1. **Node.js** (推荐 v18+)
   ```bash
   node -v
   ```

2. **PM2** (全局安装)
   ```bash
   npm install -g pm2
   ```

3. **pnpm** (可选，但推荐)
   ```bash
   npm install -g pnpm
   ```

## 一键部署

### 方式一：使用自动化脚本（推荐）

```bash
# 给脚本添加执行权限
chmod +x deploy-pm2.sh

# 运行部署脚本
./deploy-pm2.sh
```

脚本会自动完成以下操作：
- ✅ 检查 Node.js 和 PM2 环境
- ✅ 安装所有依赖（自动检测是否使用 pnpm）
- ✅ 构建后端和前端项目
- ✅ 启动所有服务（后端 + H5 商家端 + 管理后台）
- ✅ 保存 PM2 配置实现开机自启

### 方式二：手动部署

如果脚本执行有问题，可以手动执行以下步骤：

```bash
# 1. 安装依赖
pnpm install  # 或 npm install

# 2. 构建所有项目
pnpm run build  # 或分别构建各个模块

# 3. 使用 PM2 启动
pm2 start ecosystem.config.js

# 4. 保存 PM2 配置
pm2 save

# 5. 设置开机自启（仅首次需要）
pm2 startup
# 根据提示执行生成的命令
```

## 服务端口

| 服务 | 端口 | 说明 |
|------|------|------|
| 后端 API | 3000 | NestJS 后端服务 |
| H5 商家端 | 3001 | 移动端商家页面 |
| 管理后台 | 3002 | Web 管理后台 |

## 常用 PM2 命令

```bash
# 查看应用状态
pm2 status

# 查看所有日志
pm2 logs

# 查看特定应用日志
pm2 logs barber-backend
pm2 logs barber-h5
pm2 logs barber-admin

# 重启所有应用
pm2 restart all

# 重启特定应用
pm2 restart barber-backend

# 停止所有应用
pm2 stop all

# 删除所有应用
pm2 delete all

# 监控资源使用
pm2 monit

# 查看详细信息
pm2 show barber-backend
```

## 查看日志

```bash
# 实时查看所有日志
pm2 logs --lines 100

# 查看后端错误日志
tail -f packages/backend/logs/backend-error.log

# 清空所有日志
pm2 flush
```

## 开机自启

如果是首次部署，需要设置开机自启：

```bash
# 生成开机自启配置
pm2 startup

# 执行生成的命令（类似下面这样）
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u your_user --hp /home/your_user

# 保存当前应用列表
pm2 save
```

## 故障排查

### 1. 端口被占用

如果端口被占用，修改 `ecosystem.config.js` 中的端口号：

```javascript
args: './dist -p 3001 --spa'  // 修改端口号
```

然后重启应用：
```bash
pm2 restart all
```

### 2. 内存不足

调整 `ecosystem.config.js` 中的 `max_memory_restart`:

```javascript
max_memory_restart: '1G'  // 调整为合适的值
```

### 3. 数据库连接失败

确保 MySQL 服务正在运行，并检查数据库配置。

### 4. 构建失败

清理缓存后重新构建：
```bash
cd packages/backend
rm -rf dist
npm run build
```

## 更新部署

当代码更新后，重新部署：

```bash
# 拉取最新代码
git pull

# 运行一键部署脚本
./deploy-pm2.sh
```

或手动更新：
```bash
# 安装新依赖
pnpm install

# 重新构建
pnpm run build

# 重启服务
pm2 restart all
```

## 卸载

如果需要完全卸载：

```bash
# 停止并删除所有 PM2 应用
pm2 delete all
pm2 kill

# 清除 PM2 配置
pm2 unstartup

# 删除项目
rm -rf node_modules packages/*/node_modules
```

## 技术支持

如有问题，请查看：
- PM2 官方文档：https://pm2.keymetrics.io/docs/
- 项目日志：`pm2 logs`
