# OpenBioCard

✨ A free and open source decentralized electronic business card software ✨

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/OpenBioCard/OpenBioCard)

[📚 Detailed Deployment Guide](./DEPLOY.md) | [📚 中文部署指南](./DEPLOY.zh-CN.md)

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
- 🎨 **Modern UI** - Vue 3 + Tailwind CSS
- 🔒 **Secure Authentication** - Complete user authentication system
- 🌍 **Internationalization** - Multi-language interface support
- 📱 **Responsive Design** - Adapts to all devices
- ⚡ **Global Edge Network** - Fast content delivery worldwide

## 🚀 Quick Start

### Prerequisites

- **Node.js**: v20.x or later
- **pnpm**: v10.x or later
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
   ```bash
   cp .env.example .env  # If example file exists
   ```

4. **Start development server**
   ```bash
   pnpm run dev
   ```

The application will run on `http://localhost:8787`.

## ⚙️ Environment Configuration

### Local Development Environment Variables

Create a `.dev.vars` file (included in `.gitignore`):

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

`wrangler.jsonc` configuration file:

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

# Optional: Configure account ID
pnpm wrangler config
```

## 💻 Local Development

### Development Server

```bash
pnpm run dev
```

This command will start:
- Vite development server (with hot reload)
- Cloudflare Workers local runtime
- Durable Objects local storage

### Local Data Storage

Local Durable Objects data is stored in:
```
.wrangler/state/v3/do/
├── openbiocard-AdminDO/
└── openbiocard-UserDO/
```

This directory is automatically ignored by `.gitignore`.

### Type Generation

Generate TypeScript types based on Worker configuration:

```bash
pnpm run cf-typegen
```

## 🏗️ Build & Deploy

### Production Build

```bash
pnpm run build
```

Build artifacts are located in the `dist/` directory:

### Deploy to Cloudflare Workers

1. **Ensure you're logged in**
   ```bash
   pnpm wrangler login
   ```

2. **Build and deploy**
   ```bash
   pnpm run deploy
   ```

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

Or at your custom domain if configured in Cloudflare Dashboard.

### Initialize Admin User

After deployment, access the following endpoint to initialize the admin user:
```
https://your-domain.workers.dev/init-admin
```

## 📁 Project Structure

```
OpenBioCard/
├── index.tsx                    # Worker main entry
├── renderer.tsx                 # SSR renderer
├── durable-objects/             # Durable Objects classes
│   ├── admin.ts                 # Admin DO
│   └── user.ts                  # User DO
├── router/                      # API routes
│   ├── admin.tsx                # Admin routes
│   ├── siginin.tsx              # Sign-in routes
│   ├── siginup.tsx              # Sign-up routes
│   └── delate.tsx               # Delete routes
├── middleware/                  # Middleware
│   └── auth.ts                  # Authentication middleware
├── types/                       # TypeScript types
├── utils/                       # Utility functions
│   └── password.ts              # Password utilities
├── docs/                        # Documentation
├── scripts/                     # Build scripts
├── .env                         # Environment variables
├── .dev.vars                    # Local development secrets
├── wrangler.toml                # Wrangler config (backup)
├── wrangler.jsonc               # Wrangler configuration
├── package.json                 # Project dependencies
├── tsconfig.json                # TypeScript configuration
├── vite.config.ts               # Vite configuration
├── tailwind.config.js           # Tailwind configuration
├── postcss.config.js            # PostCSS configuration
└── README.md                    # Project documentation
```

## 🛠️ Technology Stack

### Frontend
- **Vue 3** - Progressive JavaScript framework
- **Vue Router** - Official routing manager
- **Tailwind CSS** - Utility-first CSS framework
- **Vue I18n** - Internationalization plugin

### Backend
- **Cloudflare Workers** - Serverless execution environment
- **Hono** - Lightweight web framework
- **Durable Objects** - Strongly consistent stateful objects
- **TypeScript** - Type-safe JavaScript

### Build Tools
- **Vite** - Next-generation frontend toolchain
- **Wrangler** - Cloudflare Workers CLI
- **PNPM** - Fast package manager

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting

### Documentation
- **[API 文档](./docs/API.md)** - Chinese API reference documentation
- **[API Documentation (EN)](./docs/API_EN.md)** - English API reference documentation

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Workflow

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
