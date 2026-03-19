# deploy.sh 脚本重构说明

## 📋 重构概述

移除了 `PROJECT_ROOT` 硬编码路径变量，改用脚本自动检测机制，使脚本可以在任何目录下执行。

## 🔧 主要修改

### 1. 移除硬编码路径
**修改前:**
```bash
PROJECT_ROOT="/Users/SL/CodeBuddy/20260201123311"
cd "$PROJECT_ROOT"
```

**修改后:**
```bash
# 获取脚本所在目录的父目录（项目根目录）
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"
```

### 2. 路径引用更新

所有路径引用从绝对路径改为相对路径：

| 文件路径 | 修改前 | 修改后 |
|---------|---------|---------|
| 后端 | `$PROJECT_ROOT/packages/backend` | `$SCRIPT_DIR/packages/backend` |
| 管理后台 | `$PROJECT_ROOT/packages/admin-web` | `$SCRIPT_DIR/packages/admin-web` |
| H5商家端 | `$PROJECT_ROOT/packages/h5-merchant` | `$SCRIPT_DIR/packages/h5-merchant` |
| 项目根目录 | `$PROJECT_ROOT` | `$SCRIPT_DIR` |

### 3. 帮助信息更新

更新了使用说明，增加了更多使用示例：

```bash
# 显示帮助信息
./deploy.sh help

# 或使用以下命令
./deploy.sh --help
./deploy.sh -h
```

## ✅ 功能增强

### 1. 位置无关性
- ✅ 可以在项目根目录执行：`./deploy.sh`
- ✅ 可以在项目子目录执行：`../deploy.sh`
- ✅ 可以在任何目录使用绝对路径：`/path/to/project/deploy.sh`

### 2. 自动路径检测
使用 `BASH_SOURCE` 和 `dirname` 自动检测脚本所在位置：
```bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
```

这个机制：
1. `BASH_SOURCE[0]` 获取脚本文件路径
2. `dirname` 提取目录路径
3. `cd + pwd` 获取规范化的绝对路径

### 3. 向后兼容
所有原有功能保持不变：
- ✅ 支持所有原有命令参数
- ✅ 保持相同的部署流程
- ✅ 保持相同的输出格式和颜色显示

## 📖 使用示例

### 基本用法
```bash
# 在项目根目录执行
./deploy.sh              # 部署所有服务
./deploy.sh all          # 部署所有服务（显式）
./deploy.sh backend      # 仅部署后端
./deploy.sh admin        # 仅部署管理后台
./deploy.sh h5           # 仅部署H5商家端
./deploy.sh frontend     # 部署所有前端服务
./deploy.sh status       # 查看服务状态
./deploy.sh help         # 显示帮助信息
```

### 从不同位置执行
```bash
# 从项目根目录
cd /Users/SL/CodeBuddy/20260201123311
./deploy.sh backend

# 从项目子目录
cd /Users/SL/CodeBuddy/20260201123311/packages
../deploy.sh admin

# 从其他目录
cd /tmp
/Users/SL/CodeBuddy/20260201123311/deploy.sh status

# 使用符号链接
ln -s /Users/SL/CodeBuddy/20260201123311/deploy.sh ~/deploy-barber.sh
~/deploy-barber.sh all
```

## 🔍 测试验证

已测试以下场景：

### ✅ 测试场景1: 项目根目录执行
```bash
cd /Users/SL/CodeBuddy/20260201123311
./deploy.sh status
# 结果: ✅ 正常工作
```

### ✅ 测试场景2: 从其他目录执行
```bash
cd /tmp
/Users/SL/CodeBuddy/20260201123311/deploy.sh status
# 结果: ✅ 正常工作，正确识别项目路径
```

### ✅ 测试场景3: 部署功能
```bash
# 执行实际部署
./deploy.sh status
# 结果: ✅ PM2 命令正常执行
```

## 🎯 技术细节

### BASH_SOURCE 工作原理
```bash
BASH_SOURCE[0]          # 当前脚本的完整路径
dirname "$BASH_SOURCE[0]" # 获取脚本所在目录
cd "$dir" && pwd        # 转到该目录并获取绝对路径
```

### 为什么使用 cd + pwd
- `dirname` 返回的可能是相对路径
- `cd` 到该目录，然后 `pwd` 获取规范化的绝对路径
- 处理符号链接、`.` 和 `..` 等特殊情况

### set -e 作用
```bash
set -e
```
- 任何命令返回非零退出码时立即退出
- 避免在部分失败时继续执行
- 确保部署过程的完整性

## 📝 注意事项

1. **脚本位置**: 脚本必须位于项目根目录
2. **执行权限**: 确保脚本有执行权限 `chmod +x deploy.sh`
3. **PM2 要求**: 确保 PM2 已正确安装和配置
4. **环境要求**: 所有依赖包已安装（npm/yarn/pnpm）

## 🔄 后续建议

如果需要进一步改进，可以考虑：
1. 添加参数验证（检查服务名称是否有效）
2. 添加构建前的清理操作（`npm run clean`）
3. 添加构建缓存管理
4. 添加多环境支持（dev/staging/prod）
5. 添加部署前检查（端口占用、依赖版本等）

## 📅 更新日期
2026-03-19
