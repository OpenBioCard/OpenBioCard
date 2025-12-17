# Deployment Guide

This guide will help you deploy OpenBioCard to Cloudflare Workers.

## Prerequisites

Before you begin, ensure you have:

1.  **Cloudflare Account**: [Sign up](https://dash.cloudflare.com/sign-up) if you don't have one.
2.  **Node.js**: v20.x or later.
3.  **pnpm**: v9.x or later.
4.  **Git**: Installed on your machine.

## 1. Preparation

### Clone the Repository

```bash
git clone https://github.com/OpenBioCard/OpenBioCard.git
cd OpenBioCard
```

### Install Dependencies

```bash
pnpm install
```

### Login to Cloudflare

Authenticate Wrangler (the Cloudflare Workers CLI) with your account:

```bash
pnpm wrangler login
```

This will open a browser window to authorize Wrangler.

## 2. Configuration

### Project Configuration (`wrangler.jsonc`)

The project comes with a `wrangler.jsonc` file in the root directory. This file contains the configuration for your Worker, including Durable Objects and Smart Placement.

You generally don't need to modify this file unless you want to change the worker name or compatibility date.

### Set Production Secrets

OpenBioCard requires a root administrator account to be set up via environment variables (secrets).

Run the following commands to set the username and password for the root admin:

```bash
# Set the root username (e.g., "admin")
pnpm wrangler secret put ROOT_USERNAME

# Set the root password (choose a strong password)
pnpm wrangler secret put ROOT_PASSWORD
```

You can also set these later in the Cloudflare Dashboard under **Workers & Pages** -> **openbiocard** -> **Settings** -> **Variables and Secrets**.

## 3. Build

Build the project for production. This command will build the Vue 3 frontend and prepare the Worker assets.

```bash
pnpm build
```

**What this does:**
1.  Builds the frontend application (`apps/frontend`) using Vite.
2.  Copies the static assets to the backend distribution folder.
3.  Prepares the Worker for deployment.

## 4. Deploy

Deploy the application to Cloudflare Workers:

```bash
pnpm deploy
```

**First-time Deployment Note:**
On the first deployment, Cloudflare will automatically:
1.  Create the Durable Objects namespaces (`UserDO` and `AdminDO`).
2.  Apply any necessary migrations.

## 5. Post-Deployment Setup

### Verify Deployment

After deployment, Wrangler will output your Worker's URL, typically looking like:
`https://openbiocard.<your-subdomain>.workers.dev`

### Initialize Admin User

To ensure the admin user is correctly created in the database, visit the initialization endpoint:

```
https://<your-worker-url>/init-admin
```

If successful, you will see a JSON response confirming the initialization.

### (Optional) Custom Domain

If you want to use a custom domain (e.g., `card.yourdomain.com`):

1.  Go to the Cloudflare Dashboard.
2.  Navigate to **Workers & Pages** -> **openbiocard**.
3.  Go to **Settings** -> **Triggers**.
4.  Click **Add Custom Domain** and follow the instructions.

## Troubleshooting

### Durable Object Errors

If you see errors related to Durable Objects or migrations:
- Ensure your `wrangler.jsonc` has the correct `migrations` configuration (it should be set up by default).
- You may need to verify that the Durable Object namespaces were created successfully in the Cloudflare Dashboard.

### Build Failures

If `pnpm build` fails:
- Ensure you are using the correct Node.js version.
- Try removing `node_modules` and `pnpm-lock.yaml` and re-running `pnpm install`.

### 500 Errors

If you receive 500 errors after deployment:
- Check the real-time logs:
  ```bash
  pnpm wrangler tail
  ```
- Verify that `ROOT_USERNAME` and `ROOT_PASSWORD` secrets are set.
