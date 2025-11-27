# OpenBioCard

✨ 免费开源的去中心化电子名片软件 ✨

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/OpenBioCard/OpenBioCard)

[📚 详细部署指南](./DEPLOY.md) | [📚 中文部署指南](./DEPLOY.zh-CN.md)

## 📋 目录

- [概述](#-概述)
- [特性](#-特性)
- [快速开始](#-快速开始)
- [环境配置](#-环境配置)
- [本地开发](#-本地开发)
- [构建部署](#-构建部署)
- [项目结构](#-项目结构)
- [技术栈](#-技术栈)
- [贡献](#-贡献)
- [许可证](#-许可证)

## 🌟 概述

OpenBioCard 是一个基于 Cloudflare Workers 构建的去中心化电子名片平台。用户可以创建和分享个性化的专业资料，包含可自定义的链接和信息。

**📖 [API 文档](./docs/API.md)** | **📖 [API Documentation (EN)](./docs/API_EN.md)**

## ✨ 特性

- 🌐 **无服务器架构** - 基于 Cloudflare Workers
- 💾 **数据持久化** - 使用 Durable Objects
- 🎨 **现代化 UI** - Vue 3 + Tailwind CSS
- 🔒 **安全认证** - 完整的用户认证系统
- 🌍 **国际化支持** - 多语言界面
- 📱 **响应式设计** - 适配所有设备
- ⚡ **全球边缘网络** - 快速的内容分发

## 🚀 快速开始

### 环境要求

- **Node.js**: v20.x 或更高版本
- **pnpm**: v10.x 或更高版本
- **Cloudflare 账户**: 免费套餐即可

### 安装步骤

1. **克隆项目**
   ```bash
   git clone https://github.com/OpenBioCard/OpenBioCard.git
   cd OpenBioCard
   ```

2. **安装依赖**
   ```bash
   pnpm install
   ```

3. **配置环境变量**
   ```bash
   cp .env.example .env  # 如果存在示例文件
   ```

4. **启动开发服务器**
   ```bash
   pnpm run dev
   ```

应用将在 `http://localhost:8787` 上运行。

## ⚙️ 环境配置

### 本地开发环境变量

创建 `.dev.vars` 文件（已包含在 `.gitignore` 中）：

```env
# 必需的密钥
ROOT_USERNAME=root
ROOT_PASSWORD=your_secure_password_here

# 可选的环境变量
CORS_ALLOWED_ORIGINS=*
CORS_ALLOWED_METHODS=GET,POST,PUT,DELETE,OPTIONS
CORS_ALLOWED_HEADERS=Content-Type,Authorization
```

### 生产环境配置

#### 1. Wrangler 配置

`wrangler.jsonc` 配置文件：

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "openbiocard",
  "compatibility_date": "2025-08-03",
  "main": "./index.tsx",
  "vars": {
    "CORS_ALLOWED_ORIGINS": "*",
    "CORS_ALLOWED_METHODS": "GET,POST,PUT,DELETE,OPTIONS",
    "CORS_ALLOWED_HEADERS": "Content-Type,Authorization"
  },
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
  },
  "migrations": [
    {
      "tag": "v1",
      "new_sqlite_classes": ["UserDO"]
    },
    {
      "tag": "v2",
      "new_sqlite_classes": ["AdminDO"]
    }
  ]
}
```

#### 2. 设置生产密钥

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

# 可选：配置账户 ID
pnpm wrangler config
```

## 💻 本地开发

### 开发服务器

```bash
pnpm run dev
```

此命令将启动：
- Vite 开发服务器（支持热重载）
- Cloudflare Workers 本地运行时
- Durable Objects 本地存储

### 本地数据存储

本地 Durable Objects 数据存储在：
```
.wrangler/state/v3/do/
├── openbiocard-AdminDO/
└── openbiocard-UserDO/
```

此目录已被 `.gitignore` 忽略。

### 类型生成

生成基于 Worker 配置的 TypeScript 类型：

```bash
pnpm run cf-typegen
```

## 🏗️ 构建部署

### 生产构建

```bash
pnpm run build
```

构建产物位于 `dist/` 目录：
```
dist/
├── client/          # 客户端资源
│   ├── assets/      # JS 和 CSS 包
│   └── .vite/       # Vite 清单
├── openbiocard/     # Worker 包
│   ├── index.js     # 主 Worker 脚本
│   └── wrangler.json
└── index.js         # SSR 入口
```

### 部署到 Cloudflare Workers

1. **确保已登录**
   ```bash
   pnpm wrangler login
   ```

2. **构建并部署**
   ```bash
   pnpm run deploy
   ```

3. **首次部署设置**

   Cloudflare 将自动：
   - 创建 Durable Objects 命名空间
   - 运行 `wrangler.jsonc` 中定义的迁移
   - 绑定 Durable Objects 到 Worker

### 部署后配置

应用部署后可在以下地址访问：
```
https://openbiocard.<your-subdomain>.workers.dev
```

或配置自定义域名后的地址。

### 初始化管理员用户

部署后，访问以下端点初始化管理员用户：
```
https://your-domain.workers.dev/init-admin
```

## 📁 项目结构

```
OpenBioCard/
├── index.tsx                    # Worker 主入口
├── renderer.tsx                 # SSR 渲染器
├── durable-objects/             # Durable Objects 类
│   ├── admin.ts                 # 管理员 DO
│   └── user.ts                  # 用户 DO
├── router/                      # API 路由
│   ├── admin.tsx                # 管理员路由
│   ├── siginin.tsx              # 登录路由
│   ├── siginup.tsx              # 注册路由
│   └── delate.tsx               # 删除路由
├── middleware/                  # 中间件
│   └── auth.ts                  # 认证中间件
├── types/                       # TypeScript 类型
├── utils/                       # 工具函数
│   └── password.ts              # 密码工具
├── frontend/                    # Vue 3 前端应用
│   ├── App.vue                  # 根组件
│   ├── main.js                  # 客户端入口
│   ├── index.html               # HTML 模板
│   ├── components/              # Vue 组件
│   ├── pages/                   # 页面组件
│   ├── composables/             # 组合式函数
│   ├── i18n/                    # 国际化
│   ├── config/                  # 配置
│   ├── assets/                  # 静态资源
│   ├── scripts/                 # 脚本
│   └── public/                  # 公共资源
├── docs/                        # 文档
├── scripts/                     # 构建脚本
├── .env                         # 环境变量
├── .dev.vars                    # 本地开发密钥
├── wrangler.toml                # Wrangler 配置 (备用)
├── wrangler.jsonc               # Wrangler 配置
├── package.json                 # 项目依赖
├── tsconfig.json                # TypeScript 配置
├── vite.config.ts               # Vite 配置
├── tailwind.config.js           # Tailwind 配置
├── postcss.config.js            # PostCSS 配置
└── README.md                    # 项目文档
```

## 🛠️ 技术栈

### 前端
- **Vue 3** - 渐进式 JavaScript 框架
- **Vue Router** - 官方路由管理器
- **Tailwind CSS** - 实用优先的 CSS 框架
- **Vue I18n** - 国际化插件

### 后端
- **Cloudflare Workers** - 无服务器执行环境
- **Hono** - 轻量级 Web 框架
- **Durable Objects** - 强一致性状态对象
- **TypeScript** - 类型安全的 JavaScript

### 构建工具
- **Vite** - 下一代前端工具链
- **Wrangler** - Cloudflare Workers CLI
- **PNPM** - 快速的包管理器

### 开发工具
- **ESLint** - 代码检查
- **Prettier** - 代码格式化

### 文档
- **[API 文档](./docs/API.md)** - 中文 API 参考文档
- **[API Documentation (EN)](./docs/API_EN.md)** - English API reference documentation

## 🤝 贡献

欢迎贡献！请随时提交 Pull Request。

### 开发流程

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🆘 支持

如果遇到问题或有疑问，请在 GitHub 上打开 issue。

---

由 OpenBioCard 团队用 ❤️ 制作
