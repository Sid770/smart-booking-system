# Azure Deployment Guide

This guide will walk you through deploying the Smart Appointment Booking System to Azure using your Azure Student subscription.

## Prerequisites

- Azure Student account (already have ✓)
- Azure CLI installed: `winget install Microsoft.AzureCLI`
- GitHub account with repository at https://github.com/Sid770/smart-booking-system

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     GitHub Repository                        │
│  Branches: main (production), develop, staging              │
└──────────────────┬──────────────────────────────────────────┘
                   │ GitHub Actions CI/CD
                   ├──────────┬──────────┬─────────────
                   ▼          ▼          ▼
        ┌──────────────┬──────────────┬──────────────┐
        │ Development  │   Staging    │  Production  │
        └──────────────┴──────────────┴──────────────┘
                   │          │          │
        ┌──────────────┬──────────────┬──────────────┐
        │ Static Web   │ Static Web   │ Static Web   │
        │ App (Dev)    │ App (Staging)│ App (Prod)   │
        │              │              │              │
        │ App Service  │ App Service  │ App Service  │
        │ (API Dev)    │ (API Staging)│ (API Prod)   │
        │              │              │              │
        │ SQL Database │ SQL Database │ SQL Database │
        └──────────────┴──────────────┴──────────────┘
```

## Step 1: Login to Azure

```powershell
# Login to Azure
az login

# Set your subscription (if you have multiple)
az account list --output table
az account set --subscription "Azure for Students"
```

## Step 2: Create Resource Groups

```powershell
# Create resource groups for each environment
az group create --name rg-appointment-dev --location eastus
az group create --name rg-appointment-staging --location eastus
az group create --name rg-appointment-prod --location eastus
```

## Step 3: Deploy Azure SQL Databases

### Development Database
```powershell
az sql server create \
  --name sql-appointment-dev \
  --resource-group rg-appointment-dev \
  --location eastus \
  --admin-user sqladmin \
  --admin-password 'YourSecurePassword123!'

az sql db create \
  --resource-group rg-appointment-dev \
  --server sql-appointment-dev \
  --name AppointmentDB \
  --service-objective S0 \
  --backup-storage-redundancy Local

# Allow Azure services to access
az sql server firewall-rule create \
  --resource-group rg-appointment-dev \
  --server sql-appointment-dev \
  --name AllowAzureServices \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0
```

### Staging Database
```powershell
az sql server create \
  --name sql-appointment-staging \
  --resource-group rg-appointment-staging \
  --location eastus \
  --admin-user sqladmin \
  --admin-password 'YourSecurePassword123!'

az sql db create \
  --resource-group rg-appointment-staging \
  --server sql-appointment-staging \
  --name AppointmentDB \
  --service-objective S0 \
  --backup-storage-redundancy Local

az sql server firewall-rule create \
  --resource-group rg-appointment-staging \
  --server sql-appointment-staging \
  --name AllowAzureServices \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0
```

### Production Database
```powershell
az sql server create \
  --name sql-appointment-prod \
  --resource-group rg-appointment-prod \
  --location eastus \
  --admin-user sqladmin \
  --admin-password 'YourSecurePassword123!'

az sql db create \
  --resource-group rg-appointment-prod \
  --server sql-appointment-prod \
  --name AppointmentDB \
  --service-objective S0 \
  --backup-storage-redundancy Local

az sql server firewall-rule create \
  --resource-group rg-appointment-prod \
  --server sql-appointment-prod \
  --name AllowAzureServices \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0
```

## Step 4: Deploy Backend API (App Services)

### Development API
```powershell
az appservice plan create \
  --name plan-appointment-dev \
  --resource-group rg-appointment-dev \
  --sku B1 \
  --is-linux

az webapp create \
  --resource-group rg-appointment-dev \
  --plan plan-appointment-dev \
  --name api-appointment-dev-[YOUR-UNIQUE-SUFFIX] \
  --runtime "DOTNET:10.0"

# Configure connection string
az webapp config connection-string set \
  --resource-group rg-appointment-dev \
  --name api-appointment-dev-[YOUR-UNIQUE-SUFFIX] \
  --settings DefaultConnection="Server=tcp:sql-appointment-dev.database.windows.net,1433;Initial Catalog=AppointmentDB;Persist Security Info=False;User ID=sqladmin;Password=YourSecurePassword123!;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;" \
  --connection-string-type SQLAzure

# Enable CORS
az webapp cors add \
  --resource-group rg-appointment-dev \
  --name api-appointment-dev-[YOUR-UNIQUE-SUFFIX] \
  --allowed-origins "*"
