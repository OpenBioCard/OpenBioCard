# 部署指南

本指南将帮助你将 OpenBioCard 部署到 Cloudflare Workers。

## 前置要求

在开始之前，请确保你拥有：

1.  **Cloudflare 账户**: 如果没有，请[注册](https://dash.cloudflare.com/sign-up)。
2.  **Node.js**: v20.x 或更高版本。
3.  **pnpm**: v9.x 或更高版本。
4.  **Git**: 已安装。

## 1. 准备工作

### 克隆仓库

```bash
git clone https://github.com/OpenBioCard/OpenBioCard.git
cd OpenBioCard
```

### 安装依赖

```bash
pnpm install
```

### 登录 Cloudflare

授权 Wrangler（Cloudflare Workers CLI）访问你的账户：

```bash
pnpm wrangler login
```

这将打开浏览器窗口进行授权。

## 2. 配置

### 项目配置 (`wrangler.jsonc`)

项目根目录包含 `wrangler.jsonc` 文件。该文件包含 Worker 的配置，包括 Durable Objects 和智能放置（Smart Placement）。

通常你不需要修改此文件，除非你想更改 Worker 名称或兼容性日期。

### 设置生产环境密钥

OpenBioCard 需要通过环境变量（Secrets）设置 Root 管理员账户。

运行以下命令设置 Root 管理员的用户名和密码：

```bash
# 设置 Root 用户名 (例如 "admin")
pnpm wrangler secret put ROOT_USERNAME

# 设置 Root 密码 (请选择一个强密码)
pnpm wrangler secret put ROOT_PASSWORD
```

你也可以稍后在 Cloudflare 控制台的 **Workers & Pages** -> **openbiocard** -> **Settings** -> **Variables and Secrets** 中设置这些。

## 3. 构建

构建生产环境项目。此命令将构建 Vue 3 前端并准备 Worker 资源。

```bash
pnpm build
```

**执行过程：**
1.  使用 Vite 构建前端应用 (`apps/frontend`)。
2.  将静态资源复制到后端分发文件夹。
3.  准备 Worker 部署。

## 4. 部署

将应用部署到 Cloudflare Workers：

```bash
pnpm deploy
```

**首次部署说明：**
首次部署时，Cloudflare 将自动：
1.  创建 Durable Objects 命名空间 (`UserDO` 和 `AdminDO`)。
2.  应用必要的迁移。

## 5. 部署后设置

### 验证部署

部署完成后，Wrangler 会输出你的 Worker URL，通常格式如下：
`https://openbiocard.<你的子域名>.workers.dev`

### 初始化管理员用户

为了确保管理员用户已在数据库中正确创建，请访问初始化端点：

```
https://<你的-worker-url>/init-admin
```

如果成功，你将看到确认初始化的 JSON 响应。

### (可选) 自定义域名

如果你想使用自定义域名 (例如 `card.yourdomain.com`)：

1.  进入 Cloudflare 控制台。
2.  导航至 **Workers & Pages** -> **openbiocard**。
3.  进入 **Settings** -> **Triggers**。
4.  点击 **Add Custom Domain** 并按照说明操作。

## 故障排除

### Durable Object 错误

如果遇到与 Durable Objects 或迁移相关的错误：
- 确保 `wrangler.jsonc` 具有正确的 `migrations` 配置（默认已设置）。
- 你可能需要确认 Durable Object 命名空间已在 Cloudflare 控制台中成功创建。

### 构建失败

如果 `pnpm build` 失败：
- 确保你使用的是正确的 Node.js 版本。
- 尝试删除 `node_modules` 和 `pnpm-lock.yaml`，然后重新运行 `pnpm install`。

### 500 错误

如果部署后收到 500 错误：
- 查看实时日志：
  ```bash
  pnpm wrangler tail
  ```
- 验证 `ROOT_USERNAME` 和 `ROOT_PASSWORD` 密钥是否已设置。
