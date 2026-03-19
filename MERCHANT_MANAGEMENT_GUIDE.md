# 商家管理功能使用说明

## 功能概述

本系统已新增商家管理功能模块，包含两个独立的管理页面：

### 1. 商家管理 (`/admin/merchants`)
- **数据表**: `merchant`
- **功能**: 对商家主体进行管理
- **操作**:
  - 查看商家列表
  - 新增商家（需填写名称、电话、登录账号、密码、备注）
  - 编辑商家信息
  - 删除商家（级联删除相关数据）

### 2. 商家用户管理 (`/admin/merchant-users`)
- **数据表**: `merchant_user`
- **功能**: 对商家下的用户进行管理
- **操作**:
  - 查看商家用户列表
  - 新增用户（需选择所属商家、填写用户名、真实姓名、角色、密码）
  - 编辑用户信息
  - 删除用户
  - 启用/禁用用户

## 后端 API 接口

### 商家管理 API

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| POST | `/merchants` | 创建商家 | super_admin |
| GET | `/merchants` | 获取商家列表 | super_admin |
| GET | `/merchants/:id` | 获取商家详情 | super_admin |
| PATCH | `/merchants/:id` | 更新商家 | super_admin |
| DELETE | `/merchants/:id` | 删除商家 | super_admin |

### 商家用户管理 API

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| POST | `/merchant-users` | 创建用户 | super_admin |
| GET | `/merchant-users` | 获取用户列表 | super_admin |
| GET | `/merchant-users/:id` | 获取用户详情 | super_admin |
| PATCH | `/merchant-users/:id` | 更新用户 | super_admin |
| DELETE | `/merchant-users/:id` | 删除用户 | super_admin |

## 数据库表结构

### merchant 表
```sql
CREATE TABLE merchant (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL COMMENT '商家名称',
    phone VARCHAR(20) COMMENT '商家电话',
    remark TEXT COMMENT '备注',
    login_account VARCHAR(50) NOT NULL UNIQUE COMMENT '登录账号',
    password_hash VARCHAR(255) NOT NULL COMMENT '加密密码',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商家表';
```

### merchant_user 表
```sql
CREATE TABLE merchant_user (
    id INT PRIMARY KEY AUTO_INCREMENT,
    merchant_id INT NOT NULL COMMENT '所属商家ID',
    username VARCHAR(50) NOT NULL UNIQUE COMMENT '登录账号',
    password_hash VARCHAR(255) NOT NULL COMMENT '加密密码',
    role ENUM('owner','manager','staff') NOT NULL COMMENT '角色',
    real_name VARCHAR(50) COMMENT '真实姓名',
    status TINYINT NOT NULL DEFAULT 1 COMMENT '状态：1=启用，0=禁用',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (merchant_id) REFERENCES merchant(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商家用户表';
```

## 前端使用说明

### 1. 访问路径
- 商家管理: `http://localhost:3002/admin/merchants`
- 商家用户管理: `http://localhost:3002/admin/merchant-users`

### 2. 功能特性
- **搜索功能**: 支持按商家名称或用户名搜索
- **表单验证**: 所有必填字段都有验证
- **密码加密**: 密码使用 bcrypt 加密存储
- **级联删除**: 删除商家时会自动删除相关店铺、门店和用户
- **状态管理**: 用户可以启用/禁用

### 3. 菜单导航
管理后台侧边栏菜单：
- 仪表盘
- 商家管理
- 商家用户管理
- 店铺管理
- 门店管理

## 部署说明

### 首次部署
```bash
# 1. 构建后端
cd packages/backend
npm run build

# 2. 构建前端（指定服务器 IP）
cd ../admin-web
VITE_API_URL=http://<服务器IP>:3000 npm run build

# 3. 启动 PM2 服务
cd ../../
./deploy.sh all <服务器IP>
```

### 更新部署
```bash
# 1. 拉取最新代码
git pull

# 2. 重新部署
./deploy.sh all <服务器IP>
```

## 注意事项

1. **权限要求**: 所有商家管理接口需要 `super_admin` 角色
2. **密码安全**: 密码在传输和存储时都会加密
3. **数据完整性**: 删除商家会级联删除所有相关数据，请谨慎操作
4. **登录账号**: 商家用户的 `login_account` 用于 H5 商家端登录
5. **角色说明**:
   - `owner`: 店主，拥有所有权限
   - `manager`: 经理，管理店铺和门店
   - `staff`: 员工，日常操作权限

## 文件清单

### 后端文件
- `packages/backend/src/entities/merchant.entity.ts` - 商家实体
- `packages/backend/src/entities/merchant-user.entity.ts` - 商家用户实体
- `packages/backend/src/modules/merchant/` - 商家模块（Controller、Service、Module）
- `packages/backend/src/modules/merchant-user/` - 商家用户模块（Controller、Service、Module）

### 前端文件
- `packages/admin-web/src/views/MerchantManagement.vue` - 商家管理页面
- `packages/admin-web/src/views/MerchantUserList.vue` - 商家用户管理页面
- `packages/admin-web/src/api/merchant.ts` - 商家 API 接口
- `packages/admin-web/src/api/merchant-user.ts` - 商家用户 API 接口
- `packages/admin-web/src/types/index.ts` - TypeScript 类型定义
- `packages/admin-web/src/router/index.ts` - 路由配置
- `packages/admin-web/src/components/Layout.vue` - 布局组件（包含菜单）

## 开发说明

### 添加新功能步骤
1. 创建后端实体和模块
2. 实现 CRUD 接口
3. 创建前端 API 文件
4. 创建前端页面组件
5. 配置路由和菜单
6. 测试功能完整性

### 代码规范
- 后端使用 NestJS + TypeORM
- 前端使用 Vue 3 + TypeScript + Element Plus
- 所有接口使用统一的响应格式
- 密码必须使用 bcrypt 加密
