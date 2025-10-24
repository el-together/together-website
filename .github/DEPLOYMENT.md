# Deployment Guide - Together Website

This guide explains how to configure automatic deployment to Netlify via GitHub Actions.

## Overview

The project uses GitHub Actions to automatically deploy to Netlify whenever changes are pushed or merged to the `main` branch.

**Workflow file:** `.github/workflows/deploy.yml`

## Prerequisites

1. GitHub repository with admin access
2. Netlify account with the site already created
3. Twilio account (for SMS functionality)

## Setup Instructions

### Step 1: Get Netlify Credentials

#### 1.1 Get Netlify Auth Token

1. Log in to [Netlify](https://app.netlify.com/)
2. Click on your profile picture (top right)
3. Go to **User settings**
4. Navigate to **Applications** tab
5. Under **Personal access tokens**, click **New access token**
6. Give it a name (e.g., "GitHub Actions Deploy")
7. Click **Generate token**
8. **Copy the token** (you won't be able to see it again!)

#### 1.2 Get Netlify Site ID

**Option A - From Netlify Dashboard:**
1. Go to your site in Netlify
2. Click **Site settings**
3. Under **General → Site details**, find **Site ID**
4. Copy the Site ID (format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)

**Option B - From netlify.toml (if configured):**
```bash
# Run this in your local project directory
netlify status
```

**Option C - From Site URL:**
The Site ID is in your Netlify admin URL:
`https://app.netlify.com/sites/[SITE_ID]/overview`

### Step 2: Get Twilio Credentials

1. Log in to [Twilio Console](https://console.twilio.com/)
2. From your dashboard, copy:
   - **Account SID**
   - **Auth Token** (click "Show" to reveal)
3. Go to **Phone Numbers → Manage → Active numbers**
4. Copy your **Twilio phone number** (format: `+1234567890`)

### Step 3: Configure GitHub Secrets

1. Go to your GitHub repository
2. Click **Settings** tab
3. In the left sidebar, click **Secrets and variables → Actions**
4. Click **New repository secret** button
5. Add each of the following secrets:

| Secret Name | Value | Where to Find |
|-------------|-------|---------------|
| `NETLIFY_AUTH_TOKEN` | Your Netlify personal access token | Netlify → User settings → Applications |
| `NETLIFY_SITE_ID` | Your Netlify site ID | Netlify → Site settings → Site details |
| `TWILIO_ACCOUNT_SID` | Your Twilio Account SID | Twilio Console dashboard |
| `TWILIO_AUTH_TOKEN` | Your Twilio Auth Token | Twilio Console dashboard |
| `TWILIO_PHONE_NUMBER` | Your Twilio phone number | Twilio → Phone Numbers |

**For each secret:**
- Click **New repository secret**
- Enter the **Name** (exactly as shown above)
- Paste the **Value**
- Click **Add secret**

### Step 4: Test the Deployment

Once all secrets are configured:

1. Make a small change to any file (e.g., update a comment)
2. Commit and push to `main`:
   ```bash
   git add .
   git commit -m "test: trigger auto-deployment"
   git push origin main
   ```
3. Go to your repository on GitHub
4. Click the **Actions** tab
5. You should see your workflow running
6. Click on the workflow run to see detailed logs

### Step 5: Verify Deployment

1. Wait for the GitHub Action to complete (usually 1-2 minutes)
2. Check the workflow logs for the deployment URL
3. Visit https://together.day to verify the changes are live

## Workflow Details

### When Deployment Triggers

The workflow automatically runs on:
- **Push to main** - Full production deployment
- **Pull requests to main** - Preview deployment with comment on PR

### What Happens During Deployment

1. **Checkout code** - Gets the latest code from the repository
2. **Setup Node.js** - Installs Node.js 18 with npm caching
3. **Install dependencies** - Runs `npm install`
4. **Deploy to Netlify** - Uploads files and deploys the site
5. **Status message** - Confirms successful deployment

### Environment Variables

The following environment variables are automatically passed to Netlify Functions during deployment:

- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_PHONE_NUMBER`

These are used by the `netlify/functions/send-sms.js` serverless function.

## Troubleshooting

### Workflow Fails with "401 Unauthorized"

**Cause:** Invalid or expired Netlify credentials

**Solution:**
1. Verify `NETLIFY_AUTH_TOKEN` is correct
2. Generate a new token if needed
3. Update the secret in GitHub

### Workflow Fails with "Site not found"

**Cause:** Incorrect Netlify Site ID

**Solution:**
1. Double-check your `NETLIFY_SITE_ID`
2. Verify you're using the correct Netlify account
3. Update the secret in GitHub

### SMS Function Not Working After Deployment

**Cause:** Missing or incorrect Twilio credentials

**Solution:**
1. Verify all three Twilio secrets are set correctly
2. Check Twilio phone number format includes `+` prefix
3. Test credentials in Twilio Console

### Workflow Doesn't Trigger

**Cause:** Workflow file syntax error or disabled Actions

**Solution:**
1. Check `.github/workflows/deploy.yml` for syntax errors
2. Go to repository Settings → Actions → General
3. Ensure Actions are enabled

## Manual Deployment (Emergency)

If GitHub Actions is unavailable, you can deploy manually:

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod
```

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Netlify Deploy with GitHub Actions](https://github.com/marketplace/actions/netlify-actions)
- [Netlify Functions Documentation](https://docs.netlify.com/functions/overview/)
- [Twilio API Documentation](https://www.twilio.com/docs)

## Security Notes

- Never commit secrets to the repository
- Use GitHub Secrets for all sensitive credentials
- Rotate tokens periodically for security
- The `.env.example` file shows what environment variables are needed, but never contains real values

## Support

For issues with:
- **GitHub Actions:** Check workflow logs in Actions tab
- **Netlify deployment:** Check Netlify deploy logs in dashboard
- **Twilio SMS:** Check Twilio Console logs

---

Last updated: 2025-10-24
