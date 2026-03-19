# 商家用户管理更新文档

## 📋 更新概述

已将 admin-web 的商家管理页面从使用 `merchant` 表更新为使用 `merchant_user` 表，以符合业务需求。

## 🔧 修改内容

### 1. 后端修改

#### 新增模块
- `MerchantUserController` - 商家用户控制器
  - 路径: `packages/backend/src/modules/merchant-user/merchant-user.controller.ts`
  - 提供完整的 CRUD 操作接口

- `MerchantUserService` - 商家用户服务
  - 路径: `packages/backend/src/modules/merchant-user/merchant-user.service.ts`
  - 处理业务逻辑，包括密码加密

- `MerchantUserModule` - 商家用户模块
  - 路径: `packages/backend/src/modules/merchant-user/merchant-user.module.ts`
  - 模块定义和依赖注入

#### API 端点
```
POST   /merchant-users     - 创建商家用户
GET    /merchant-users     - 获取商家用户列表
GET    /merchant-users/:id - 获取商家用户详情
PATCH  /merchant-users/:id - 更新商家用户
DELETE /merchant-users/:id - 删除商家用户
```

### 2. 前端修改

#### 新增文件
- `packages/admin-web/src/api/merchant-user.ts` - 商家用户 API 调用

#### 修改文件
- `packages/admin-web/src/types/index.ts`
  - 新增 `MerchantUser` 类型定义

- `packages/admin-web/src/views/MerchantList.vue`
  - 页面标题: 商家用户管理
  - 数据源: 从 `merchant` 表改为 `merchant_user` 表
  - 字段变更:
    - 新增: 所属商家、角色、状态
    - 字段映射: username、realName、role、status
  - 表单变更:
    - 新增商家选择下拉框
    - 新增角色选择 (店主/经理/员工)
    - 新增状态开关
    - 支持编辑时不修改密码

### 3. 页面功能

#### 列表展示
- ID
- 所属商家 (关联 merchant 表)
- 用户名
- 真实姓名
- 角色 (owner/manager/staff 显示为中文)
- 状态 (1=正常, 0=禁用)
- 创建时间
- 操作 (编辑/删除)

#### 表单功能
- **新增**:
  - 所属商家 (必填)
  - 用户名 (必填)
  - 真实姓名
  - 角色 (必填)
  - 密码 (必填)
  - 状态 (默认启用)

- **编辑**:
  - 所有字段可编辑
  - 密码可选 (不填则不修改)
  - 用户名不可修改

## 📊 数据结构对比

### 原 merchant 表 (已废弃)
```typescript
{
  id: number
  name: string              // 商家名称
  phone?: string           // 联系电话
  remark?: string         // 备注
  loginAccount: string    // 登录账号
  passwordHash: string    // 密码哈希
  createdAt: string
  updatedAt: string
}
```

### 新 merchant_user 表 (当前使用)
```typescript
{
  id: number
  merchantId: number     // 关联商家ID
  username: string        // 用户名
  realName?: string       // 真实姓名
  role: 'owner' | 'manager' | 'staff'  // 角色
  status: number         // 状态 (1=正常, 0=禁用)
  createdAt: string
  updatedAt: string
  merchant?: Merchant    // 关联的商家对象
}
```

## 🚀 部署步骤

```bash
# 1. 构建后端
cd packages/backend
npm run build

# 2. 重启后端服务
cd ../..
pm2 restart barber-backend

# 3. 构建前端
cd packages/admin-web
npm run build

# 4. 重启前端服务
cd ../..
pm2 restart barber-admin
```

或使用自动化脚本：
```bash
./deploy.sh backend
./deploy.sh admin
```

## ✅ 验证

### 服务状态
```bash
pm2 list
```

所有服务应显示为 `online` 状态。

### 测试API
```bash
# 获取商家用户列表
curl -H "Authorization: Bearer <token>" http://localhost:3000/merchant-users

# 创建商家用户
curl -X POST \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "merchantId": 1,
    "username": "testuser",
    "realName": "测试用户",
    "passwordHash": "password123",
    "role": "manager",
    "status": 1
  }' \
  http://localhost:3000/merchant-users
```

### 前端访问
访问 http://localhost:3002/admin/merchants 查看商家用户管理页面。

## 📝 注意事项

1. **权限控制**: 所有接口需要 `super_admin` 角色
2. **密码处理**: 创建时必须提供密码，编辑时密码可选
3. **用户名唯一性**: username 字段在数据库中设置了唯一约束
4. **关联查询**: 列表查询会关联 merchant 表获取商家名称
5. **状态管理**: 禁用的用户无法登录系统

## 🔄 后续建议

1. 如果需要，可以创建专门的商家信息管理页面 (管理 merchant 表)
2. 可以考虑添加批量操作功能 (批量启用/禁用)
3. 可以添加用户权限的详细管理 (每个角色的具体权限)
4. 可以添加操作日志记录 (谁在什么时候做了什么操作)

## 📅 更新时间
2026-03-19
