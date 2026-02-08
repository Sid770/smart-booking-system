# Quick Setup Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Prerequisites
```bash
# Install Node.js 20+ from https://nodejs.org
# Install .NET SDK 10+ from https://dotnet.microsoft.com

# Install Angular CLI
npm install -g @angular/cli
```

### Step 2: Clone & Install
```bash
# Clone the repository
git clone https://github.com/Sid770/smart-appointment-booking.git
cd smart-appointment-booking

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
dotnet restore
cd ..
```

### Step 3: Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
dotnet run
```
✅ Backend running at: http://localhost:5050

**Terminal 2 - Frontend:**
```bash
npm start
```
✅ Frontend running at: http://localhost:4200

### Step 4: Access the Application

- **Frontend App**: http://localhost:4200
- **Swagger API**: http://localhost:5050
- **API Endpoints**: http://localhost:5050/api

## 📖 Full Documentation

- **[README.md](README.md)** - Complete project overview
- **[Getting Started](docs/GETTING_STARTED.md)** - Detailed setup guide
- **[API Documentation](docs/API_DOCUMENTATION.md)** - API reference
- **[Azure Deployment](docs/AZURE_DEPLOYMENT.md)** - Cloud deployment guide

## 🆘 Troubleshooting

### Port Already in Use
```bash
# Windows PowerShell
netstat -ano | findstr :4200
taskkill /PID <PID> /F
```

### Database Issues
```bash
cd backend
Remove-Item appointments.db
dotnet run  # Will recreate database
```

### Need Help?
- Check [docs/GETTING_STARTED.md](docs/GETTING_STARTED.md) for detailed instructions
- Open an issue on GitHub
- Review logs in terminal output

## 🎯 Next Steps

1. ✅ Complete local setup above
2. 📚 Read [API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md)
3. ☁️ Deploy to Azure following [AZURE_DEPLOYMENT.md](docs/AZURE_DEPLOYMENT.md)
4. 🔄 Set up CI/CD pipelines (automatic with GitHub Actions)

---

**Happy Coding!** 🎉

For more information, see the [full README](README.md).
