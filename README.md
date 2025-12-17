# OpenBioCard

✨ A free and open source decentralized electronic business card software ✨

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/OpenBioCard/OpenBioCard)

[📚 Detailed Deployment Guide](./docs/DEPLOY.md) | [📚 中文部署指南](./docs/DEPLOY.zh-CN.md) | [简体中文](./README.zh-CN.md)

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Quick Start](#-quick-start)
- [Environment Configuration](#-environment-configuration)
- [Local Development](#-local-development)
- [Build & Deploy](#-build--deploy)
- [Project Structure](#-project-structure)
- [Technology Stack](#-technology-stack)
- [Contributing](#-contributing)
- [License](#-license)

## 🌟 Overview

OpenBioCard is a decentralized electronic business card platform built on Cloudflare Workers. It allows users to create and share personalized professional profiles with customizable links and information.

**📖 [API 文档](./docs/API.md)** | **📖 [API Documentation (EN)](./docs/API_EN.md)**

## ✨ Features

- 🌐 **Serverless Architecture** - Powered by Cloudflare Workers
- 💾 **Data Persistence** - Using Durable Objects
- 🎨 **Modern UI** - Vue 3 + Tailwind CSS 4
- 🔒 **Secure Authentication** - Complete user authentication system
- 🌍 **Internationalization** - Multi-language interface support
- 📱 **Responsive Design** - Adapts to all devices
- ⚡ **Global Edge Network** - Fast content delivery worldwide
- 📦 **Monorepo Structure** - Managed efficiently with PNPM

## 🚀 Quick Start

### Prerequisites

- **Node.js**: v20.x or later
- **pnpm**: v9.x or later
- **Cloudflare Account**: Free tier is sufficient

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/OpenBioCard/OpenBioCard.git
   cd OpenBioCard
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Configure environment variables**
   See [Environment Configuration](#-environment-configuration) section.

4. **Start development server**
   ```bash
   pnpm dev
   ```
   The application will run on `http://localhost:8787`.

## ⚙️ Environment Configuration

### Local Development Environment Variables

Create a `.dev.vars` file in the **project root**:

```env
# Required secrets
ROOT_USERNAME=root
ROOT_PASSWORD=your_secure_password_here

# Optional environment variables
CORS_ALLOWED_ORIGINS=*
CORS_ALLOWED_METHODS=GET,POST,PUT,DELETE,OPTIONS
CORS_ALLOWED_HEADERS=Content-Type,Authorization
```

### Production Environment Configuration

#### 1. Wrangler Configuration

`wrangler.jsonc` is located in the project root. It handles the Cloudflare Workers configuration, including Durable Objects bindings and migrations.

#### 2. Set Production Secrets

Use Wrangler CLI to set sensitive information:

```bash
# Set root username
pnpm wrangler secret put ROOT_USERNAME

# Set root password
pnpm wrangler secret put ROOT_PASSWORD
```

#### 3. Cloudflare Account Configuration

```bash
# Login to Wrangler
pnpm wrangler login
```

## 💻 Local Development

### Development Server

```bash
pnpm dev
```

This command will start the Vite development server for the frontend, which integrates with the Cloudflare Workers environment via `@cloudflare/vite-plugin`. It provides a seamless full-stack development experience.

### Local Data Storage

Local Durable Objects data is stored in:
```
apps/backend/.wrangler/state/v3/do/
├── openbiocard-AdminDO/
└── openbiocard-UserDO/
```

### Type Generation

Generate TypeScript types based on Worker configuration:

```bash
pnpm --filter openbiocard-backend cf-typegen
```

## 🏗️ Build & Deploy

### Production Build

```bash
pnpm build
```

This will build both the frontend and backend applications. The artifacts will be located in:
- Frontend: `apps/frontend/dist/`
- Backend: `apps/backend/dist/` (includes frontend assets)

### Deploy to Cloudflare Workers

1. **Ensure you're logged in**
   ```bash
   pnpm wrangler login
   ```

2. **Deploy**
   ```bash
   pnpm deploy
   ```
   This command deploys the backend worker (which serves the frontend assets) to Cloudflare.

3. **First-time Durable Objects Setup**

   Cloudflare will automatically:
   - Create Durable Objects namespaces
   - Run migrations defined in `wrangler.jsonc`
   - Bind Durable Objects to your Worker

### Post-Deployment Configuration

After deployment, your application will be available at:
```
https://openbiocard.<your-subdomain>.workers.dev
```

### Initialize Admin User

After deployment, access the following endpoint to initialize the admin user:
```
https://your-domain.workers.dev/init-admin
```

## 📁 Project Structure

```
OpenBioCard/
├── apps/
│   ├── backend/               # Cloudflare Worker Backend
│   │   ├── durable-objects/   # Durable Objects classes
│   │   ├── router/            # Hono API routes
│   │   ├── middleware/        # Middleware
│   │   ├── types/             # Backend types
│   │   ├── utils/             # Utility functions
│   │   └── index.tsx          # Worker entry point
│   └── frontend/              # Vue 3 Frontend
│       ├── src/               # Source code (if applicable)
│       ├── components/        # Vue components
│       ├── pages/             # Pages (File-based routing)
│       ├── composables/       # Composition API hooks
│       ├── api/               # API clients
│       └── i18n/              # Internationalization
├── docs/                      # Documentation
├── wrangler.jsonc             # Wrangler configuration
├── package.json               # Root package.json (Workspaces)
├── pnpm-workspace.yaml        # PNPM workspace config
└── .dev.vars                  # Local secrets (not committed)
```

## 🛠️ Technology Stack

### Frontend
- **Vue 3** - Progressive JavaScript framework
- **Vue Router** - Official routing manager
- **Tailwind CSS 4** - Utility-first CSS framework
- **Vue I18n** - Internationalization plugin
- **Vite 6** - Next-generation frontend toolchain

### Backend
- **Cloudflare Workers** - Serverless execution environment
- **Hono** - Lightweight web framework
- **Durable Objects** - Strongly consistent stateful objects
- **TypeScript** - Type-safe JavaScript

### Build Tools
- **PNPM** - Fast, disk space efficient package manager
- **Wrangler** - Cloudflare Workers CLI

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork this project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

Made with ❤️ by the OpenBioCard team
