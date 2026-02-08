# Azure Portal Manual Deployment Guide

This guide walks you through deploying the Smart Appointment Booking System using the Azure Portal web interface (no CLI required).

> **Time Estimate**: 30-45 minutes per environment  
> **Prerequisites**: Azure Student account with active subscription

---

## 📋 Deployment Checklist

For each environment (Development, Staging, Production), you'll create:
- [ ] Resource Group
- [ ] SQL Server + SQL Database
- [ ] App Service (Backend API)
- [ ] Static Web App (Frontend)
- [ ] Configure connection strings
- [ ] Set up GitHub deployment
- [ ] Test deployment

---

## 🌐 Access Azure Portal

1. Open your browser and go to: **https://portal.azure.com**
2. Sign in with your Azure Student account
3. You'll see the Azure Portal dashboard

---

## Part 1: Create Development Environment

### Step 1: Create Resource Group

1. In Azure Portal, click **"Resource groups"** in the left sidebar (or search for it in the top search bar)
2. Click **"+ Create"** button at the top
3. Fill in the form:
   - **Subscription**: Select "Azure for Students"
   - **Resource group name**: `rg-appointment-dev`
   - **Region**: Select "East US" (or your preferred region)
4. Click **"Review + create"**
5. Click **"Create"**
6. Wait for deployment (should take ~10 seconds)

### Step 2: Create SQL Server and Database

#### Create SQL Server

1. In the search bar at the top, type **"SQL servers"** and select it
2. Click **"+ Create"** button
3. Fill in the **Basics** tab:
   - **Subscription**: Azure for Students
   - **Resource group**: `rg-appointment-dev` (select from dropdown)
   - **Server name**: `sql-appointment-dev` (must be globally unique - if taken, try `sql-appointment-dev-yourname`)
   - **Location**: East US (same as resource group)
   - **Authentication method**: Select "Use SQL authentication"
   - **Server admin login**: `sqladmin`
   - **Password**: Create a strong password (e.g., `SecurePass123!`)
   - **Confirm password**: Re-enter the same password
   
   > ⚠️ **IMPORTANT**: Save this password! You'll need it later.

4. Click **"Next: Networking"**
5. Under **Firewall rules**, check:
   - ✅ **"Allow Azure services and resources to access this server"**
6. Click **"Review + create"**
7. Click **"Create"**
8. Wait for deployment (~2-3 minutes)

#### Create SQL Database

1. Once SQL Server is created, click **"Go to resource"**
2. In the SQL Server overview page, click **"+ Create database"** at the top
3. Fill in the form:
   - **Database name**: `AppointmentDB`
   - **Want to use SQL elastic pool?**: No
   - **Compute + storage**: Click **"Configure database"**
     - Select **"Basic"** tier (cheapest option, good for development)
     - Storage: 2 GB (default)
     - Click **"Apply"**
   - **Backup storage redundancy**: Select **"Locally-redundant backup storage"** (cheapest)
4. Click **"Review + create"**
5. Click **"Create"**
6. Wait for deployment (~3-5 minutes)

#### Get Connection String

1. After database is created, click **"Go to resource"**
2. In the left sidebar, click **"Connection strings"** (under Settings)
3. Copy the **ADO.NET** connection string
4. Open Notepad and paste it
5. In the connection string, replace:
   - `{your_username}` with `sqladmin`
   - `{your_password}` with your actual password (the one you created earlier)
6. Save this connection string - you'll need it soon!

### Step 3: Create App Service (Backend API)

#### Create App Service Plan

1. In the search bar, type **"App Service plans"** and select it
2. Click **"+ Create"**
3. Fill in the form:
   - **Subscription**: Azure for Students
   - **Resource group**: `rg-appointment-dev`
   - **Name**: `plan-appointment-dev`
   - **Operating System**: Linux
   - **Region**: East US
   - **Pricing tier**: Click **"Explore pricing plans"**
     - Select **"Dev/Test"** tab
     - Choose **"B1"** (Basic - $13.14/month)
     - Click **"Select"**
