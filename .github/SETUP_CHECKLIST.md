# Auto-Deployment Setup Checklist

Use this checklist to ensure your auto-deployment is properly configured.

## Prerequisites

- [ ] GitHub repository created: `el-together/together-website`
- [ ] Netlify site created and live
- [ ] Twilio account with active phone number
- [ ] Admin access to GitHub repository

## GitHub Secrets Configuration

Go to: `https://github.com/el-together/together-website/settings/secrets/actions`

### Required Secrets

- [ ] `NETLIFY_AUTH_TOKEN` added
- [ ] `NETLIFY_SITE_ID` added
- [ ] `TWILIO_ACCOUNT_SID` added
- [ ] `TWILIO_AUTH_TOKEN` added
- [ ] `TWILIO_PHONE_NUMBER` added

### Verify Secrets Are Set

1. Go to repository Settings → Secrets and variables → Actions
2. You should see all 5 secrets listed (values will be hidden)
3. If any are missing, click "New repository secret" to add them

## Workflow File

- [ ] `.github/workflows/deploy.yml` exists in repository
- [ ] File is committed and pushed to `main` branch

## Test Deployment

### Option 1: Trigger via Push

```bash
# Make a test change
echo "# Test deployment" >> README.md

# Commit and push
git add README.md
git commit -m "test: verify auto-deployment"
git push origin main
```

### Option 2: Trigger via GitHub UI

1. Go to Actions tab
2. Select "Deploy to Netlify" workflow
3. Click "Run workflow" dropdown
4. Click green "Run workflow" button

## Verification Steps

After pushing to `main`:

1. **Check GitHub Actions**
   - [ ] Go to repository → Actions tab
   - [ ] Verify workflow is running (yellow circle) or completed (green checkmark)
   - [ ] Click on workflow run to see detailed logs
   - [ ] Verify all steps completed successfully

2. **Check Netlify Dashboard**
   - [ ] Log in to Netlify
   - [ ] Go to your site's deploys page
   - [ ] Verify new deployment appears
   - [ ] Check deployment status is "Published"

3. **Check Live Site**
   - [ ] Visit https://together.day
   - [ ] Verify your changes are live
   - [ ] Test functionality (SMS form, navigation, etc.)

4. **Check Deployment Comments** (for Pull Requests)
   - [ ] Create a test PR
   - [ ] Verify GitHub Action adds a comment with preview URL
   - [ ] Test the preview deployment

## Common Issues & Solutions

### Issue: Workflow doesn't appear in Actions tab

**Solutions:**
- [ ] Ensure `.github/workflows/deploy.yml` is pushed to `main` branch
- [ ] Check file has correct YAML syntax (no tabs, proper indentation)
- [ ] Verify GitHub Actions is enabled: Settings → Actions → General

### Issue: Workflow fails with authentication error

**Solutions:**
- [ ] Re-verify `NETLIFY_AUTH_TOKEN` is correct
- [ ] Generate new Netlify token and update secret
- [ ] Check token has deployment permissions

### Issue: Deployment succeeds but changes not visible

**Solutions:**
- [ ] Check browser cache (hard refresh: Cmd+Shift+R or Ctrl+F5)
- [ ] Verify correct site ID in `NETLIFY_SITE_ID`
- [ ] Check Netlify deploy logs for the specific deploy

### Issue: SMS function not working

**Solutions:**
- [ ] Verify all 3 Twilio secrets are set correctly
- [ ] Check Twilio phone number includes country code (+1)
- [ ] Test credentials in Twilio Console
- [ ] Check Netlify Functions logs for errors

## Post-Setup

Once everything is verified:

- [ ] Remove test commits if needed
- [ ] Document any custom configuration
- [ ] Share deployment process with team
- [ ] Set up branch protection rules (optional)
- [ ] Configure deployment notifications (optional)

## Success Criteria

Your auto-deployment is fully configured when:

- ✅ Pushing to `main` automatically triggers deployment
- ✅ GitHub Actions shows green checkmark
- ✅ Changes appear on https://together.day within 2-3 minutes
- ✅ Netlify dashboard shows successful deployment
- ✅ SMS functionality works (Twilio integration active)
- ✅ Status badge in README shows passing

---

**Need Help?** See detailed instructions in `.github/DEPLOYMENT.md`
