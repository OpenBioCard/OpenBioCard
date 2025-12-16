# OpenBioCard-Web

[![Deploy to Cloudflare Pages](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/your-repo/OpenBioCard-Web)

OpenBioCard-Web 是一个用于创建和管理生物卡片的 Vue.js 前端应用。

## 后端文档

有关后端设置和 API 文档，请参考：[OpenBioCard 后端](https://github.com/OpenBioCard/OpenBioCard)

## 前置要求

- Node.js（版本 18 或更高）
- pnpm（包管理器）
- Web 服务器（如 Nginx、Apache）或静态托管服务（如 Vercel、Netlify）

## 本地开发

1. 克隆仓库：
   ```bash
   git clone https://github.com/OpenBioCard/OpenBioCard-Web.git
   cd OpenBioCard-Web
   ```

2. 安装依赖：
   ```bash
   pnpm install
   ```

3. 启动开发服务器：
   ```bash
   pnpm dev
   ```

4. 在浏览器中打开 `http://localhost:5173`

## 生产环境构建

1. 构建应用：
   ```bash
   pnpm build
   ```

2. 构建文件将在 `dist/` 目录中。

## 部署选项

### 选项 1：手动部署到服务器

1. 如上所述构建应用。

2. 将 `dist/` 目录的内容上传到您的 Web 服务器。

3. 配置您的 Web 服务器以提供静态文件。对于 Nginx，添加如下配置：

   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       root /path/to/your/dist;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

4. 重启您的 Web 服务器。

### 选项 2：静态托管服务

- **Cloudflare Pages**：推荐用于自动部署。见下文设置。
- **Vercel**：连接您的 GitHub 仓库并自动部署。
- **Netlify**：拖拽 `dist/` 文件夹或通过 Git 连接。

### Cloudflare Pages 部署（推荐）

Cloudflare Pages 在您推送到主分支时提供自动部署。

1. 创建 Cloudflare Pages 项目：
   - 前往 [Cloudflare Pages](https://pages.cloudflare.com/)
   - 连接您的 GitHub 仓库
   - 设置构建参数：
     - 构建命令：`pnpm build`
     - 构建输出目录：`dist`
     - 根目录：`/`（留空）

2. 在 Cloudflare Pages 仪表板中添加环境变量（如需要）：
   - `NODE_VERSION`：`18`
   - 任何自定义环境变量

3. GitHub Actions 工作流（`.github/workflows/deploy.yml`）将在推送到主分支时处理自动部署。


## 环境变量

在根目录创建 `.env` 文件以进行环境特定配置：

```env
VITE_API_BASE_URL=https://your-api-domain.com/api
```

## 故障排除

- 如果遇到构建错误，请确保使用 `pnpm install` 安装所有依赖
- 对于部署问题，请检查您的 Web 服务器配置和文件权限
- 确保您的后端 API 可从部署的前端访问

## 支持

如有问题或疑问，请查看后端文档或在仓库中创建问题。