4. Click **"Review + create"**
5. Click **"Create"**

#### Create App Service (Web App)

1. In the search bar, type **"App Services"** and select it
2. Click **"+ Create"** → **"Web App"**
3. Fill in the **Basics** tab:
   - **Subscription**: Azure for Students
   - **Resource group**: `rg-appointment-dev`
   - **Name**: `api-appointment-dev-yourname` (replace `yourname` with your initials or unique identifier)
   - **Publish**: Code
   - **Runtime stack**: .NET 9 (or .NET 8 if 9 isn't available)
   - **Operating System**: Linux
   - **Region**: East US
   - **App Service Plan**: Select `plan-appointment-dev` (the one you just created)
4. Click **"Next: Database"** - Skip this
5. Click **"Next: Deployment"** 
   - **GitHub Actions settings**: Enable (toggle ON)
   - Click **"Sign in to GitHub"** and authorize Azure
   - **Organization**: Select your GitHub username
   - **Repository**: Select `smart-booking-system`
   - **Branch**: Select `develop`
6. Click **"Review + create"**
7. Click **"Create"**
8. Wait for deployment (~2-3 minutes)

#### Configure App Service Settings

1. After deployment, click **"Go to resource"**
2. In the left sidebar, click **"Environment variables"** (under Settings)
3. Click **"+ Add"** to add a new connection string:
   - **Name**: `DefaultConnection`
   - **Value**: Paste your SQL connection string from Notepad
   - **Type**: Select **"SQLAzure"**
   - Click **"Apply"**
4. Click **"Save"** at the top
5. Click **"Continue"** to confirm

#### Configure CORS

1. Still in your App Service, in the left sidebar click **"CORS"** (under API section)
2. In the **Allowed Origins** field, add:
   ```
   *
   ```
   (This allows all origins - for production, use your actual frontend URL)
3. Click **"Save"** at the top

#### Get App Service URL

1. In the App Service Overview page, look for **"Default domain"**
2. Copy this URL (e.g., `https://api-appointment-dev-yourname.azurewebsites.net`)
3. Save this URL - you'll need it for the frontend configuration

### Step 4: Create Static Web App (Frontend)

1. In the search bar, type **"Static Web Apps"** and select it
2. Click **"+ Create"**
3. Fill in the **Basics** tab:
   - **Subscription**: Azure for Students
   - **Resource group**: `rg-appointment-dev`
   - **Name**: `swa-appointment-dev`
   - **Plan type**: **Free**
   - **Region**: East US 2
   - **Source**: GitHub
   - Click **"Sign in with GitHub"** (if not already signed in)
   - **Organization**: Your GitHub username
   - **Repository**: `smart-booking-system`
   - **Branch**: `develop`
4. Fill in the **Build Details**:
   - **Build Presets**: Select **"Angular"**
   - **App location**: `/` (root)
   - **Api location**: Leave empty
   - **Output location**: `dist/hcl2/browser`
5. Click **"Review + create"**
6. Click **"Create"**
7. Wait for deployment (~3-5 minutes)

#### Get Static Web App Deployment Token

1. After creation, click **"Go to resource"**
2. In the left sidebar, click **"Deployment token"** (under Settings)
3. Click the **"Copy"** button to copy the token
4. Save this token - you'll use it in GitHub Secrets

#### Get Static Web App URL

1. In the Overview page, look for **"URL"**
2. Copy this URL (e.g., `https://happy-sea-123456.azurestaticapps.net`)
3. This is where your frontend will be accessible

---

## Part 2: Configure GitHub Secrets

Now we need to add the deployment credentials to GitHub so the CI/CD pipeline can deploy automatically.

### Add GitHub Secrets

1. Go to your GitHub repository: **https://github.com/Sid770/smart-booking-system**
2. Click **"Settings"** tab (top of repository)
3. In the left sidebar, expand **"Secrets and variables"** → click **"Actions"**
4. Click **"New repository secret"** button

#### Add Development Secrets

Add these secrets one by one:

**Secret 1: Static Web App Token (Development)**
- Name: `AZURE_STATIC_WEB_APPS_API_TOKEN_DEV`
- Value: Paste the deployment token you copied from the Static Web App
- Click **"Add secret"**

**Secret 2: App Service Name (Development)**
- Name: `AZURE_WEBAPP_NAME_DEV`
- Value: `api-appointment-dev-yourname` (your actual App Service name)
- Click **"Add secret"**

**Secret 3: App Service Publish Profile (Development)**
- Name: `AZURE_WEBAPP_PUBLISH_PROFILE_DEV`
- To get the value:
  1. Go back to Azure Portal
  2. Navigate to your App Service (`api-appointment-dev-yourname`)
  3. Click **"Download publish profile"** button at the top
  4. Open the downloaded `.PublishSettings` file in Notepad
  5. Copy the ENTIRE contents of the file
  6. Paste it as the secret value
- Click **"Add secret"**

---

## Part 3: Update Frontend Environment Configuration

Now update your frontend to point to the actual Azure backend API.

### Update Environment File

1. In VS Code, open: `src/environments/environment.development.ts`
2. Replace `localhost:5050` with your actual API URL:

```typescript
export const environment = {
  production: false,
  apiUrl: 'https://api-appointment-dev-yourname.azurewebsites.net/api',
  environmentName: 'development'
};
```

3. **Important**: Replace `api-appointment-dev-yourname` with YOUR actual App Service name
4. Save the file

### Update CORS in Backend

1. Open: `backend/Program.cs`
2. Find the CORS configuration section
3. Add your Static Web App URL to allowed origins:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.WithOrigins(
            "http://localhost:4200",
            "https://happy-sea-123456.azurestaticapps.net" // Add your actual Static Web App URL
        )
        .AllowAnyMethod()
        .AllowAnyHeader();
    });
});
```

4. Save the file

---

## Part 4: Deploy and Test

### Commit and Push Changes

1. Open terminal in VS Code
2. Run:

```bash
git add .
git commit -m "chore: configure development environment with Azure URLs"
git push origin develop
```

### Monitor Deployment

1. Go to: **https://github.com/Sid770/smart-booking-system/actions**
2. You should see two workflow runs starting:
   - **Azure Static Web Apps CI/CD** (Frontend)
   - **Backend API - Build and Deploy** (Backend)
3. Click on each one to watch the progress
4. Wait for both to complete (green checkmark ✓)

### Test Your Deployment

1. **Test Backend API**:
   - Go to: `https://api-appointment-dev-yourname.azurewebsites.net`
   - You should see the Swagger UI

