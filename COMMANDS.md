# 🚀 Quick Command Reference

## Step 1: Push to GitHub (Required)

```powershell
# Add remote (replace Sid770 with your username if different)
git remote add origin https://github.com/Sid770/smart-appointment-booking.git

# Push all branches
git push -u origin main
git push -u origin develop
git push -u origin staging
```

**Repository URL**: https://github.com/Sid770/smart-appointment-booking

---

## Step 2: Run Locally (Optional - Testing)

### Terminal 1 - Backend
```powershell
cd backend
dotnet run
```
**Visit**: http://localhost:5050 (Swagger)

### Terminal 2 - Frontend
```powershell
npm start
```
**Visit**: http://localhost:4200 (App)

---

## Step 3: Deploy to Azure (Required for Hackathon)

### Option A: Using Script (Recommended)
```powershell
.\deploy-azure.ps1
```

### Option B: Manual (Follow guide)
See: `docs\AZURE_DEPLOYMENT.md`

---

## Step 4: Configure CI/CD

### Get Azure Secrets

**Frontend token (Static Web App)**:
```powershell
az staticwebapp secrets list `
  --name appointment-booking-frontend `
  --resource-group rg-appointment-booking `
  --query "properties.apiKey" -o tsv
```

**Backend profile (App Service)**:
```powershell
az webapp deployment list-publishing-profiles `
  --name appointment-booking-api `
  --resource-group rg-appointment-booking `
  --xml
```

### Add to GitHub
1. Go to: https://github.com/Sid770/smart-appointment-booking/settings/secrets/actions
2. Click "New repository secret"
3. Add each secret from Step 4
4. See `docs\AZURE_DEPLOYMENT.md` for all secret names

---

## Useful Commands

### Check Application Status
```powershell
# Backend running?
Test-NetConnection -ComputerName localhost -Port 5050

# Frontend running?
Test-NetConnection -ComputerName localhost -Port 4200
```

### View Logs
```powershell
# Backend logs
cd backend
dotnet run --verbosity detailed

# Azure logs
az webapp log tail --name appointment-booking-api --resource-group rg-appointment-booking
```

### Restart Services
```powershell
# Kill frontend
netstat -ano | findstr :4200
taskkill /PID <PID> /F

# Kill backend
netstat -ano | findstr :5050
taskkill /PID <PID> /F

# Restart Azure Web App
az webapp restart --name appointment-booking-api --resource-group rg-appointment-booking
```

### Database Commands
```powershell
# Reset local database
cd backend
Remove-Item appointments.db -ErrorAction SilentlyContinue
dotnet run

# Run migrations (Azure)
dotnet ef database update --connection "YourAzureConnectionString"
```

### Git Commands
```powershell
# Check status
git status

# Create feature branch
git checkout -b feature/new-feature

# Push changes
git add .
git commit -m "feat: description"
git push origin feature/new-feature

# Merge to develop (triggers dev deployment)
git checkout develop
git merge feature/new-feature
git push origin develop
```

---

## Important URLs

### Local Development
- Frontend: http://localhost:4200
- Backend API: http://localhost:5050/api
- Swagger: http://localhost:5050

### GitHub
- Repository: https://github.com/Sid770/smart-appointment-booking
- Actions: https://github.com/Sid770/smart-appointment-booking/actions
- Settings: https://github.com/Sid770/smart-appointment-booking/settings

### Azure Portal
- Portal: https://portal.azure.com
- Resource Group: Search for "rg-appointment-booking"
- Static Web Apps: Azure service for frontend
- App Services: Azure service for backend
- SQL Databases: Azure service for database

### Documentation
- Main README: README.md
- Quick Start: QUICKSTART.md
- Full Guide: docs\GETTING_STARTED.md
- API Docs: docs\API_DOCUMENTATION.md
- Azure Guide: docs\AZURE_DEPLOYMENT.md
- Hackathon: HACKATHON_GUIDE.md

---

## Troubleshooting Quick Fixes

### Port in Use
```powershell
Get-Process -Id (Get-NetTCPConnection -LocalPort 4200).OwningProcess | Stop-Process -Force
Get-Process -Id (Get-NetTCPConnection -LocalPort 5050).OwningProcess | Stop-Process -Force
```

### Git Push Failed
```powershell
git remote -v  # Check remote URL
git remote set-url origin https://github.com/Sid770/smart-appointment-booking.git
git push -u origin main --force  # ⚠️ Use with caution
```

### CORS Error
Check `backend\Program.cs` - Update AllowedOrigins with your Azure frontend URL

### Database Error
```powershell
cd backend
Remove-Item *.db*
dotnet clean
dotnet build
dotnet run
```

---

## Environment Variables

### Frontend (src\environments\environment.prod.ts)
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://appointment-booking-api.azurewebsites.net/api'
};
```

### Backend (Azure App Settings)
```
ASPNETCORE_ENVIRONMENT=Production
AllowedOrigins=https://appointment-booking-frontend.azurestaticapps.net
ConnectionStrings__DefaultConnection=[Your Azure SQL connection string]
```

---

## CI/CD Workflow

### Development
```
Push to 'develop' branch → Auto-build → Auto-deploy to Dev environment
```

### Staging
```
Push to 'staging' branch → Auto-build → Run tests → Auto-deploy to Staging
```

### Production
```
Push to 'main' branch → Auto-build → Run tests → Wait for approval → Deploy to Production
```

---

## Health Checks

### Local
```powershell
# Backend
Invoke-RestMethod http://localhost:5050/health

# Frontend
Invoke-RestMethod http://localhost:4200
```

### Azure
```powershell
# Backend
Invoke-RestMethod https://appointment-booking-api.azurewebsites.net/health

# Frontend
Invoke-RestMethod https://appointment-booking-frontend.azurestaticapps.net
```

---

## Emergency Commands

### Delete Everything (Start Fresh)
```powershell
# ⚠️ WARNING: This deletes all Azure resources
az group delete --name rg-appointment-booking --yes --no-wait

# Reset local Git
Remove-Item -Recurse -Force .git
git init
git add .
git commit -m "Initial commit"
```

### Rollback Production
```powershell
# Via Azure Portal
# Go to App Service → Deployment Center → Rollback

# Via CLI
az webapp deployment slot swap --name appointment-booking-api --resource-group rg-appointment-booking --slot staging
```

---

## Support

For detailed guides, see:
- `PROJECT_SUMMARY.md` - Complete overview
- `HACKATHON_GUIDE.md` - Presentation tips
- `docs\` folder - All documentation

---

**Keep this file handy during development and deployment!** 📌