```

### Staging API
```powershell
az appservice plan create \
  --name plan-appointment-staging \
  --resource-group rg-appointment-staging \
  --sku B1 \
  --is-linux

az webapp create \
  --resource-group rg-appointment-staging \
  --plan plan-appointment-staging \
  --name api-appointment-staging-[YOUR-UNIQUE-SUFFIX] \
  --runtime "DOTNET:10.0"

az webapp config connection-string set \
  --resource-group rg-appointment-staging \
  --name api-appointment-staging-[YOUR-UNIQUE-SUFFIX] \
  --settings DefaultConnection="Server=tcp:sql-appointment-staging.database.windows.net,1433;Initial Catalog=AppointmentDB;Persist Security Info=False;User ID=sqladmin;Password=YourSecurePassword123!;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;" \
  --connection-string-type SQLAzure

az webapp cors add \
  --resource-group rg-appointment-staging \
  --name api-appointment-staging-[YOUR-UNIQUE-SUFFIX] \
  --allowed-origins "*"
```

### Production API
```powershell
az appservice plan create \
  --name plan-appointment-prod \
  --resource-group rg-appointment-prod \
  --sku B1 \
  --is-linux

az webapp create \
  --resource-group rg-appointment-prod \
  --plan plan-appointment-prod \
  --name api-appointment-prod-[YOUR-UNIQUE-SUFFIX] \
  --runtime "DOTNET:10.0"

az webapp config connection-string set \
  --resource-group rg-appointment-prod \
  --name api-appointment-prod-[YOUR-UNIQUE-SUFFIX] \
  --settings DefaultConnection="Server=tcp:sql-appointment-prod.database.windows.net,1433;Initial Catalog=AppointmentDB;Persist Security Info=False;User ID=sqladmin;Password=YourSecurePassword123!;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;" \
  --connection-string-type SQLAzure

az webapp cors add \
  --resource-group rg-appointment-prod \
  --name api-appointment-prod-[YOUR-UNIQUE-SUFFIX] \
  --allowed-origins "*"
```

## Step 5: Deploy Frontend (Static Web Apps)

### Development Frontend
```powershell
az staticwebapp create \
  --name swa-appointment-dev \
  --resource-group rg-appointment-dev \
  --location eastus2 \
  --source https://github.com/Sid770/smart-booking-system \
  --branch develop \
  --app-location "/" \
  --output-location "dist/hcl2/browser" \
  --login-with-github
```

### Staging Frontend
```powershell
az staticwebapp create \
  --name swa-appointment-staging \
  --resource-group rg-appointment-staging \
  --location eastus2 \
  --source https://github.com/Sid770/smart-booking-system \
  --branch staging \
  --app-location "/" \
  --output-location "dist/hcl2/browser" \
  --login-with-github
```

### Production Frontend
```powershell
az staticwebapp create \
  --name swa-appointment-prod \
  --resource-group rg-appointment-prod \
  --location eastus2 \
  --source https://github.com/Sid770/smart-booking-system \
  --branch main \
  --app-location "/" \
  --output-location "dist/hcl2/browser" \
  --login-with-github
```

## Step 6: Get Deployment Tokens

After creating static web apps, get the deployment tokens:

```powershell
# Development
az staticwebapp secrets list --name swa-appointment-dev --resource-group rg-appointment-dev --query "properties.apiKey" -o tsv

# Staging
az staticwebapp secrets list --name swa-appointment-staging --resource-group rg-appointment-staging --query "properties.apiKey" -o tsv

# Production
az staticwebapp secrets list --name swa-appointment-prod --resource-group rg-appointment-prod --query "properties.apiKey" -o tsv
```

Get backend publish profiles:

```powershell
# Development
az webapp deployment list-publishing-profiles --name api-appointment-dev-[YOUR-UNIQUE-SUFFIX] --resource-group rg-appointment-dev --xml

# Staging
az webapp deployment list-publishing-profiles --name api-appointment-staging-[YOUR-UNIQUE-SUFFIX] --resource-group rg-appointment-staging --xml

