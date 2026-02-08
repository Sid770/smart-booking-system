# Deployment Workflow

## 🚀 Quick Deploy Commands

### Push to GitHub
```bash
# Push to development
git checkout develop
git add .
git commit -m "feat: your feature description"
git push origin develop

# Push to staging
git checkout staging
git merge develop
git push origin staging

# Push to production
git checkout main
git merge staging
git push origin main
```

## 🔄 Automated CI/CD Pipeline

### Development Environment
- **Trigger:** Push to `develop` branch
- **Frontend:** Builds Angular app with development configuration
- **Backend:** Deploys .NET API to Azure App Service (Development)
- **Database:** Connected to Azure SQL Database (Development)
- **URL:** Check GitHub Actions output for deployment URL

### Staging Environment
- **Trigger:** Push to `staging` branch
- **Frontend:** Builds Angular app with staging configuration (optimized)
- **Backend:** Deploys .NET API to Azure App Service (Staging)
- **Database:** Connected to Azure SQL Database (Staging)
- **Purpose:** Pre-production testing, client demos

### Production Environment
- **Trigger:** Push to `main` branch
- **Frontend:** Builds Angular app with production configuration (fully optimized)
- **Backend:** Deploys .NET API to Azure App Service (Production)
- **Database:** Connected to Azure SQL Database (Production)
- **Purpose:** Live application for end users

## 📋 Pre-Deployment Checklist

Before deploying to any environment:

- [ ] All tests passing locally
- [ ] No console errors in browser
- [ ] Backend API endpoints tested
- [ ] Environment variables configured
- [ ] Database migrations ready (if any)
- [ ] GitHub secrets configured
- [ ] CORS settings updated for new domains

## 🔧 GitHub Secrets Required

### Frontend Deployment
```
AZURE_STATIC_WEB_APPS_API_TOKEN_DEV      # Development Static Web App token
AZURE_STATIC_WEB_APPS_API_TOKEN_STAGING  # Staging Static Web App token
AZURE_STATIC_WEB_APPS_API_TOKEN_PROD     # Production Static Web App token
```

### Backend Deployment
```
AZURE_WEBAPP_NAME_DEV                    # Development App Service name
AZURE_WEBAPP_NAME_STAGING                # Staging App Service name
AZURE_WEBAPP_NAME_PROD                   # Production App Service name
AZURE_WEBAPP_PUBLISH_PROFILE_DEV         # Development publish profile (XML)
AZURE_WEBAPP_PUBLISH_PROFILE_STAGING     # Staging publish profile (XML)
AZURE_WEBAPP_PUBLISH_PROFILE_PROD        # Production publish profile (XML)
```

## 📊 Monitoring Deployments

### View GitHub Actions Status
1. Go to: https://github.com/Sid770/smart-booking-system/actions
2. Click on the latest workflow run
3. Review logs for each job

### View Azure Resources
```bash
# List all resource groups
az group list --output table

# Check App Service status
az webapp show --name api-appointment-prod-[SUFFIX] --resource-group rg-appointment-prod

# View App Service logs
az webapp log tail --name api-appointment-prod-[SUFFIX] --resource-group rg-appointment-prod

# Check Static Web App status
az staticwebapp show --name swa-appointment-prod --resource-group rg-appointment-prod
```

## 🐛 Debugging Failed Deployments

### Frontend Build Failure
```bash
# Test build locally
npm run build -- --configuration staging

# Check for TypeScript errors
npm run build -- --configuration production

# Verify environment files exist
ls src/environments/
```

### Backend Build Failure
```bash
# Test build locally
cd backend
dotnet build --configuration Release
dotnet publish --configuration Release

# Check for compilation errors
dotnet build --verbosity detailed
```

### Database Connection Issues
```bash
# Test SQL Server connection
az sql server show --name sql-appointment-prod --resource-group rg-appointment-prod

# Check firewall rules
az sql server firewall-rule list --server sql-appointment-prod --resource-group rg-appointment-prod

# View connection strings
az webapp config connection-string list --name api-appointment-prod-[SUFFIX] --resource-group rg-appointment-prod
```

## 🔄 Rollback Strategy

### If deployment fails or has critical bug:

```bash
# Option 1: Revert the commit
git revert HEAD
git push origin main

# Option 2: Force push previous working commit
git reset --hard <previous-commit-hash>
git push --force origin main

# Option 3: Manual rollback in Azure Portal
# Go to App Service → Deployment Center → Logs
# Select previous successful deployment and redeploy
```

## 📝 Post-Deployment Testing

### Manual Tests After Each Deployment

1. **Homepage Loads:** Visit the deployed URL
2. **API Connectivity:** Check network tab for successful API calls
3. **Available Slots:** Browse available appointments
4. **Book Appointment:** Complete a test booking
5. **Admin Panel:** Verify slot creation/management
6. **Provider Management:** Check provider dropdown loads

### Automated Health Checks
```bash
# Test API health endpoint
curl https://api-appointment-prod-[SUFFIX].azurewebsites.net/api/providers

# Test frontend is accessible
curl https://swa-appointment-prod.azurestaticapps.net
```

## 📈 Environment Progression

```
Local Development
      ↓
   git push
      ↓
Development Branch (develop)
      ↓
   Test & Validate
      ↓
Staging Branch (staging)
      ↓
   Final QA & Demo
      ↓
Production Branch (main)
```

## 🎯 Best Practices

1. **Never push directly to main** - Always use develop → staging → main flow
2. **Test in staging first** - Catch issues before production
3. **Use descriptive commit messages** - Follow conventional commits
4. **Monitor after deployment** - Check logs for errors
5. **Keep environments in sync** - Update all environment files
6. **Document breaking changes** - Update README and docs
7. **Back up production database** - Before major updates
8. **Review GitHub Actions logs** - Understand what's deploying

## 🚨 Emergency Contacts

- **Azure Support:** https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade
- **GitHub Support:** https://support.github.com/
- **Repository Issues:** https://github.com/Sid770/smart-booking-system/issues

## 📚 Additional Resources

- [GitHub Actions Syntax](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions)
- [Azure Static Web Apps](https://docs.microsoft.com/en-us/azure/static-web-apps/)
- [Azure App Service](https://docs.microsoft.com/en-us/azure/app-service/)
- [Conventional Commits](https://www.conventionalcommits.org/)
