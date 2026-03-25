---
name: h5-mobile-viewport-fix
overview: 修复 H5 商家端移动端页面可拖动、点击输入框自动放大、页面缩放等问题，通过完善 viewport meta 标签、添加 touch-action CSS、JS 防缩放事件监听来确保移动端交互体验一致性。
todos:
  - id: fix-viewport-meta
    content: 修改 h5-merchant/index.html，完善 viewport meta 标签禁止用户缩放
    status: completed
  - id: add-mobile-css
    content: 修改 index.css 添加 touch-action、overscroll-behavior、输入框 font-size 等全局移动端防护样式
    status: completed
    dependencies:
      - fix-viewport-meta
  - id: add-js-gesture-guard
    content: 修改 main.ts 添加 gesturestart/gesturechange/gestureend 事件拦截作为 JS 兜底
    status: completed
    dependencies:
      - add-mobile-css
---

## 用户需求

解决 H5 商家端（h5-merchant）在移动端浏览器中存在的以下问题：

1. 页面可拖动：用户在不同浏览器中可以整体拖动页面，导致内容偏移
2. 输入框聚焦自动放大：点击输入框（van-field）时，iOS Safari 等浏览器会自动缩放页面
3. 点击空白区域触发缩放：双击或双指操作可能触发页面缩放
4. 自适应不同分辨率：确保页面在不同手机屏幕上表现一致

## 产品概述

理发店会员管理系统的 H5 商家端，主要面向商户操作员在手机浏览器中使用，进行店铺管理、会员管理和积分操作。

## 核心功能

- 禁止页面整体缩放（双指缩放、双击缩放）
- 禁止页面拖动/弹性滚动（overscroll bounce）
- 输入框聚焦时不触发浏览器自动缩放
- 保证移动端交互体验的一致性和稳定性

## 技术栈

- 前端框架：Vue 3 + Vant 4
- 构建工具：Vite 4
- 样式方案：Tailwind CSS 3.3 + CSS
- 无需引入额外依赖

## 实现方案

采用 **CSS 优先 + viewport meta + JS 兜底** 的多层防护策略，覆盖所有主流移动端浏览器（iOS Safari、Chrome Android、微信浏览器等）：

### 第一层：Viewport Meta 标签（HTML）

在 `index.html` 的 viewport meta 中添加 `user-scalable=no, maximum-scale=1.0, minimum-scale=1.0`，从浏览器层面禁止用户手动缩放。这是最基础的防护。

### 第二层：CSS 全局样式防护

- 对 `html, body` 设置 `touch-action: manipulation`，禁止双指缩放和双击缩放手势，同时保留单指滚动和点击功能
- 对 `html` 设置 `overscroll-behavior: none`，禁止 iOS 的弹性回弹效果和 Android 的过度滚动发光效果，解决页面可拖动问题
- 对所有 `input, textarea, select` 设置 `font-size: 16px`（使用 !important），解决 iOS Safari 在 font-size < 16px 时自动缩放页面的行为
- 对 `body` 添加 `overflow-x: hidden`，防止页面水平方向的意外滚动

### 第三层：JS 事件兜底（针对特殊浏览器）

在 `main.ts` 中添加轻量级事件监听器，拦截可能在部分浏览器中仍然触发的缩放手势：

- 监听 `gesturestart` 事件（iOS Safari），`preventDefault` 阻止双指缩放
- 监听 `gesturechange` 和 `gestureend` 事件作为补充

### 关键决策与权衡

- **选择 CSS `touch-action: manipulation` 而非 `touch-action: none`**：后者会完全禁止触摸滚动，影响正常页面浏览体验。`manipulation` 只禁止缩放和双击缩放，保留平移和点击。
- **选择 font-size: 16px 而非 viewport meta 的 maximum-scale**：iOS Safari 在输入框 font-size < 16px 时会无视 viewport 缩放限制。必须同时设置两者。
- **选择在 main.ts 中添加全局事件监听而非在每个组件中处理**：这是全局行为控制，应在应用入口统一管理，避免重复代码。
- **不引入第三方库**：此需求完全可以通过原生 CSS + 少量 JS 实现，无需引入 `amfe-flexible` 或 `postcss-px-to-viewport` 等库，减少依赖复杂度。

## 实现注意事项

- `touch-action` 属性需设置在 `html` 和 `body` 上，确保全局生效
- `overscroll-behavior` 需要带 `-webkit-` 前缀以兼容旧版 WebKit 浏览器
- `font-size: 16px` 对 Vant 的 `van-field` 组件的内部 input 元素生效，不会破坏 Vant 的布局
- JS 事件监听使用 `passive: false` 选项，因为需要 `preventDefault`
- 修改仅限 `packages/h5-merchant`，不影响 `packages/admin-web`

## 目录结构

```
packages/h5-merchant/
├── index.html                              # [MODIFY] 添加 viewport 缩放限制属性
├── src/
│   ├── main.ts                             # [MODIFY] 添加全局防缩放事件监听
│   └── assets/styles/index.css             # [MODIFY] 添加移动端触摸行为控制样式
```