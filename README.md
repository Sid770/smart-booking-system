# 🏥 Smart Appointment Booking System

[![Angular](https://img.shields.io/badge/Angular-21.1.0-red.svg)](https://angular.io/)
[![.NET](https://img.shields.io/badge/.NET-10.0-blue.svg)](https://dotnet.microsoft.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> A modern, full-stack appointment booking system with Angular frontend and .NET API backend, featuring real-time availability, conflict detection, and comprehensive admin management.

**Live Demo**: [Coming Soon - Azure Deployment]

---

## 📋 Table of Contents

- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Quick Start](#-quick-start)
- [Architecture](#-architecture)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Deployment](#-deployment)
- [CI/CD Pipeline](#-cicd-pipeline)

---

## ✨ Features

### For Customers 👥
- **Browse Available Slots** - View all available appointment times across multiple providers
- **Quick Booking** - Simple 3-step booking process with instant confirmation
- **Service Selection** - Choose from various service types during booking
- **Real-time Availability** - See up-to-date slot availability
- **Booking Confirmation** - Instant confirmation with complete appointment details

### For Administrators ⚙️
- **Provider Management** - Add and manage healthcare providers
- **Slot Management** - Create, update, and delete time slots
- **Booking Overview** - View all appointments with filtering options
- **Availability Control** - Toggle slot availability in real-time
- **Dashboard Analytics** - Monitor bookings and provider schedules

### System Features 🔧
- **Double Booking Prevention** - Automatic slot locking when booked
- **Conflict Detection** - Smart validation prevents overlapping appointments
- **Responsive Design** - Works on desktop, tablet, and mobile devices
- **RESTful API** - Clean, well-documented endpoints with Swagger
- **Real-time Validation** - Form validation with instant feedback
- **Database Persistence** - SQLite/SQL Server for reliable data storage

---

## 🚀 Technology Stack

### Frontend
- **Framework**: Angular 21.1.0
- **Language**: TypeScript 5.9
- **Styling**: Custom CSS with modern gradients
- **HTTP**: Angular HttpClient with RxJS
- **Routing**: Angular Router
- **Forms**: Reactive Forms with validation
- **Components**: Standalone components with signals

### Backend
- **Framework**: ASP.NET Core Web API (.NET 10.0)
- **ORM**: Entity Framework Core 10.0
- **Database**: SQLite (Development) / SQL Server (Production)
- **API Docs**: Swashbuckle/Swagger OpenAPI
- **CORS**: Configured for Angular frontend
- **Architecture**: RESTful API with clean architecture

### DevOps
- **Version Control**: Git & GitHub
- **CI/CD**: GitHub Actions
- **Cloud**: Azure App Service & Azure SQL Database
- **Environments**: Development, Staging, Production

---

## 🚀 Quick Start

### Prerequisites

Ensure you have the following installed:
- **Node.js** v20+ & npm v10.9+
- **.NET SDK** 10.0+
- **Angular CLI** v21.1.3+: `npm install -g @angular/cli`
- **Git** (for version control)

### Local Development

#### 1. Clone the Repository
```bash
git clone https://github.com/Sid770/smart-appointment-booking.git
cd smart-appointment-booking
```

#### 2. Install Dependencies

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
cd backend
dotnet restore
cd ..
```

#### 3. Start the Application

**Terminal 1 - Backend API:**
```bash
cd backend
dotnet run
```
🔗 **Backend**: http://localhost:5050  
📋 **Swagger**: http://localhost:5050

**Terminal 2 - Frontend:**
```bash
npm start
```
🌐 **Frontend**: http://localhost:4200

---

## 📐 Architecture

### Component Structure

```
├── Frontend (Angular)
│   ├── app/
│   │   ├── components/
│   │   │   ├── home/                    # Landing page
│   │   │   ├── available-slots/         # Browse slots
│   │   │   ├── book-appointment/        # Booking form
│   │   │   ├── confirmation/            # Success page
│   │   │   └── admin-slots/             # Admin panel
│   │   ├── services/
│   │   │   └── appointment.service.ts   # API communication
│   │   ├── models/
│   │   │   └── appointment.model.ts     # TypeScript interfaces
│   │   └── app.routes.ts                # Routing configuration
│   └── ...
│
└── Backend (.NET API)
    ├── Controllers/
    │   ├── AppointmentsController.cs
    │   ├── ProvidersController.cs
    │   └── SlotsController.cs
    ├── Models/
    │   ├── Appointment.cs
    │   ├── Provider.cs
    │   └── TimeSlot.cs
    ├── Data/
    │   └── AppDbContext.cs
    └── Program.cs
```

### Data Flow

```
Angular Frontend → HTTP Requests → .NET Web API → Entity Framework Core → Database
                ← JSON Response ←              ← Data Results ←
```

---

## 📚 API Documentation

### Base URLs

| Environment | Frontend | Backend API | Swagger UI |
|-------------|----------|-------------|------------|
| **Local** | http://localhost:4200 | http://localhost:5050/api | http://localhost:5050 |
| **Azure** | https://[app-name].azurewebsites.net | https://[api-name].azurewebsites.net/api | https://[api-name].azurewebsites.net |

### API Endpoints

#### Providers
- `GET /api/providers` - Get all providers
- `GET /api/providers/{id}` - Get provider by ID
- `POST /api/providers` - Create new provider
- `PUT /api/providers/{id}` - Update provider
- `DELETE /api/providers/{id}` - Delete provider

#### Time Slots
- `GET /api/slots` - Get all slots
- `GET /api/slots/available` - Get available slots
- `GET /api/slots/available?date={date}&providerId={id}` - Filter slots
- `POST /api/slots` - Create new slot
- `PUT /api/slots/{id}` - Update slot
- `DELETE /api/slots/{id}` - Delete slot

#### Appointments
- `GET /api/appointments` - Get all appointments
- `GET /api/appointments/{id}` - Get appointment by ID
- `POST /api/appointments` - Book appointment
- `PUT /api/appointments/{id}` - Update appointment
- `DELETE /api/appointments/{id}` - Cancel appointment

### Sample Requests

#### Book an Appointment
```bash
POST /api/appointments
Content-Type: application/json

{
  "slotId": 5,
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "customerPhone": "+1-555-0100",
  "serviceType": "Consultation",
  "notes": "First visit"
}
```

#### Create a Time Slot
```bash
POST /api/slots
Content-Type: application/json

{
  "providerId": 1,
  "date": "2026-02-15",
  "startTime": "09:00:00",
  "endTime": "09:30:00"
}
```

For complete API documentation, visit the Swagger UI at http://localhost:5050 or see [API_DOCUMENTATION.md](API_DOCUMENTATION.md).

---

## 🗄️ Database Schema

### Tables

#### Providers
| Column | Type | Description |
|--------|------|-------------|
| Id | int | Primary key |
| Name | string | Provider name |
| Email | string | Email address |
| Phone | string | Phone number |
| Specialization | string | Medical specialization |

#### TimeSlots
| Column | Type | Description |
|--------|------|-------------|
| Id | int | Primary key |
| ProviderId | int | Foreign key to Provider |
| Date | DateOnly | Appointment date |
| StartTime | TimeOnly | Start time |
| EndTime | TimeOnly | End time |
| IsAvailable | bool | Availability status |

#### Appointments
| Column | Type | Description |
|--------|------|-------------|
| Id | int | Primary key |
| SlotId | int | Foreign key to TimeSlot |
| CustomerName | string | Customer name |
| CustomerEmail | string | Email address |
| CustomerPhone | string | Phone number |
| ServiceType | string | Type of service |
| Notes | string | Additional notes |
| Status | string | Booking status |

### Relationships
- One Provider → Many TimeSlots
- One TimeSlot → Many Appointments
- Cascade delete configured for data integrity

---

## ☁️ Deployment

### Azure Deployment (Recommended)

#### 1. Frontend (Azure Static Web Apps)
```bash
# Build production
npm run build

# Deploy via Azure Portal or GitHub Actions
```

#### 2. Backend (Azure App Service)
```bash
# Build and publish
cd backend
dotnet publish -c Release -o ./publish

# Deploy to Azure App Service
```

#### 3. Database (Azure SQL Database)
- Create Azure SQL Database
- Update connection string in `appsettings.json`
- Run migrations: `dotnet ef database update`

### Environment Variables

**Backend (Azure App Service Configuration)**
```
ConnectionStrings__DefaultConnection=Server=tcp:...
ASPNETCORE_ENVIRONMENT=Production
AllowedOrigins=https://your-frontend-url.azurewebsites.net
```

For detailed deployment instructions, see [GETTING_STARTED.md](GETTING_STARTED.md).

---

## 🔄 CI/CD Pipeline

### GitHub Actions Workflows

This project includes automated CI/CD pipelines for:
- **Development** - Auto-deploy on push to `develop` branch
- **Staging** - Auto-deploy on push to `staging` branch
- **Production** - Manual approval required for `main` branch

### Pipeline Features
- Automated builds and tests
- Environment-specific deployments
- Azure App Service integration
- Rollback capabilities
- Automated database migrations

### Workflow Files
- `.github/workflows/development.yml` - Dev environment
- `.github/workflows/staging.yml` - Staging environment
- `.github/workflows/production.yml` - Production environment

---

## 🧪 Testing

### Run Frontend Tests
```bash
npm test
```

### Run Backend Tests
```bash
cd backend
dotnet test
```

### Manual Testing via Swagger
1. Navigate to http://localhost:5050
2. Expand any endpoint
3. Click "Try it out"
4. Execute test requests

---

## 🔧 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 4200 (Frontend)
netstat -ano | findstr :4200
taskkill /PID <PID> /F

# Kill process on port 5050 (Backend)
netstat -ano | findstr :5050
taskkill /PID <PID> /F
```

### CORS Errors
- Ensure backend runs on port 5050
- Ensure frontend runs on port 4200
- Check CORS policy in `backend/Program.cs`

### Database Reset
```bash
cd backend
Remove-Item appointments.db
dotnet run  # Database will be recreated
```

---

## 👨‍💻 Developer

**Siddharth** ([@Sid770](https://github.com/Sid770))

---

## 📝 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- Built with Angular and .NET
- Deployed on Microsoft Azure
- Created for HCL Hackathon 2026

---

## 🔗 Quick Links

| Resource | URL |
|----------|-----|
| **Live Demo** | [Coming Soon] |
| **API Docs** | [Swagger UI](http://localhost:5050) |
| **GitHub** | [Repository](https://github.com/Sid770/smart-appointment-booking) |
| **Developer** | [@Sid770](https://github.com/Sid770) |
