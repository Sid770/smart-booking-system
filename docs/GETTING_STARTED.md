# Getting Started - Smart Appointment Booking System

This guide will help you set up and run the Smart Appointment Booking System on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v20 or higher) - [Download](https://nodejs.org/)
- **.NET SDK** (v10.0 or higher) - [Download](https://dotnet.microsoft.com/download)
- **npm** (v10.9.2 or higher) - Comes with Node.js
- **Angular CLI** (v21.1.3 or higher) - Install globally:
  ```bash
  npm install -g @angular/cli
  ```

## Quick Start

### Option 1: Run Both Frontend and Backend

#### Terminal 1 - Backend API
```bash
cd backend
dotnet run
```

#### Terminal 2 - Frontend Application
```bash
npm start
```

### Option 2: Using VS Code Tasks

This project includes pre-configured VS Code tasks. Open the Command Palette (`Ctrl+Shift+P`) and select:
- `Tasks: Run Task` → `npm: start` (for frontend)

---

## Detailed Setup Instructions

### 1️⃣ Install Dependencies

#### Frontend Dependencies
```bash
# Navigate to project root
cd b:\OneDrive - Amity University\Desktop\CRUD\hcl2

# Install npm packages
npm install
```

#### Backend Dependencies
```bash
# Navigate to backend folder
cd backend

# Restore .NET packages
dotnet restore
```

---

### 2️⃣ Start the Backend API

```bash
# Navigate to backend folder
cd backend

# Run the API
dotnet run
```

**Backend API will start on:**
- 🔗 **API Base URL**: http://localhost:5050
- 📋 **Swagger UI**: http://localhost:5050
- 📡 **API Endpoints**: http://localhost:5050/api

**Expected Console Output:**
```
🚀 Appointment API is running!
📋 Swagger UI: http://localhost:5050
🔗 API Base: http://localhost:5050/api
```

#### Alternative: Build and Run
```bash
# Clean build
dotnet clean
dotnet build

# Run the application
dotnet run
```

---

### 3️⃣ Start the Frontend Application

```bash
# Navigate to project root (from backend, go up one level)
cd ..

# Start Angular development server
npm start
```

**Or using Angular CLI directly:**
```bash
ng serve
```

**Frontend will start on:**
- 🌐 **Application URL**: http://localhost:4200

**Expected Console Output:**
```
✔ Browser application bundle generation complete.
❯ Initial chunk files | Names         | Raw size
  main.js             | main          | XXX.XX kB | 
  
❯ Application bundle generation complete. [X.XXX seconds]

Watch mode enabled. Watching for file changes...
➜  Local:   http://localhost:4200/
```

---

## 🔗 Application Links

Once both services are running, you can access:

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | [http://localhost:4200](http://localhost:4200) | Main Angular application |
| **Backend API** | [http://localhost:5050/api](http://localhost:5050/api) | RESTful API endpoints |
| **Swagger UI** | [http://localhost:5050](http://localhost:5050) | Interactive API documentation |

---

## 📋 Swagger API Documentation

The Swagger UI provides interactive API documentation where you can:
- View all available endpoints
- Test API calls directly from the browser
- See request/response schemas
- Understand endpoint parameters

### Accessing Swagger

1. Ensure the backend is running
2. Open your browser
3. Navigate to: **http://localhost:5050**

### Available API Endpoints in Swagger

#### Providers Endpoints
- `GET /api/providers` - Get all providers
- `GET /api/providers/{id}` - Get provider by ID
- `POST /api/providers` - Create new provider
- `PUT /api/providers/{id}` - Update provider
- `DELETE /api/providers/{id}` - Delete provider

#### Slots Endpoints
- `GET /api/slots` - Get all time slots
- `GET /api/slots/available` - Get available slots only
- `GET /api/slots/{id}` - Get slot by ID
- `POST /api/slots` - Create new slot
- `PUT /api/slots/{id}` - Update slot
- `DELETE /api/slots/{id}` - Delete slot

#### Appointments Endpoints
- `GET /api/appointments` - Get all appointments
- `GET /api/appointments/{id}` - Get appointment by ID
- `POST /api/appointments` - Book new appointment
- `PUT /api/appointments/{id}` - Update appointment
- `DELETE /api/appointments/{id}` - Cancel appointment

---

## 🗄️ Database

The application uses **SQLite** for data persistence:

- **Database File**: `appointments.db`
- **Location**: `backend/appointments.db`
- **Auto-created**: Yes (on first run)
- **Migrations**: Applied automatically via `EnsureCreated()`

### Database Structure

The database contains three main tables:
1. **Providers** - Service provider information
2. **TimeSlots** - Available appointment slots
3. **Appointments** - Booking records

---

## 🧪 Testing the Application

### Using the Frontend

1. **Home Page** (http://localhost:4200/)
   - View features overview
   - Navigate to available slots or admin panel

2. **View Available Slots** (http://localhost:4200/available-slots)
   - Browse available time slots
   - Click "Book Appointment" on any slot

3. **Book Appointment** (http://localhost:4200/book-appointment)
   - Fill in customer details
   - Select service type
   - Add optional notes
   - Submit booking

4. **Admin Panel** (http://localhost:4200/admin-slots)
   - View all slots and appointments
   - Create new time slots
   - Manage existing slots

### Using Swagger UI

1. Navigate to http://localhost:5050
2. Click on any endpoint to expand
3. Click "Try it out"
4. Fill in required parameters
5. Click "Execute"
6. View the response

### Using PowerShell/Terminal

```powershell
# Get all providers
Invoke-RestMethod -Uri "http://localhost:5050/api/providers" -Method Get

# Get available slots
Invoke-RestMethod -Uri "http://localhost:5050/api/slots/available" -Method Get

# Get all appointments
Invoke-RestMethod -Uri "http://localhost:5050/api/appointments" -Method Get
```

---

## 🛠️ Common Commands

### Frontend Commands

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Watch mode (auto-rebuild)
npm run watch
```

### Backend Commands

```bash
# Run the application
dotnet run

# Build the project
dotnet build

# Clean build artifacts
dotnet clean

# Restore packages
dotnet restore

# Watch mode (auto-rebuild)
dotnet watch run
```

---

## 🔧 Troubleshooting

### Port Already in Use

**Frontend (Port 4200):**
```bash
# Kill process on port 4200
netstat -ano | findstr :4200
taskkill /PID <PID> /F
```

**Backend (Port 5050):**
```bash
# Kill process on port 5050
netstat -ano | findstr :5050
taskkill /PID <PID> /F
```

### CORS Errors

If you see CORS errors:
1. Ensure backend is running on port 5050
2. Ensure frontend is running on port 4200
3. Check CORS configuration in `backend/Program.cs`

### Database Issues

```bash
# Delete and recreate database
cd backend
Remove-Item appointments.db -ErrorAction SilentlyContinue
dotnet run
```

### Package Restore Issues

**Frontend:**
```bash
# Clear npm cache and reinstall
Remove-Item node_modules -Recurse -Force
Remove-Item package-lock.json
npm install
```

**Backend:**
```bash
# Clear NuGet cache
dotnet nuget locals all --clear
dotnet restore
```

---

## 📱 Application Workflow

1. **Backend Starts** → Database created/migrated → API ready
2. **Frontend Starts** → Connects to backend → Application ready
3. **User Access** → View slots → Book appointment → Confirmation
4. **Admin Access** → Manage slots → View bookings → Update system

---

## 🚀 Production Build

### Frontend Production Build
```bash
npm run build
```
Output will be in `dist/hcl2/browser/`

### Backend Production Build
```bash
cd backend
dotnet publish -c Release -o ./publish
```
Output will be in `backend/publish/`

---

## 📞 Support

If you encounter any issues:
1. Check this documentation thoroughly
2. Verify all prerequisites are installed
3. Ensure both frontend and backend are running
4. Check console logs for error messages
5. Review API documentation in Swagger

---

**Happy Coding! 🎉**

---

**Quick Reference:**
- Frontend: http://localhost:4200
- Backend API: http://localhost:5050/api
- Swagger Docs: http://localhost:5050
