# 🚀 One-Click Deployment Guide

## Cloudflare Workers Deploy Button

The "Deploy to Cloudflare Workers" button in the README provides a streamlined deployment experience.

### How it Works

1. **Click the Deploy Button**: When you click the button, you'll be redirected to Cloudflare's deployment interface
2. **Connect GitHub**: Authorize Cloudflare to access this repository
3. **Configure Worker**: Set your Worker name and select your Cloudflare account
4. **Automatic Build**: Cloudflare will automatically:
   - Clone the repository
   - Install dependencies with pnpm
   - Run the build command
   - Deploy to Cloudflare Workers
   - Set up Durable Objects

### What Happens During Deployment

```bash
# 1. Repository is cloned
git clone https://github.com/OpenBioCard/OpenBioCard.git

# 2. Dependencies are installed
cd packages/worker
pnpm install

# 3. Project is built
pnpm run build

# 4. Worker is deployed with Durable Objects
wrangler deploy
```

### Post-Deployment Steps

After successful deployment:

1. **Access Your Worker**
   - Your application will be available at: `https://openbiocard.<your-subdomain>.workers.dev`
   - Or configure a custom domain in the Cloudflare dashboard

2. **Configure Environment Variables** (if needed)
   ```bash
   # Via Wrangler CLI
   wrangler secret put SECRET_NAME

   # Or via Dashboard
   # Workers & Pages > Your Worker > Settings > Variables
   ```

3. **Verify Durable Objects**
   - Go to: Workers & Pages > Your Worker > Durable Objects
   - You should see `UserDO` and `AdminDO` namespaces created

4. **Set Up Custom Domain** (optional)
   - Workers & Pages > Your Worker > Settings > Domains & Routes
   - Add your custom domain

### Troubleshooting

#### Build Fails
- Ensure the repository is public or you've granted necessary permissions
- Check build logs in Cloudflare dashboard

#### Durable Objects Not Working
- First deployment may take a few minutes to propagate
- Check that migrations ran successfully in deployment logs

#### Environment Variables Missing
- Set required secrets via dashboard or Wrangler CLI
- Restart the Worker after adding variables

### Manual Deployment Alternative

If one-click deployment doesn't work, you can deploy manually:

```bash
# 1. Clone and install
git clone https://github.com/OpenBioCard/OpenBioCard.git
cd OpenBioCard
pnpm install

# 2. Login to Wrangler
cd packages/worker
pnpm wrangler login

# 3. Deploy
pnpm run deploy
```

### GitHub Actions Integration (Coming Soon)

For continuous deployment, you can set up GitHub Actions:

```yaml
# .github/workflows/deploy.yml
name: Deploy to Cloudflare Workers

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

## Support

For deployment issues:
- Check [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- Open an issue on [GitHub](https://github.com/OpenBioCard/OpenBioCard/issues)
- Review deployment logs in Cloudflare dashboard

---

Happy deploying! 🎉
