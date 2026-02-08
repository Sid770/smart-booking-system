# GitHub Repository Setup Guide

## 🚀 Steps to Create and Push to GitHub

### Step 1: Create GitHub Repository

Since GitHub CLI is not installed, please follow these steps:

1. **Go to GitHub**: https://github.com/new

2. **Fill in repository details**:
   - **Repository name**: `smart-appointment-booking`
   - **Description**: `Smart Appointment Booking System - Angular 21, .NET 10, Azure deployment with CI/CD pipeline`
   - **Visibility**: Public (recommended for hackathon showcase)
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)

3. **Click "Create repository"**

### Step 2: Push to GitHub

After creating the repository, run these commands in your terminal:

```powershell
# Add remote origin
git remote add origin https://github.com/Sid770/smart-appointment-booking.git

# Push all branches
git push -u origin main
git push -u origin develop
git push -u origin staging
```

### Step 3: Verify Upload

Check your repository at: https://github.com/Sid770/smart-appointment-booking

You should see:
- ✅ All source code files
- ✅ Documentation in `/docs`
- ✅ CI/CD workflows in `.github/workflows`
- ✅ README.md as homepage
- ✅ Three branches: main, develop, staging

### Step 4: Configure GitHub Secrets (For CI/CD)

You'll need to add these secrets later for automated deployment:

**Go to**: https://github.com/Sid770/smart-appointment-booking/settings/secrets/actions

**Add these secrets** (you'll get values from Azure):

1. `AZURE_STATIC_WEB_APPS_API_TOKEN_DEV`
2. `AZURE_STATIC_WEB_APPS_API_TOKEN_STAGING`
3. `AZURE_STATIC_WEB_APPS_API_TOKEN_PROD`
4. `AZURE_WEBAPP_PUBLISH_PROFILE_DEV`
5. `AZURE_WEBAPP_PUBLISH_PROFILE_STAGING`
6. `AZURE_WEBAPP_PUBLISH_PROFILE_PROD`

**How to get these values**:
- See [docs/AZURE_DEPLOYMENT.md](docs/AZURE_DEPLOYMENT.md) for detailed instructions

---

## 🔄 Alternative: Using GitHub CLI

If you want to install GitHub CLI for easier management:

### Install GitHub CLI

```powershell
# Using winget
winget install --id GitHub.cli

# Or download from:
# https://cli.github.com/
```

### Create Repository with CLI

```powershell
# Login to GitHub
gh auth login

# Create repository
gh repo create smart-appointment-booking --public --source=. --remote=origin --description="Smart Appointment Booking System - Angular 21, .NET 10, Azure"

# Push all branches
git push -u origin main
git push -u origin develop
git push -u origin staging
```

---

## 📋 Repository Structure

Your repository should look like this:

```
smart-appointment-booking/
├── .github/
│   └── workflows/          # CI/CD pipelines
│       ├── development.yml
│       ├── staging.yml
│       └── production.yml
├── backend/                # .NET 10 Web API
│   ├── Controllers/
│   ├── Models/
│   ├── Data/
│   └── Program.cs
├── docs/                   # Documentation
│   ├── ABOUT.md
│   ├── API_DOCUMENTATION.md
│   ├── ARCHITECTURE.md
│   ├── AZURE_DEPLOYMENT.md
│   └── GETTING_STARTED.md
├── src/                    # Angular 21 app
│   ├── app/
│   │   ├── components/
│   │   ├── services/
│   │   └── models/
│   └── environments/
├── .gitignore
├── CONTRIBUTING.md
├── LICENSE
├── README.md
├── QUICKSTART.md
└── package.json
```

---

## ✅ Verification Checklist

After pushing to GitHub:

- [ ] Repository is public and accessible
- [ ] README.md displays correctly on homepage
- [ ] All files are uploaded (no sensitive data like `.db` files)
- [ ] Three branches exist: main, develop, staging
- [ ] GitHub Actions workflows are visible
- [ ] License file is recognized by GitHub
- [ ] Repository has description and topics

### Add Topics to Repository

Go to your repository homepage and add these topics:
- `angular`
- `dotnet`
- `azure`
- `appointment-booking`
- `hackathon`
- `typescript`
- `csharp`
- `rest-api`
- `entity-framework`
- `swagger`

---

## 🎯 Next Steps

1. ✅ **Repository created and pushed**
2. 📚 **Review documentation** in `/docs`
3. ☁️ **Deploy to Azure** using `docs/AZURE_DEPLOYMENT.md`
4. 🔄 **Configure CI/CD** by adding GitHub secrets
5. 🧪 **Test pipelines** by pushing to develop branch
6. 🎉 **Show in hackathon!**

---

## 🆘 Troubleshooting

### Issue: Permission denied (publickey)

**Solution**: Use HTTPS instead of SSH
```powershell
git remote set-url origin https://github.com/Sid770/smart-appointment-booking.git
```

### Issue: Repository already exists

**Solution**: Force push (BE CAREFUL - this overwrites remote)
```powershell
git push -u origin main --force
```

### Issue: Large files rejected

**Solution**: Check if database files are excluded in `.gitignore`
```powershell
git rm --cached backend/*.db
git commit -m "Remove database files"
git push
```

---

## 📞 Need Help?

- **GitHub Docs**: https://docs.github.com
- **Git Docs**: https://git-scm.com/doc
- **Issues**: Create an issue if something goes wrong

---

**Your repository is ready for the hackathon! 🚀**
