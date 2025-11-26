# 🚀 一键部署指南

## Cloudflare Workers 部署按钮

README 中的"部署到 Cloudflare Workers"按钮提供了流畅的部署体验。

### 工作原理

1. **点击部署按钮**：点击按钮后，你会被重定向到 Cloudflare 的部署界面
2. **连接 GitHub**：授权 Cloudflare 访问此仓库
3. **配置 Worker**：设置你的 Worker 名称并选择 Cloudflare 账户
4. **自动构建**：Cloudflare 会自动：
   - 克隆仓库
   - 使用 pnpm 安装依赖
   - 运行构建命令
   - 部署到 Cloudflare Workers
   - 设置 Durable Objects

### 部署过程

```bash
# 1. 克隆仓库
git clone https://github.com/OpenBioCard/OpenBioCard.git

# 2. 安装依赖
cd packages/worker
pnpm install

# 3. 构建项目
pnpm run build

# 4. 部署 Worker 和 Durable Objects
wrangler deploy
```

### 部署后步骤

成功部署后：

1. **访问你的 Worker**
   - 应用将在此地址可用：`https://openbiocard.<你的子域名>.workers.dev`
   - 或在 Cloudflare 控制台配置自定义域名

2. **配置环境变量**（如需要）
   ```bash
   # 通过 Wrangler CLI
   wrangler secret put 密钥名称

   # 或通过控制台
   # Workers & Pages > 你的 Worker > Settings > Variables
   ```

3. **验证 Durable Objects**
   - 前往：Workers & Pages > 你的 Worker > Durable Objects
   - 你应该看到已创建的 `UserDO` 和 `AdminDO` 命名空间

4. **设置自定义域名**（可选）
   - Workers & Pages > 你的 Worker > Settings > Domains & Routes
   - 添加你的自定义域名

### 故障排查

#### 构建失败
- 确保仓库是公开的，或你已授予必要的权限
- 在 Cloudflare 控制台检查构建日志

#### Durable Objects 无法工作
- 首次部署可能需要几分钟来传播
- 检查部署日志中的迁移是否成功运行

#### 缺少环境变量
- 通过控制台或 Wrangler CLI 设置必需的密钥
- 添加变量后重启 Worker

### 手动部署替代方案

如果一键部署不起作用，你可以手动部署：

```bash
# 1. 克隆并安装
git clone https://github.com/OpenBioCard/OpenBioCard.git
cd OpenBioCard
pnpm install

# 2. 登录 Wrangler
cd packages/worker
pnpm wrangler login

# 3. 部署
pnpm run deploy
```

### GitHub Actions 集成（即将推出）

对于持续部署，你可以设置 GitHub Actions：

```yaml
# .github/workflows/deploy.yml
name: 部署到 Cloudflare Workers

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - uses: pnpm/action-setup@v2
        with:
          version: 10

      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'pnpm'

      - run: pnpm install

      - run: pnpm run build

      - uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          workingDirectory: 'packages/worker'
```

## 支持

如有部署问题：
- 查看 [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)
- 在 [GitHub](https://github.com/OpenBioCard/OpenBioCard/issues) 提 issue
- 查看 Cloudflare 控制台中的部署日志

---

祝部署顺利！🎉
