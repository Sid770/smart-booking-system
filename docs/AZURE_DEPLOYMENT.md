# Azure Deployment Guide - Smart Appointment Booking System

## 🎓 Azure for Students

This guide is optimized for **Azure for Students** which provides:
- $100 free credit
- Free services for 12 months
- No credit card required (with student verification)

**Apply here**: https://azure.microsoft.com/free/students/

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Architecture Overview](#architecture-overview)
3. [Step-by-Step Deployment](#step-by-step-deployment)
4. [CI/CD Setup](#cicd-setup)
5. [Configuration](#configuration)
6. [Testing](#testing)
7. [Monitoring](#monitoring)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Accounts
- ✅ Azure for Students account
- ✅ GitHub account
- ✅ VS Code with Azure extensions

### Required Tools
- ✅ Azure CLI (`az`)
- ✅ .NET SDK 10.0+
- ✅ Node.js 20+
- ✅ Git

### Install Azure CLI
```bash
# Windows (PowerShell)
winget install -e --id Microsoft.AzureCLI

# Or download from: https://aka.ms/installazurecliwindows
```

### Login to Azure
```bash
az login
az account show
```

---

## Architecture Overview

### Azure Resources

```
┌─────────────────────────────────────────────────┐
│                Azure Cloud                      │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌─────────────────┐   ┌──────────────────┐    │
│  │  Static Web App │   │  App Service     │    │
│  │   (Frontend)    │──▶│  (Backend API)   │    │
│  │   Angular       │   │   .NET 10        │    │
│  └─────────────────┘   └──────────────────┘    │
│           │                      │              │
│           │                      ▼              │
│           │            ┌──────────────────┐    │
│           │            │  Azure SQL DB    │    │
│           │            │  (Production)    │    │
│           │            └──────────────────┘    │
│           │                                     │
│           ▼                                     │
│  ┌─────────────────┐                           │
│  │  Application    │                           │
│  │  Insights       │                           │
│  │  (Monitoring)   │                           │
│  └─────────────────┘                           │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Services Used

| Service | Purpose | Free Tier |
|---------|---------|-----------|
| **Static Web Apps** | Host Angular frontend | ✅ Free |
| **App Service** | Host .NET API | ✅ F1 (Free) |
| **Azure SQL Database** | Production database | ✅ Free (with student) |
| **Application Insights** | Monitoring & logging | ✅ First 5GB free |
| **Azure DevOps** | CI/CD (alternative) | ✅ Free tier |

---

## Step-by-Step Deployment

### Step 1: Create Resource Group

```bash
# Create a resource group
az group create \
  --name rg-appointment-booking \
  --location eastus

# Verify
az group show --name rg-appointment-booking
```

---

### Step 2: Deploy Frontend (Static Web App)

#### Option A: Via Azure Portal

1. **Navigate to Azure Portal**
   - Go to https://portal.azure.com
   - Click **Create a resource**
   - Search for **Static Web App**

2. **Configure Static Web App**
   - **Subscription**: Azure for Students
   - **Resource Group**: rg-appointment-booking
   - **Name**: appointment-booking-frontend
   - **Plan type**: Free
   - **Region**: East US
   - **Source**: GitHub
   - **GitHub Account**: Authorize and select your repo
   - **Organization**: Sid770
   - **Repository**: smart-appointment-booking
   - **Branch**: main
   - **Build Presets**: Angular
   - **App location**: /
   - **Output location**: dist/hcl2/browser

3. **Review and Create**

#### Option B: Via Azure CLI

```bash
# Install Static Web Apps CLI
npm install -g @azure/static-web-apps-cli

# Build the app
npm run build

# Create Static Web App
az staticwebapp create \
  --name appointment-booking-frontend \
  --resource-group rg-appointment-booking \
  --source https://github.com/Sid770/smart-appointment-booking \
  --location eastus \
  --branch main \
  --app-location "/" \
  --output-location "dist/hcl2/browser" \
  --login-with-github
```

**Get the URL:**
```bash
az staticwebapp show \
  --name appointment-booking-frontend \
  --resource-group rg-appointment-booking \
  --query "defaultHostname" -o tsv
```

---

### Step 3: Deploy Backend (App Service)

#### Create App Service Plan (Free Tier)

```bash
# Create App Service Plan
az appservice plan create \
  --name asp-appointment-booking \
  --resource-group rg-appointment-booking \
  --sku F1 \
  --is-linux

# For better performance (not free):
# --sku B1  # Basic tier ($13/month)
```

#### Create Web App

```bash
# Create Web App
az webapp create \
  --name appointment-booking-api \
  --resource-group rg-appointment-booking \
  --plan asp-appointment-booking \
  --runtime "DOTNET|10.0"

# Configure for .NET 10
az webapp config set \
  --name appointment-booking-api \
  --resource-group rg-appointment-booking \
  --linux-fx-version "DOTNETCORE|10.0"
```

#### Configure CORS

```bash
# Allow frontend to access backend
az webapp cors add \
  --name appointment-booking-api \
  --resource-group rg-appointment-booking \
  --allowed-origins "https://appointment-booking-frontend.azurestaticapps.net"

# For local testing, also add:
az webapp cors add \
  --name appointment-booking-api \
  --resource-group rg-appointment-booking \
  --allowed-origins "http://localhost:4200"
```

#### Deploy Backend Code

```bash
# Navigate to backend folder
cd backend

# Build and publish
dotnet publish -c Release -o ./publish

# Create deployment package
cd publish
zip -r ../deploy.zip .
cd ..

# Deploy to Azure
az webapp deployment source config-zip \
  --name appointment-booking-api \
  --resource-group rg-appointment-booking \
  --src deploy.zip
```

**Get Backend URL:**
```bash
az webapp show \
  --name appointment-booking-api \
  --resource-group rg-appointment-booking \
  --query "defaultHostName" -o tsv
```

---

### Step 4: Create Azure SQL Database

#### Create SQL Server

```bash
# Create SQL Server
az sql server create \
  --name appointment-booking-sql \
  --resource-group rg-appointment-booking \
  --location eastus \
  --admin-user sqladmin \
  --admin-password "YourStrong!Password123"

# Allow Azure services to access
az sql server firewall-rule create \
  --name AllowAzureServices \
  --resource-group rg-appointment-booking \
  --server appointment-booking-sql \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0

# Allow your IP (for management)
az sql server firewall-rule create \
  --name AllowMyIP \
  --resource-group rg-appointment-booking \
  --server appointment-booking-sql \
  --start-ip-address <YOUR_IP> \
  --end-ip-address <YOUR_IP>
```

#### Create SQL Database (Free Tier)

```bash
# Create database (Basic tier - included in student subscription)
az sql db create \
  --name AppointmentDB \
  --resource-group rg-appointment-booking \
  --server appointment-booking-sql \
  --service-objective Basic \
  --max-size 2GB
```

#### Get Connection String

```bash
az sql db show-connection-string \
  --client ado.net \
  --name AppointmentDB \
  --server appointment-booking-sql
```

**Update** `backend/appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=tcp:appointment-booking-sql.database.windows.net,1433;Initial Catalog=AppointmentDB;Persist Security Info=False;User ID=sqladmin;Password=YourStrong!Password123;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"
  }
}
```

#### Configure Backend Connection String

```bash
az webapp config connection-string set \
  --name appointment-booking-api \
  --resource-group rg-appointment-booking \
  --connection-string-type SQLAzure \
  --settings DefaultConnection="Server=tcp:appointment-booking-sql.database.windows.net,1433;Initial Catalog=AppointmentDB;Persist Security Info=False;User ID=sqladmin;Password=YourStrong!Password123;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"
```

#### Run Database Migrations

```bash
# Install EF Core tools if not already installed
dotnet tool install --global dotnet-ef

# Create migration
cd backend
dotnet ef migrations add AzureInitial

# Update database
dotnet ef database update --connection "Server=tcp:appointment-booking-sql.database.windows.net,1433;Initial Catalog=AppointmentDB;Persist Security Info=False;User ID=sqladmin;Password=YourStrong!Password123;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"
```

---

### Step 5: Configure Environment Variables

#### Backend App Settings

```bash
# Set environment
az webapp config appsettings set \
  --name appointment-booking-api \
  --resource-group rg-appointment-booking \
  --settings \
    ASPNETCORE_ENVIRONMENT="Production" \
    AllowedOrigins="https://appointment-booking-frontend.azurestaticapps.net"
```

#### Frontend Environment

Update `src/environments/environment.prod.ts`:
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://appointment-booking-api.azurewebsites.net/api'
};
```

---

## CI/CD Setup

### Step 1: Configure GitHub Secrets

Navigate to your repo: `https://github.com/Sid770/smart-appointment-booking/settings/secrets/actions`

Add these secrets:

#### Required Secrets

1. **AZURE_STATIC_WEB_APPS_API_TOKEN_DEV**
   ```bash
   az staticwebapp secrets list \
     --name appointment-booking-frontend-dev \
     --resource-group rg-appointment-booking \
     --query "properties.apiKey" -o tsv
   ```

2. **AZURE_STATIC_WEB_APPS_API_TOKEN_STAGING**
   ```bash
   az staticwebapp secrets list \
     --name appointment-booking-frontend-staging \
     --resource-group rg-appointment-booking \
     --query "properties.apiKey" -o tsv
   ```

3. **AZURE_STATIC_WEB_APPS_API_TOKEN_PROD**
   ```bash
   az staticwebapp secrets list \
     --name appointment-booking-frontend \
     --resource-group rg-appointment-booking \
     --query "properties.apiKey" -o tsv
   ```

4. **AZURE_WEBAPP_PUBLISH_PROFILE_DEV**
   ```bash
   az webapp deployment list-publishing-profiles \
     --name appointment-booking-api-dev \
     --resource-group rg-appointment-booking \
     --xml
   ```

5. **AZURE_WEBAPP_PUBLISH_PROFILE_STAGING**
   ```bash
   az webapp deployment list-publishing-profiles \
     --name appointment-booking-api-staging \
     --resource-group rg-appointment-booking \
     --xml
   ```

6. **AZURE_WEBAPP_PUBLISH_PROFILE_PROD**
   ```bash
   az webapp deployment list-publishing-profiles \
     --name appointment-booking-api \
     --resource-group rg-appointment-booking \
     --xml
   ```

### Step 2: Create Branches

```bash
# Create development branch
git checkout -b develop
git push origin develop

# Create staging branch
git checkout -b staging
git push origin staging

# Back to main
git checkout main
```

### Step 3: Test Pipeline

```bash
# Push to trigger development pipeline
git checkout develop
git commit --allow-empty -m "Test dev pipeline"
git push origin develop

# Check GitHub Actions
# https://github.com/Sid770/smart-appointment-booking/actions
```

---

## Configuration

### Update Frontend API URL

Create environment files:

**src/environments/environment.ts** (Development):
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5050/api'
};
```

**src/environments/environment.prod.ts** (Production):
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://appointment-booking-api.azurewebsites.net/api'
};
```

**Update** `src/app/services/appointment.service.ts`:
```typescript
import { environment } from '../../environments/environment';

// Replace hardcoded URL with:
private apiUrl = environment.apiUrl;
```

### Update Backend CORS

**backend/Program.cs**:
```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp", policy =>
    {
        var allowedOrigins = builder.Configuration["AllowedOrigins"]?.Split(',') 
            ?? new[] { "http://localhost:4200" };
        
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});
```

---

## Testing

### Test Frontend
```bash
# Get your frontend URL
echo "https://appointment-booking-frontend.azurestaticapps.net"

# Or via CLI
az staticwebapp show \
  --name appointment-booking-frontend \
  --resource-group rg-appointment-booking \
  --query "defaultHostname" -o tsv
```

### Test Backend API
```bash
# Get your backend URL
BACKEND_URL=$(az webapp show \
  --name appointment-booking-api \
  --resource-group rg-appointment-booking \
  --query "defaultHostName" -o tsv)

# Test API
curl "https://${BACKEND_URL}/api/providers"

# Test Swagger
echo "https://${BACKEND_URL}"
```

### Test Database Connection
```bash
# Check backend logs
az webapp log tail \
  --name appointment-booking-api \
  --resource-group rg-appointment-booking
```

---

## Monitoring

### Enable Application Insights

```bash
# Create Application Insights
az monitor app-insights component create \
  --app appointment-booking-insights \
  --location eastus \
  --resource-group rg-appointment-booking \
  --application-type web

# Get instrumentation key
INSTRUMENTATION_KEY=$(az monitor app-insights component show \
  --app appointment-booking-insights \
  --resource-group rg-appointment-booking \
  --query "instrumentationKey" -o tsv)

# Configure backend
az webapp config appsettings set \
  --name appointment-booking-api \
  --resource-group rg-appointment-booking \
  --settings APPLICATIONINSIGHTS_CONNECTION_STRING="InstrumentationKey=${INSTRUMENTATION_KEY}"
```

### View Logs

```bash
# Stream logs in real-time
az webapp log tail \
  --name appointment-booking-api \
  --resource-group rg-appointment-booking

# Download logs
az webapp log download \
  --name appointment-booking-api \
  --resource-group rg-appointment-booking \
  --log-file logs.zip
```

---

## Troubleshooting

### Common Issues

#### Issue: 502 Bad Gateway
**Solution:**
```bash
# Restart the app service
az webapp restart \
  --name appointment-booking-api \
  --resource-group rg-appointment-booking

# Check logs
az webapp log tail \
  --name appointment-booking-api \
  --resource-group rg-appointment-booking
```

#### Issue: CORS Errors
**Solution:**
```bash
# Verify CORS settings
az webapp cors show \
  --name appointment-booking-api \
  --resource-group rg-appointment-booking

# Update CORS
az webapp cors add \
  --name appointment-booking-api \
  --resource-group rg-appointment-booking \
  --allowed-origins "https://your-frontend-url.azurestaticapps.net"
```

#### Issue: Database Connection Failed
**Solution:**
```bash
# Check firewall rules
az sql server firewall-rule list \
  --resource-group rg-appointment-booking \
  --server appointment-booking-sql

# Test connection string
az webapp config connection-string list \
  --name appointment-booking-api \
  --resource-group rg-appointment-booking
```

---

## Cost Optimization

### Free Tier Usage

| Resource | Free Tier Limit | Monthly Cost |
|----------|----------------|--------------|
| Static Web App | 100GB bandwidth | $0 |
| App Service F1 | 60 CPU minutes/day | $0 |
| Azure SQL Basic | 2GB storage | $0 (student) |
| App Insights | 5GB data/month | $0 |

### Tips
- Use **F1** plan for App Service (free)
- Use **Basic** tier for SQL DB (included with student subscription)
- Monitor usage in Azure Cost Management
- Set budget alerts

---

## Useful Commands

```bash
# View all resources
az resource list \
  --resource-group rg-appointment-booking \
  --output table

# Stop all services (save money)
az webapp stop --name appointment-booking-api --resource-group rg-appointment-booking

# Start services
az webapp start --name appointment-booking-api --resource-group rg-appointment-booking

# Delete everything
az group delete --name rg-appointment-booking --yes --no-wait
```

---

## Additional Resources

- **Azure for Students**: https://azure.microsoft.com/free/students/
- **Azure Documentation**: https://docs.microsoft.com/azure/
- **Azure CLI Reference**: https://docs.microsoft.com/cli/azure/
- **Static Web Apps Docs**: https://docs.microsoft.com/azure/static-web-apps/
- **App Service Docs**: https://docs.microsoft.com/azure/app-service/

---

## Support

For issues specific to Azure deployment:
- Check Azure Portal for resource status
- Review Application Insights for errors
- Check GitHub Actions workflow logs
- Review backend logs via Azure CLI

---

**🎉 Congratulations! Your app is now live on Azure!**