2. **Test Frontend**:
   - Go to your Static Web App URL (e.g., `https://happy-sea-123456.azurestaticapps.net`)
   - The app should load
   - Try browsing available slots
   - Try booking an appointment

---

## Part 5: Create Staging Environment

Repeat all steps above, but change:
- Resource group name: `rg-appointment-staging`
- SQL Server name: `sql-appointment-staging`
- App Service name: `api-appointment-staging-yourname`
- Static Web App name: `swa-appointment-staging`
- GitHub branch: Select `staging`
- GitHub Secrets suffix: `_STAGING` instead of `_DEV`
- Update `src/environments/environment.staging.ts` with staging URLs

---

## Part 6: Create Production Environment

Repeat all steps again, but change:
- Resource group name: `rg-appointment-prod`
- SQL Server name: `sql-appointment-prod`
- App Service name: `api-appointment-prod-yourname`
- Static Web App name: `swa-appointment-prod`
- GitHub branch: Select `main`
- GitHub Secrets suffix: `_PROD` instead of `_DEV`
- Update `src/environments/environment.prod.ts` with production URLs
- **Consider using Standard S0 tier** for SQL Database in production

---

## 📊 Resource Summary After Completion

You should have created:

### Development Environment
- ✅ Resource Group: `rg-appointment-dev`
- ✅ SQL Server: `sql-appointment-dev`
- ✅ SQL Database: `AppointmentDB` (Basic tier)
- ✅ App Service Plan: `plan-appointment-dev` (B1)
- ✅ App Service: `api-appointment-dev-yourname`
- ✅ Static Web App: `swa-appointment-dev` (Free)

