# 理发店会员管理系统

一个完整的理发店会员管理系统，包含 NestJS 后端、Vue3 H5 商家端和 Vue3 Web 管理后台。

## 项目结构

```
├── database.sql                 # 数据库初始化脚本
├── member-backend               # NestJS 后端项目
│   ├── src/
│   │   ├── entities/           # TypeORM 实体
│   │   ├── modules/            # 业务模块
│   │   ├── common/             # 公共工具
│   │   └── config/             # 配置文件
│   └── package.json
├── member-h5                   # Vue3 H5 商家端
│   ├── src/
│   │   ├── views/              # 页面组件
│   │   ├── components/         # 公共组件
│   │   ├── stores/             # Pinia 状态管理
│   │   ├── api/                # API 接口
│   │   └── utils/              # 工具函数
│   └── package.json
└── member-admin-web           # Vue3 Web 管理后台
    ├── src/
    │   ├── views/              # 页面组件
    │   ├── components/         # 公共组件
    │   ├── stores/             # Pinia 状态管理
    │   ├── api/                # API 接口
    │   └── utils/              # 工具函数
    └── package.json
```

## 技术栈

### 后端 (member-backend)
- **框架**: NestJS
- **数据库**: MySQL 8.x
- **ORM**: TypeORM
- **认证**: JWT
- **语言**: TypeScript

### 前端 (member-h5)
- **框架**: Vue 3
- **构建工具**: Vite
- **UI 库**: Vant
- **状态管理**: Pinia
- **路由**: Vue Router
- **HTTP 客户端**: Axios
- **样式**: Tailwind CSS

### 管理后台 (member-admin-web)
- **框架**: Vue 3
- **构建工具**: Vite
- **UI 库**: Element Plus
- **状态管理**: Pinia
- **路由**: Vue Router
- **HTTP 客户端**: Axios
- **样式**: Tailwind CSS

## 快速开始

### 1. 数据库设置

数据库已配置完成，连接信息：
- **主机**: 159.75.8.229
- **端口**: 3306
- **数据库**: barber_crm
- **用户名**: member_sys
- **密码**: member_sys@@

数据库表结构和测试数据已初始化完成，包含：
- 9张核心业务表
- 管理员测试账号：admin / 123456
- 商家测试账号：merchant_owner / 123456
- 商家操作员账号：merchant_staff / 123456
- 测试商家、店铺、门店和会员数据

### 2. 后端启动

```bash
cd member-backend
npm install
npm run start:dev
```

后端服务将在 http://localhost:3000 启动

### 3. H5 商家端启动

```bash
cd member-h5
npm install
npm run dev
```

H5 商家端将在 http://localhost:3001 启动

### 4. Web 管理后台启动

```bash
cd member-admin-web
npm install
npm run dev
```

Web 管理后台将在 http://localhost:3002 启动

## 默认账号

### 管理员账号
- 用户名: `admin`
- 密码: `123456`

### 商家账号
- 用户名: `merchant_owner`
- 密码: `123456`

## 功能特性

### 权限管理
- **Super Admin**: 全局数据管理，可管理所有商家、店铺、门店
- **Merchant Owner**: 商家主账号，可管理自己商家的店铺和门店
- **Merchant Manager/Staff**: 商家操作员，可进行会员管理和积分操作

### 核心功能
1. **商家管理**: 创建、编辑、删除商家（仅 Super Admin）
2. **店铺管理**: 商家可创建多个店铺
3. **门店管理**: 每个店铺可创建多个门店
4. **会员管理**: 会员绑定店铺，同店铺内手机号唯一
5. **积分管理**: 按店铺独立积分，支持充值、消费、重置
6. **积分记录**: 完整的积分变更明细和操作日志

### 业务流程
1. Admin 在 Web 管理后台创建商家、店铺、门店
2. 商家在 H5 商家端登录，查看和管理店铺、门店、会员
3. 商家操作员在 H5 商家端进行会员积分操作
4. 所有操作都有完整的权限控制和日志记录

## 数据库设计

系统包含 9 张核心表：
- `merchant`: 商家表
- `shop`: 店铺表
- `store`: 门店表
- `member`: 会员表
- `member_points_summary`: 会员积分总览表
- `member_points_transaction`: 会员积分变更明细表
- `member_store_log`: 会员门店关联日志表
- `merchant_user`: 商家用户表
- `admin_user`: 管理员表

详细的表结构和关系请参考 `database.sql` 文件。

## API 文档

启动后端服务后，可以访问 http://localhost:3000/api-docs 查看自动生成的 API 文档。

## 开发说明

### 后端开发
- 使用 TypeORM 进行数据库操作
- 使用 JWT 进行身份认证
- 统一的响应格式：`{ code: number, message: string, data: any }`
- 完整的权限控制和参数验证

### 前端开发
- 使用 Composition API 编写 Vue3 组件
- 使用 Pinia 进行状态管理
- 统一的请求拦截和错误处理
- 响应式设计，适配移动端和 PC 端

## 项目特色

1. **完整的业务闭环**: 从商家创建到会员积分管理的完整业务流程
2. **权限分离**: 不同角色有不同的操作权限
3. **双端支持**: H5 商家端和 Web 管理后台
4. **现代化技术栈**: 使用最新的技术框架和最佳实践
5. **良好的用户体验**: 简洁的界面设计和流畅的交互体验
6. **可扩展性**: 模块化设计，易于扩展新功能

## 注意事项

1. 请确保 MySQL 数据库版本为 8.x
2. 修改 `.env` 文件中的数据库连接配置
3. 生产环境请修改 JWT 密钥和其他安全配置
4. 项目使用 TypeScript，建议使用支持 TS 的开发工具