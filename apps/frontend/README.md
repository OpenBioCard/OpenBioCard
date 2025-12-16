# OpenBioCard-Web

[![Deploy to Cloudflare Pages](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/your-repo/OpenBioCard-Web)

OpenBioCard-Web is a Vue.js frontend application for creating and managing bio cards.

## Backend Documentation

For backend setup and API documentation, please refer to: [OpenBioCard Backend](https://github.com/OpenBioCard/OpenBioCard)

## Prerequisites

- Node.js (version 18 or higher)
- pnpm (package manager)
- A web server (e.g., Nginx, Apache) or static hosting service (e.g., Vercel, Netlify)

## Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/OpenBioCard/OpenBioCard-Web.git
   cd OpenBioCard-Web
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start development server:
   ```bash
   pnpm dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Building for Production

1. Build the application:
   ```bash
   pnpm build
   ```

2. The built files will be in the `dist/` directory.

## Deployment Options

### Option 1: Manual Deployment to Server

1. Build the application as described above.

2. Upload the contents of the `dist/` directory to your web server.

3. Configure your web server to serve the static files. For Nginx, add a configuration like:

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

4. Restart your web server.

### Option 2: Static Hosting Services

- **Cloudflare Pages**: Recommended for automatic deployments. See below for setup.
- **Vercel**: Connect your GitHub repository and deploy automatically.
- **Netlify**: Drag and drop the `dist/` folder or connect via Git.

### Cloudflare Pages Deployment (Recommended)

Cloudflare Pages provides automatic deployments when you push to the main branch.

1. Create a Cloudflare Pages project:
   - Go to [Cloudflare Pages](https://pages.cloudflare.com/)
   - Connect your GitHub repository
   - Set build settings:
     - Build command: `pnpm build`
     - Build output directory: `dist`
     - Root directory: `/` (leave empty)

2. Add environment variables in Cloudflare Pages dashboard if needed:
   - `NODE_VERSION`: `18`
   - Any custom environment variables

3. The GitHub Actions workflow (`.github/workflows/deploy.yml`) will handle automatic deployments on push to main branch.


## Environment Variables

Create a `.env` file in the root directory for environment-specific configurations:

```env
VITE_API_BASE_URL=https://your-api-domain.com/api
```

## Troubleshooting

- If you encounter build errors, ensure all dependencies are installed with `pnpm install`
- For deployment issues, check your web server configuration and file permissions
- Ensure your backend API is accessible from the deployed frontend

## Support

For issues or questions, please check the backend documentation or create an issue in the repository.