### Staging Environment
- ✅ Resource Group: `rg-appointment-staging`
- ✅ SQL Server: `sql-appointment-staging`
- ✅ SQL Database: `AppointmentDB` (Basic tier)
- ✅ App Service Plan: `plan-appointment-staging` (B1)
- ✅ App Service: `api-appointment-staging-yourname`
- ✅ Static Web App: `swa-appointment-staging` (Free)

### Production Environment
- ✅ Resource Group: `rg-appointment-prod`
- ✅ SQL Server: `sql-appointment-prod`
- ✅ SQL Database: `AppointmentDB` (Standard S0)
- ✅ App Service Plan: `plan-appointment-prod` (B1 or higher)
- ✅ App Service: `api-appointment-prod-yourname`
- ✅ Static Web App: `swa-appointment-prod` (Free)

**Total GitHub Secrets**: 9 (3 per environment)

---

## 🔍 Troubleshooting

### Database Connection Fails

1. Go to SQL Server → **Networking** (under Security)
2. Make sure **"Allow Azure services and resources to access this server"** is ON
3. Add your client IP if testing locally:
   - Click **"+ Add client IP"**
   - Click **"Save"**

### App Service Shows Error

1. Go to App Service → **Log stream** (under Monitoring)
2. Watch real-time logs to see errors
3. Check environment variables are set correctly in **Configuration**

### Static Web App Not Loading

1. Go to Static Web App → **Deployment History** (under Deployment)
2. Check if the build succeeded
3. Click on a deployment to see build logs
4. Common issue: Check output location is `dist/hcl2/browser`

### CORS Errors in Browser

1. Open browser Developer Tools (F12)
2. Check the exact error message
3. Make sure Static Web App URL is added to CORS in backend
4. Redeploy backend after adding CORS origins

---

## 💡 Cost Optimization Tips

### Development Environment
- Use **Basic** tier for SQL Database ($4.90/month)
- Use **B1** tier for App Service ($13.14/month)
- Static Web Apps are **Free**

### Shut Down When Not Using
To save credits:
1. Go to each Resource Group
2. Click **"Stop"** on expensive resources:
   - App Services (can be stopped)
   - SQL Databases (can scale down to Basic when not in use)

### Delete Development/Staging When Demoing
Before final hackathon presentation:
1. Keep only Production running
2. Delete dev and staging resource groups
3. Re-create them later if needed

---

## 🎯 Next Steps

1. ✅ Test all three environments
2. ✅ Verify GitHub Actions deployments work
3. ✅ Test booking flow end-to-end
4. ✅ Prepare demo with production environment
5. ✅ Document any custom configurations

---

## 📚 Additional Resources

- **Azure Portal**: https://portal.azure.com
- **Azure Documentation**: https://docs.microsoft.com/azure
- **Static Web Apps Docs**: https://docs.microsoft.com/azure/static-web-apps/
- **App Service Docs**: https://docs.microsoft.com/azure/app-service/
- **Azure SQL Docs**: https://docs.microsoft.com/azure/azure-sql/

---

## 🆘 Need Help?

- **Azure Support**: In Azure Portal, click "?" icon → "Help + support"
- **GitHub Issues**: https://github.com/Sid770/smart-booking-system/issues
- **Azure Student Support**: https://azure.microsoft.com/support/students/

---

**Time to complete**: ~2-3 hours for all three environments

Good luck with your deployment! 🚀
