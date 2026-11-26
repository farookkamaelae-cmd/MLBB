# Deployment

Production site: https://mlbb-amber.vercel.app
Vercel project: **mlbb**
Source repository: **farookkamaelae-cmd/MLBB**

The Vercel project is connected to this GitHub repository through Vercel's Git integration. Vercel creates a production deployment for pushes to main and preview deployments for pull requests. The deployed Next.js API route is available at /api/heroes.

The GitHub Actions workflow at .github/workflows/deploy.yml runs npm ci and npm run build for pull requests and pushes to main. Vercel performs the actual deployment from Git. No Vercel token or GitHub Actions deployment secrets are needed.

No app-specific environment variables are referenced by the source. Keep local .env.local files out of GitHub.

See Vercel's [Git deployment documentation](https://vercel.com/docs/git) for how repository pushes and pull requests are deployed.
