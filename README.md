# OpenBioCard

✨ A free and open source decentralized electronic business card software ✨

[中文文档](./README.zh-CN.md)

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Development](#development)
- [Building](#building)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Technology Stack](#technology-stack)
- [License](#license)

## Overview

OpenBioCard is a decentralized electronic business card platform built on Cloudflare Workers. It allows users to create and share their professional profiles with customizable links and information.

## Features

- 🌐 Serverless architecture powered by Cloudflare Workers
- 💾 Data persistence with Durable Objects
- 🎨 Modern UI built with Vue 3 and Tailwind CSS
- 🔒 Secure authentication system
- 🌍 Internationalization support (i18n)
- 📱 Responsive design for all devices
- ⚡ Fast global edge network delivery

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v20.x or later
- **pnpm**: v10.x or later (Package Manager)
- **Cloudflare Account**: Free tier is sufficient
- **Wrangler CLI**: Installed automatically with dependencies

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/OpenBioCard.git
   cd OpenBioCard
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

## Configuration

### 1. Environment Variables

Create environment files in the `packages/worker` directory:

#### `.env` (For build-time configuration)

```env
# Add your build-time environment variables here
```

#### `.dev.vars` (For local development secrets)

```env
# Cloudflare Workers local development variables
# This file is ignored by git
# Add your local secrets here
```

**⚠️ Important**: Never commit `.env`, `.dev.vars`, or `.env.production` files to git. They are already included in `.gitignore`.

### 2. Wrangler Configuration

The Wrangler configuration is located at `packages/worker/wrangler.jsonc`:

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

### 3. Cloudflare Account Setup

1. **Login to Wrangler**

   ```bash
   cd packages/worker
   pnpm wrangler login
   ```

2. **Configure your account ID** (if needed)

   Update `wrangler.jsonc` with your account ID:

   ```jsonc
   {
     "account_id": "your-account-id-here"
   }
   ```

## Development

### Start Development Server

From the project root:

```bash
pnpm run dev
```

Or from the worker directory:

```bash
cd packages/worker
pnpm run dev
```

This will start:
- Vite development server with HMR (Hot Module Replacement)
- Cloudflare Workers local runtime
- Durable Objects local storage

The application will be available at `http://localhost:8787` (or the port shown in terminal).

### Local Durable Objects Data

Local Durable Objects data is stored in:
```
packages/worker/.wrangler/state/v3/do/
├── openbiocard-AdminDO/
└── openbiocard-UserDO/
```

**This directory is automatically ignored by git** to prevent local test data from being committed.

### Generate TypeScript Types

To generate TypeScript types based on your Worker configuration:

```bash
cd packages/worker
pnpm run cf-typegen
```

## Building

### Build for Production

From the project root:

```bash
pnpm run build
```

This will:
1. Build the Vue 3 client application
2. Build the SSR (Server-Side Rendering) bundle
3. Build the Cloudflare Worker bundle
4. Output to `packages/worker/dist/`

Build outputs:
```
dist/
├── client/          # Client-side assets
│   ├── assets/      # JS and CSS bundles
│   └── .vite/       # Vite manifest
├── openbiocard/     # Worker bundle
│   ├── index.js     # Main worker script
│   ├── wrangler.json
│   └── .vite/
└── index.js         # SSR entry
```

### Troubleshooting Build Issues

If you encounter a build loop, ensure:
1. The root `project.json` has correct build targets
2. Vite config properly externalizes `cloudflare:*` modules
3. No circular dependencies in the NX configuration

## Deployment

### Deploy to Cloudflare Workers

1. **Ensure you're logged in**

   ```bash
   cd packages/worker
   pnpm wrangler login
   ```

2. **Build and Deploy**

   ```bash
   pnpm run deploy
   ```

   Or from the root:

   ```bash
   cd packages/worker && pnpm run deploy
   ```

3. **First-time Durable Objects Setup**

   On first deployment, Cloudflare will automatically:
   - Create the Durable Objects namespaces
   - Run migrations defined in `wrangler.jsonc`
   - Bind the Durable Objects to your Worker

### Post-Deployment

After deployment, your application will be available at:
```
https://openbiocard.<your-subdomain>.workers.dev
```

Or at your custom domain if configured in Cloudflare Dashboard.

### Environment Variables in Production

To set production environment variables:

```bash
# Set a secret
pnpm wrangler secret put SECRET_NAME

# Or use the Cloudflare Dashboard:
# Workers & Pages > Your Worker > Settings > Variables
```

### Durable Objects in Production

- Production Durable Objects data is stored in Cloudflare's global network
- Data persists across deployments
- Each Durable Object instance is automatically distributed globally
- To view Durable Objects in dashboard: Workers & Pages > Your Worker > Durable Objects

## Project Structure

```
OpenBioCard/
├── packages/
│   ├── worker/                    # Main Cloudflare Worker application
│   │   ├── src/
│   │   │   ├── frontend/         # Vue 3 frontend application
│   │   │   │   ├── components/   # Vue components
│   │   │   │   ├── pages/        # Page components
│   │   │   │   ├── i18n/         # Internationalization
│   │   │   │   ├── App.vue       # Root component
│   │   │   │   ├── main.js       # Client entry
│   │   │   │   ├── index.html    # HTML template
│   │   │   │   └── style.css     # Global styles
│   │   │   ├── server/           # Cloudflare Worker backend
│   │   │   │   ├── durable-objects/  # Durable Objects classes
│   │   │   │   │   ├── admin.ts      # AdminDO
│   │   │   │   │   └── user.ts       # UserDO
│   │   │   │   ├── router/       # API routes
│   │   │   │   ├── middleware/   # Hono middleware
│   │   │   │   ├── types/        # TypeScript types
│   │   │   │   ├── utils/        # Utility functions
│   │   │   │   ├── index.tsx     # Worker entry
│   │   │   │   └── renderer.tsx  # SSR renderer
│   │   │   └── public/           # Static assets
│   │   ├── dist/                 # Build output (gitignored)
│   │   ├── .wrangler/            # Local dev data (gitignored)
│   │   ├── vite.config.ts        # Vite configuration
│   │   ├── wrangler.jsonc        # Wrangler configuration
│   │   ├── package.json          # Worker dependencies
│   │   └── project.json          # NX project config
│   └── sslink/                   # Additional package
├── node_modules/                 # Dependencies (gitignored)
├── .nx/                          # NX cache (gitignored)
├── nx.json                       # NX workspace configuration
├── package.json                  # Root package.json
├── pnpm-workspace.yaml           # PNPM workspace config
├── .gitignore                    # Git ignore rules
└── README.md                     # This file
```

## Technology Stack

### Frontend
- **Vue 3**: Progressive JavaScript framework
- **Vue Router**: Official router for Vue.js
- **Tailwind CSS 4**: Utility-first CSS framework
- **Vue I18n**: Internationalization plugin

### Backend
- **Cloudflare Workers**: Serverless execution environment
- **Hono**: Fast, lightweight web framework
- **Durable Objects**: Strongly consistent, stateful objects
- **TypeScript**: Type-safe JavaScript

### Build Tools
- **Vite 6**: Next-generation frontend tooling
- **NX**: Smart monorepo build system
- **Wrangler**: Cloudflare Workers CLI
- **PNPM**: Fast, disk space efficient package manager

### Development Tools
- **vite-ssr-components**: SSR support for Vite
- **@cloudflare/vite-plugin**: Cloudflare Workers integration

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

Made with ❤️ by the OpenBioCard team
