# Deploying to Vercel

This is a Next.js app with a server API route (/api/heroes), so deploy it to a serverless platform such as Vercel. GitHub Pages is not suitable because it cannot run the API route.

## Configure Vercel

1. Create a Vercel project for this repository and keep the detected Next.js framework settings.
2. In Vercel, find the project ID in Project Settings → General and the team/account ID in the team settings.
3. Create a Vercel access token in your account settings.
4. In GitHub, open Settings → Secrets and variables → Actions for this repository and add:
   - VERCEL_TOKEN
   - VERCEL_ORG_ID
   - VERCEL_PROJECT_ID

The workflow in .github/workflows/deploy.yml builds on pull requests and pushes to main. It deploys to Vercel after a successful build when all three secrets exist. Without them, the build check still runs and the deployment step is skipped with a notice. You can also start the production deployment manually from Actions → Build and deploy to Vercel → Run workflow, using the main branch.

No app-specific environment variables are currently required by the source. Keep local .env.local files out of GitHub.

## Avoid duplicate production deployments

If the Vercel project is connected to GitHub with automatic production deployments enabled, a push to main can create both a Git integration deployment and a GitHub Actions deployment. Choose one production deployment path: use this workflow and disable the duplicate Git production deployment, or remove/disable the workflow's deploy job and use Vercel's native Git integration.

Vercel's [GitHub Actions guide](https://vercel.com/kb/guide/how-can-i-use-github-actions-with-vercel) describes the CLI build and prebuilt deployment flow used here.
