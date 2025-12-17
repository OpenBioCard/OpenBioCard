# OpenBioCard

✨ 免费开源的去中心化电子名片软件 ✨

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/OpenBioCard/OpenBioCard)

[📚 详细部署指南](./docs/DEPLOY.zh-CN.md) | [📚 Detailed Deployment Guide](./docs/DEPLOY.md) | [English Documentation](./README.md)

## 📋 目录

- [项目简介](#-项目简介)
- [功能特性](#-功能特性)
- [快速开始](#-快速开始)
- [环境配置](#-环境配置)
- [本地开发](#-本地开发)
- [构建与部署](#-构建与部署)
- [项目结构](#-项目结构)
- [技术栈](#-技术栈)
- [贡献指南](#-贡献指南)
- [许可证](#-许可证)

## 🌟 项目简介

OpenBioCard 是一个基于 Cloudflare Workers 构建的去中心化电子名片平台。它允许用户创建和分享包含自定义链接和个人信息的专业档案。

**📖 [API 文档](./docs/API.md)** | **📖 [API Documentation (EN)](./docs/API_EN.md)**

## ✨ 功能特性

- 🌐 **Serverless 架构** - 由 Cloudflare Workers 驱动
- 💾 **数据持久化** - 使用 Durable Objects
- 🎨 **现代化 UI** - Vue 3 + Tailwind CSS 4
- 🔒 **安全认证** - 完整的用户认证系统
- 🌍 **国际化** - 支持多语言界面
- 📱 **响应式设计** - 适配所有设备
- ⚡ **全球边缘网络** - 全球范围内快速内容分发
- 📦 **Monorepo 结构** - 使用 PNPM 高效管理

## 🚀 快速开始

### 前置要求

- **Node.js**: v20.x 或更高版本
- **pnpm**: v9.x 或更高版本
- **Cloudflare 账户**: 免费版即可

### 安装步骤

1. **克隆仓库**
   ```bash
   git clone https://github.com/OpenBioCard/OpenBioCard.git
   cd OpenBioCard
   ```

2. **安装依赖**
   ```bash
   pnpm install
   ```

3. **配置环境变量**
   请参阅 [环境配置](#-环境配置) 章节。

4. **启动开发服务器**
   ```bash
   pnpm dev
   ```
   应用将在 `http://localhost:8787` 运行。

## ⚙️ 环境配置

### 本地开发环境变量

在**项目根目录**创建一个 `.dev.vars` 文件：

```env
# 必须的密钥
ROOT_USERNAME=root
ROOT_PASSWORD=your_secure_password_here

# 可选环境变量
CORS_ALLOWED_ORIGINS=*
CORS_ALLOWED_METHODS=GET,POST,PUT,DELETE,OPTIONS
CORS_ALLOWED_HEADERS=Content-Type,Authorization
```

### 生产环境配置

#### 1. Wrangler 配置

`wrangler.jsonc` 位于项目根目录。它处理 Cloudflare Workers 的配置，包括 Durable Objects 绑定和迁移。

#### 2. 设置生产环境密钥

使用 Wrangler CLI 设置敏感信息：

```bash
# 设置 root 用户名
pnpm wrangler secret put ROOT_USERNAME

# 设置 root 密码
pnpm wrangler secret put ROOT_PASSWORD
```

#### 3. Cloudflare 账户配置

```bash
# 登录 Wrangler
pnpm wrangler login
```

## 💻 本地开发

### 开发服务器

```bash
pnpm dev
```

该命令将启动前端 Vite 开发服务器，并通过 `@cloudflare/vite-plugin` 与 Cloudflare Workers 环境集成。它提供了无缝的全栈开发体验。

### 本地数据存储

本地 Durable Objects 数据存储在：
```
apps/backend/.wrangler/state/v3/do/
├── openbiocard-AdminDO/
└── openbiocard-UserDO/
```

### 类型生成

根据 Worker 配置生成 TypeScript 类型：

```bash
pnpm --filter openbiocard-backend cf-typegen
```

## 🏗️ 构建与部署

### 生产环境构建

```bash
pnpm build
```

这将构建前端和后端应用。构建产物位于：
- 前端：`apps/frontend/dist/`
- 后端：`apps/backend/dist/` (包含前端资源)

### 部署到 Cloudflare Workers

1. **确保已登录**
   ```bash
   pnpm wrangler login
   ```

2. **部署**
   ```bash
   pnpm deploy
   ```
   此命令将后端 Worker（负责服务前端资源）部署到 Cloudflare。

3. **首次 Durable Objects 设置**

   Cloudflare 将自动：
   - 创建 Durable Objects 命名空间
   - 运行 `wrangler.jsonc` 中定义的迁移
   - 将 Durable Objects 绑定到你的 Worker

### 部署后配置

部署后，你的应用将在以下地址可用：
```
https://openbiocard.<your-subdomain>.workers.dev
```

### 初始化管理员用户

部署后，访问以下端点以初始化管理员用户：
```
https://your-domain.workers.dev/init-admin
```

## 📁 项目结构

```
OpenBioCard/
├── apps/
│   ├── backend/               # Cloudflare Worker 后端
│   │   ├── durable-objects/   # Durable Objects 类
│   │   ├── router/            # Hono API 路由
│   │   ├── middleware/        # 中间件
│   │   ├── types/             # 后端类型
│   │   ├── utils/             # 工具函数
│   │   └── index.tsx          # Worker 入口点
│   └── frontend/              # Vue 3 前端
│       ├── src/               # 源代码 (如果适用)
│       ├── components/        # Vue 组件
│       ├── pages/             # 页面 (基于文件的路由)
│       ├── composables/       # 组合式 API hooks
│       ├── api/               # API 客户端
│       └── i18n/              # 国际化
├── docs/                      # 文档
├── wrangler.jsonc             # Wrangler 配置
├── package.json               # 根 package.json (Workspaces)
├── pnpm-workspace.yaml        # PNPM workspace 配置
└── .dev.vars                  # 本地密钥 (不提交)
```

## 🛠️ 技术栈

### 前端
- **Vue 3** - 渐进式 JavaScript 框架
- **Vue Router** - 官方路由管理器
- **Tailwind CSS 4** - 实用优先的 CSS 框架
- **Vue I18n** - 国际化插件
- **Vite 6** - 下一代前端工具链

### 后端
- **Cloudflare Workers** - Serverless 执行环境
- **Hono** - 轻量级 Web 框架
- **Durable Objects** - 强一致性有状态对象
- **TypeScript** - 类型安全的 JavaScript

### 构建工具
- **PNPM** - 快速、节省磁盘空间的包管理器
- **Wrangler** - Cloudflare Workers CLI

## 🤝 贡献指南

欢迎贡献！请随时提交 Pull Request。

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 详情请查看 [LICENSE](LICENSE) 文件。

## 🆘 支持

如果遇到任何问题或有疑问，请在 GitHub 上提交 issue。

---

由 OpenBioCard 团队用 ❤️ 制作
