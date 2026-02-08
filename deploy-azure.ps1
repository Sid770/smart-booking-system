# Deploy to Azure Script

Write-Host "🚀 Deploying Smart Appointment Booking System to Azure" -ForegroundColor Cyan
Write-Host ""

# Configuration
$RESOURCE_GROUP = "rg-appointment-booking"
$LOCATION = "eastus"
$FRONTEND_NAME = "appointment-booking-frontend"
$BACKEND_NAME = "appointment-booking-api"
$SQL_SERVER = "appointment-booking-sql"
$SQL_DB = "AppointmentDB"
$SQL_ADMIN = "sqladmin"

Write-Host "📋 Configuration:" -ForegroundColor Yellow
Write-Host "  Resource Group: $RESOURCE_GROUP"
Write-Host "  Location: $LOCATION"
Write-Host "  Frontend: $FRONTEND_NAME"
Write-Host "  Backend: $BACKEND_NAME"
Write-Host ""

# Check if Azure CLI is installed
Write-Host "🔍 Checking Azure CLI..." -ForegroundColor Yellow
$azVersion = az version --query '"azure-cli"' -o tsv 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Azure CLI not found. Please install it from: https://aka.ms/installazurecliwindows" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Azure CLI version: $azVersion" -ForegroundColor Green
Write-Host ""

# Login check
Write-Host "🔐 Checking Azure login status..." -ForegroundColor Yellow
$account = az account show 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Please login to Azure..." -ForegroundColor Yellow
    az login
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Azure login failed" -ForegroundColor Red
        exit 1
    }
}
$accountName = az account show --query "name" -o tsv
Write-Host "✅ Logged in as: $accountName" -ForegroundColor Green
Write-Host ""

# Create Resource Group
Write-Host "📦 Creating Resource Group..." -ForegroundColor Yellow
az group create --name $RESOURCE_GROUP --location $LOCATION --output none
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Resource Group created" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to create Resource Group" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Create SQL Server
Write-Host "🗄️ Creating SQL Server..." -ForegroundColor Yellow
$sqlPassword = Read-Host "Enter SQL Admin Password" -AsSecureString
$sqlPasswordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($sqlPassword))

az sql server create `
    --name $SQL_SERVER `
    --resource-group $RESOURCE_GROUP `
    --location $LOCATION `
    --admin-user $SQL_ADMIN `
    --admin-password $sqlPasswordPlain `
    --output none

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ SQL Server created" -ForegroundColor Green
} else {
    Write-Host "⚠️ SQL Server might already exist or creation failed" -ForegroundColor Yellow
}

# Configure Firewall
Write-Host "🔥 Configuring SQL Server Firewall..." -ForegroundColor Yellow
az sql server firewall-rule create `
    --name AllowAzureServices `
    --resource-group $RESOURCE_GROUP `
    --server $SQL_SERVER `
    --start-ip-address 0.0.0.0 `
    --end-ip-address 0.0.0.0 `
    --output none

Write-Host "✅ Firewall rules configured" -ForegroundColor Green

# Create SQL Database
Write-Host "💾 Creating SQL Database..." -ForegroundColor Yellow
az sql db create `
    --name $SQL_DB `
    --resource-group $RESOURCE_GROUP `
    --server $SQL_SERVER `
    --service-objective Basic `
    --max-size 2GB `
    --output none

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ SQL Database created" -ForegroundColor Green
} else {
    Write-Host "⚠️ Database might already exist" -ForegroundColor Yellow
}
Write-Host ""

# Create App Service Plan
Write-Host "🏗️ Creating App Service Plan..." -ForegroundColor Yellow
az appservice plan create `
    --name "asp-$BACKEND_NAME" `
    --resource-group $RESOURCE_GROUP `
    --sku B1 `
    --is-linux `
    --output none

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ App Service Plan created" -ForegroundColor Green
} else {
    Write-Host "⚠️ App Service Plan might already exist" -ForegroundColor Yellow
}

# Create Web App
Write-Host "🌐 Creating Web App..." -ForegroundColor Yellow
az webapp create `
    --name $BACKEND_NAME `
    --resource-group $RESOURCE_GROUP `
    --plan "asp-$BACKEND_NAME" `
    --runtime "DOTNET:10" `
    --output none

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Web App created" -ForegroundColor Green
} else {
    Write-Host "⚠️ Web App might already exist" -ForegroundColor Yellow
}
Write-Host ""

# Build Backend
Write-Host "🔨 Building Backend..." -ForegroundColor Yellow
Set-Location backend
dotnet publish -c Release -o ./publish
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Backend built successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Backend build failed" -ForegroundColor Red
    Set-Location ..
    exit 1
}

# Deploy Backend
Write-Host "🚀 Deploying Backend..." -ForegroundColor Yellow
Compress-Archive -Path ./publish/* -DestinationPath ./deploy.zip -Force
az webapp deployment source config-zip `
    --name $BACKEND_NAME `
    --resource-group $RESOURCE_GROUP `
    --src ./deploy.zip

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Backend deployed successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Backend deployment failed" -ForegroundColor Red
}

# Cleanup
Remove-Item ./deploy.zip -Force
Set-Location ..
Write-Host ""

# Configure Connection String
Write-Host "🔗 Configuring Connection String..." -ForegroundColor Yellow
$connectionString = "Server=tcp:$SQL_SERVER.database.windows.net,1433;Initial Catalog=$SQL_DB;Persist Security Info=False;User ID=$SQL_ADMIN;Password=$sqlPasswordPlain;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"

az webapp config connection-string set `
    --name $BACKEND_NAME `
    --resource-group $RESOURCE_GROUP `
    --connection-string-type SQLAzure `
    --settings DefaultConnection=$connectionString `
    --output none

Write-Host "✅ Connection string configured" -ForegroundColor Green
Write-Host ""

# Build Frontend
Write-Host "🔨 Building Frontend..." -ForegroundColor Yellow
npm run build -- --configuration=production
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Frontend built successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Frontend build failed" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Display URLs
Write-Host ""
Write-Host "🎉 Deployment Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Your Application URLs:" -ForegroundColor Cyan
Write-Host "  Backend API: https://$BACKEND_NAME.azurewebsites.net" -ForegroundColor White
Write-Host "  Swagger UI:  https://$BACKEND_NAME.azurewebsites.net" -ForegroundColor White
Write-Host ""
Write-Host "📝 Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Deploy frontend to Azure Static Web Apps via GitHub Actions"
Write-Host "  2. Update frontend environment.prod.ts with backend URL"
Write-Host "  3. Configure CORS in backend with frontend URL"
Write-Host "  4. Run database migrations"
Write-Host ""
Write-Host "💡 Useful Commands:" -ForegroundColor Yellow
Write-Host "  View logs:    az webapp log tail --name $BACKEND_NAME --resource-group $RESOURCE_GROUP"
Write-Host "  Restart app:  az webapp restart --name $BACKEND_NAME --resource-group $RESOURCE_GROUP"
Write-Host "  Delete all:   az group delete --name $RESOURCE_GROUP --yes"
Write-Host ""