# Production
az webapp deployment list-publishing-profiles --name api-appointment-prod-[YOUR-UNIQUE-SUFFIX] --resource-group rg-appointment-prod --xml
```

## Step 7: Configure GitHub Secrets

Go to your GitHub repository settings → Secrets and Variables → Actions, and add:

### Frontend Secrets
- `AZURE_STATIC_WEB_APPS_API_TOKEN_DEV` - Token from development static web app
- `AZURE_STATIC_WEB_APPS_API_TOKEN_STAGING` - Token from staging static web app
- `AZURE_STATIC_WEB_APPS_API_TOKEN_PROD` - Token from production static web app

### Backend Secrets
- `AZURE_WEBAPP_NAME_DEV` - api-appointment-dev-[YOUR-UNIQUE-SUFFIX]
- `AZURE_WEBAPP_NAME_STAGING` - api-appointment-staging-[YOUR-UNIQUE-SUFFIX]
- `AZURE_WEBAPP_NAME_PROD` - api-appointment-prod-[YOUR-UNIQUE-SUFFIX]
- `AZURE_WEBAPP_PUBLISH_PROFILE_DEV` - XML content from dev publish profile
- `AZURE_WEBAPP_PUBLISH_PROFILE_STAGING` - XML content from staging publish profile
- `AZURE_WEBAPP_PUBLISH_PROFILE_PROD` - XML content from production publish profile

## Step 8: Update Environment Configuration

Update your environment files with actual API URLs:

**src/environments/environment.development.ts:**
```typescript
export const environment = {
  production: false,
  apiUrl: 'https://api-appointment-dev-[YOUR-UNIQUE-SUFFIX].azurewebsites.net/api',
  environmentName: 'development'
};
```

**src/environments/environment.staging.ts:**
```typescript
export const environment = {
  production: false,
  apiUrl: 'https://api-appointment-staging-[YOUR-UNIQUE-SUFFIX].azurewebsites.net/api',
  environmentName: 'staging'
};
```

**src/environments/environment.prod.ts:**
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api-appointment-prod-[YOUR-UNIQUE-SUFFIX].azurewebsites.net/api',
  environmentName: 'production'
};
```

## Step 9: Database Migration

Update backend to use SQL Server instead of SQLite:

**backend/Program.cs:**
```csharp
// Replace SQLite connection with:
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
```

**backend/AppointmentAPI.csproj:**
Add SQL Server package:
```xml
<PackageReference Include="Microsoft.EntityFrameworkCore.SqlServer" Version="10.0.0" />
```

## Step 10: Test Deployment

1. Push changes to `develop` branch:
   ```powershell
   git add .
   git commit -m "chore: configure azure deployment"
   git push origin develop
   ```

2. Check GitHub Actions for build status

3. Test development environment at the Static Web App URL

4. Repeat for staging and production branches

## Environments URLs

After deployment, your environments will be accessible at:

- **Development:**
  - Frontend: `https://swa-appointment-dev.azurestaticapps.net`
  - API: `https://api-appointment-dev-[YOUR-UNIQUE-SUFFIX].azurewebsites.net`

- **Staging:**
  - Frontend: `https://swa-appointment-staging.azurestaticapps.net`
  - API: `https://api-appointment-staging-[YOUR-UNIQUE-SUFFIX].azurewebsites.net`

- **Production:**
  - Frontend: `https://swa-appointment-prod.azurestaticapps.net`
  - API: `https://api-appointment-prod-[YOUR-UNIQUE-SUFFIX].azurewebsites.net`

## Troubleshooting

### Database Connection Issues
```powershell
# Test database connectivity
az sql server show --name sql-appointment-dev --resource-group rg-appointment-dev
```

### API Not Starting
```powershell
# Check app service logs
az webapp log tail --name api-appointment-dev-[YOUR-UNIQUE-SUFFIX] --resource-group rg-appointment-dev
```

### Static Web App Build Failures
- Check GitHub Actions logs
- Verify build configuration in workflow files
- Ensure all dependencies are in package.json

## Cost Optimization Tips

With Azure Student subscription ($100 credit):

1. Use **Free Tier** for Static Web Apps (already free)
2. Use **B1 Basic** for App Services during development
3. Use **S0 Standard** for SQL Database (cheapest option)
4. Delete development/staging resources when not in use
5. Scale up only production before demos

## Next Steps

1. ✅ Push code to GitHub
2. ⏳ Create Azure resources
3. ⏳ Configure GitHub secrets
4. ⏳ Update environment files
5. ⏳ Migrate to SQL Server
6. ⏳ Test deployments
7. ⏳ Set up custom domain (optional)
8. ⏳ Configure monitoring and alerts

## Support Resources

- [Azure Static Web Apps Docs](https://docs.microsoft.com/en-us/azure/static-web-apps/)
- [Azure App Service Docs](https://docs.microsoft.com/en-us/azure/app-service/)
- [Azure SQL Database Docs](https://docs.microsoft.com/en-us/azure/azure-sql/)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
