# OpenBioCard

✨ 免费开源的去中心化电子名片软件 ✨

[English Documentation](./README.md)

## 快速部署

[![部署到 Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/OpenBioCard/OpenBioCard)

点击上方按钮一键部署 OpenBioCard 到 Cloudflare Workers。你需要一个 Cloudflare 账户（免费版即可）。

**📚 [详细部署指南](./DEPLOY.zh-CN.md)** | **📚 [English Deployment Guide](./DEPLOY.md)**

## 目录

- [项目简介](#项目简介)
- [功能特性](#功能特性)
- [前置要求](#前置要求)
- [安装](#安装)
- [配置](#配置)
- [开发](#开发)
- [构建](#构建)
- [部署](#部署)
- [项目结构](#项目结构)
- [技术栈](#技术栈)
- [许可证](#许可证)

## 项目简介

OpenBioCard 是一个基于 Cloudflare Workers 构建的去中心化电子名片平台。它允许用户创建和分享包含自定义链接和个人信息的专业档案。

**📖 [API 文档](./docs/API.md)** | **📖 [API Documentation (EN)](./docs/API_EN.md)**

## 功能特性

- 🌐 基于 Cloudflare Workers 的无服务器架构
- 💾 使用 Durable Objects 实现数据持久化
- 🎨 采用 Vue 3 和 Tailwind CSS 构建的现代化界面
- 🔒 安全的身份认证系统
- 🌍 国际化支持 (i18n)
- 📱 全设备响应式设计
- ⚡ 快速的全球边缘网络分发

## 前置要求

开始之前，请确保已安装以下工具：

- **Node.js**: v20.x 或更高版本
- **pnpm**: v10.x 或更高版本（包管理器）
- **Cloudflare 账户**: 免费版即可
- **Wrangler CLI**: 会随依赖自动安装

## 安装

1. **克隆仓库**

   ```bash
   git clone https://github.com/yourusername/OpenBioCard.git
   cd OpenBioCard
   ```

2. **安装依赖**

   ```bash
   pnpm install
   ```

## 配置

### 1. 环境变量

在项目根目录中创建环境变量文件：

#### `.env` (用于构建时配置)

```env
# 在此添加构建时的环境变量
```

#### `.dev.vars` (用于本地开发密钥)

```env
# Cloudflare Workers 本地开发变量
# 此文件已被 git 忽略
# 在此添加本地密钥
```

**⚠️ 重要提示**: 切勿将 `.env`、`.dev.vars` 或 `.env.production` 文件提交到 git。它们已经被包含在 `.gitignore` 中。

### 2. Wrangler 配置

Wrangler 配置文件位于 `wrangler.jsonc`：

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "openbiocard",
  "compatibility_date": "2025-08-03",
  "main": "./src/server/index.tsx",
  "durable_objects": {
    "bindings": [
      {
        "name": "USER_DO",
        "class_name": "UserDO"
      },
      {
        "name": "ADMIN_DO",
        "class_name": "AdminDO"
      }
    ]
  }
}
```

### 3. Cloudflare 账户设置

1. **登录 Wrangler**

   ```bash
   pnpm wrangler login
   ```

2. **配置账户 ID**（如需要）

   在 `wrangler.jsonc` 中更新你的账户 ID：

   ```jsonc
   {
     "account_id": "你的账户ID"
   }
   ```

## 开发

### 启动开发服务器

```bash
pnpm run dev
```

这将启动：
- Vite 开发服务器（支持热模块替换）
- Cloudflare Workers 本地运行时
- Durable Objects 本地存储

应用将在 `http://localhost:8787`（或终端显示的端口）上运行。

### 本地 Durable Objects 数据

本地 Durable Objects 数据存储在：
```
.wrangler/state/v3/do/
├── openbiocard-AdminDO/
└── openbiocard-UserDO/
```

**此目录已自动被 git 忽略**，以防止本地测试数据被提交。

### 生成 TypeScript 类型

根据 Worker 配置生成 TypeScript 类型：

```bash
pnpm run cf-typegen
```

## 构建

### 生产环境构建

```bash
pnpm run build
```

这将执行：
1. 构建 Vue 3 客户端应用
2. 构建 SSR（服务端渲染）包
3. 构建 Cloudflare Worker 包
4. 输出到 `dist/`

构建输出：
```
dist/
├── client/          # 客户端资源
│   ├── assets/      # JS 和 CSS 包
│   └── .vite/       # Vite 清单文件
├── openbiocard/     # Worker 包
│   ├── index.js     # Worker 主脚本
│   ├── wrangler.json
│   └── .vite/
└── index.js         # SSR 入口
```

## 部署

### 部署到 Cloudflare Workers

1. **确保已登录**

   ```bash
   pnpm wrangler login
   ```

2. **构建并部署**

   ```bash
   pnpm run deploy
   ```

3. **首次部署 Durable Objects 设置**

   首次部署时，Cloudflare 将自动：
   - 创建 Durable Objects 命名空间
   - 运行 `wrangler.jsonc` 中定义的迁移
   - 将 Durable Objects 绑定到你的 Worker

### 部署后

部署后，你的应用将在以下地址可用：
```
https://openbiocard.<你的子域名>.workers.dev
```

或者如果在 Cloudflare 控制台配置了自定义域名，则在你的自定义域名上。

### 生产环境变量

设置生产环境变量：

```bash
# 设置密钥
pnpm wrangler secret put 密钥名称

# 或使用 Cloudflare 控制台：
# Workers & Pages > 你的 Worker > Settings > Variables
```

### 生产环境 Durable Objects

- 生产环境的 Durable Objects 数据存储在 Cloudflare 全球网络中
- 数据在部署间持久保存
- 每个 Durable Object 实例自动全球分布
- 在控制台查看 Durable Objects：Workers & Pages > 你的 Worker > Durable Objects

## 项目结构

```
OpenBioCard/
├── src/
│   ├── frontend/             # Vue 3 前端应用
│   │   ├── components/       # Vue 组件
│   │   ├── pages/            # 页面组件
│   │   ├── i18n/             # 国际化
│   │   ├── App.vue           # 根组件
│   │   ├── main.js           # 客户端入口
│   │   ├── index.html        # HTML 模板
│   │   └── style.css         # 全局样式
│   └── server/               # Cloudflare Worker 后端
│       ├── durable-objects/  # Durable Objects 类
│       │   ├── admin.ts      # AdminDO
│       │   └── user.ts       # UserDO
│       ├── router/           # API 路由
│       ├── middleware/       # Hono 中间件
│       ├── types/            # TypeScript 类型
│       ├── utils/            # 工具函数
│       ├── index.tsx         # Worker 入口
│       └── renderer.tsx      # SSR 渲染器
├── public/                   # 静态资源
├── dist/                     # 构建输出（已忽略）
├── .wrangler/                # 本地开发数据（已忽略）
├── node_modules/             # 依赖（已忽略）
├── vite.config.ts            # Vite 配置
├── wrangler.jsonc            # Wrangler 配置
├── tsconfig.json             # TypeScript 配置
├── tailwind.config.js        # Tailwind CSS 配置
├── postcss.config.js         # PostCSS 配置
├── package.json              # 项目依赖
├── .gitignore                # Git 忽略规则
└── README.md                 # 说明文件
```

## 技术栈

### 前端
- **Vue 3**: 渐进式 JavaScript 框架
- **Vue Router**: Vue.js 官方路由
- **Tailwind CSS 4**: 实用优先的 CSS 框架
- **Vue I18n**: 国际化插件

### 后端
- **Cloudflare Workers**: 无服务器执行环境
- **Hono**: 快速、轻量的 Web 框架
- **Durable Objects**: 强一致性的有状态对象
- **TypeScript**: 类型安全的 JavaScript

### 构建工具
- **Vite 6**: 下一代前端构建工具
- **Wrangler**: Cloudflare Workers CLI
- **PNPM**: 快速、节省磁盘空间的包管理器

### 开发工具
- **vite-ssr-components**: Vite 的 SSR 支持
- **@cloudflare/vite-plugin**: Cloudflare Workers 集成

### 文档
- **[API 文档](./docs/API.md)** - 中文 API 参考文档
- **[API Documentation (EN)](./docs/API_EN.md)** - English API reference documentation

## 贡献

欢迎贡献！请随时提交 Pull Request。

## 许可证

MIT

## 支持

如果遇到任何问题或有疑问，请在 GitHub 上提 issue。

---

用 ❤️ 制作，来自 OpenBioCard 团队
