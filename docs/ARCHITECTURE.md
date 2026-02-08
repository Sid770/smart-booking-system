# System Architecture - Smart Appointment Booking System

## 🏗️ High-Level Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT TIER                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   ┌──────────────────────────────────────────────────────┐      │
│   │         Angular 21 Single Page Application           │      │
│   │  ┌────────────┐  ┌────────────┐  ┌─────────────┐   │      │
│   │  │ Components │  │  Services  │  │   Models    │   │      │
│   │  │ (5 pages)  │  │   (HTTP)   │  │ (TypeScript)│   │      │
│   │  └────────────┘  └────────────┘  └─────────────┘   │      │
│   └──────────────────────────────────────────────────────┘      │
│                                                                   │
└───────────────────────────┬───────────────────────────────────────┘
                            │ HTTPS/JSON
                            │ REST API
┌───────────────────────────▼───────────────────────────────────────┐
│                      APPLICATION TIER                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   ┌────────────────────────────────────────────────────────┐      │
│   │        ASP.NET Core Web API (.NET 10.0)                │      │
│   │  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐ │      │
│   │  │ Controllers │  │    Models    │  │   Services   │ │      │
│   │  │   (REST)    │  │  (Entities)  │  │  (Business)  │ │      │
│   │  └─────────────┘  └──────────────┘  └──────────────┘ │      │
│   │  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐ │      │
│   │  │    CORS     │  │   Swagger    │  │     Auth     │ │      │
│   │  │  (Config)   │  │   (OpenAPI)  │  │  (Future)    │ │      │
│   │  └─────────────┘  └──────────────┘  └──────────────┘ │      │
│   └────────────────────────────────────────────────────────┘      │
│                                                                     │
└───────────────────────────┬─────────────────────────────────────────┘
                            │ Entity Framework Core
                            │ LINQ Queries
┌───────────────────────────▼─────────────────────────────────────────┐
│                         DATA TIER                                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   ┌────────────────────────────────────────────────────────┐      │
│   │              Database (SQLite / SQL Server)            │      │
│   │  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │      │
│   │  │  Providers   │  │  TimeSlots   │  │Appointments │ │      │
│   │  │              │  │              │  │             │ │      │
│   │  │ - Id         │  │ - Id         │  │ - Id        │ │      │
│   │  │ - Name       │  │ - ProviderId │──│ - SlotId    │ │      │
│   │  │ - Email      │  │ - Date       │  │ - Customer  │ │      │
│   │  │ - Phone      │  │ - StartTime  │  │ - Status    │ │      │
│   │  └──────────────┘  │ - EndTime    │  └─────────────┘ │      │
│   │                    │ - IsAvailable│                   │      │
│   │                    └──────────────┘                   │      │
│   └────────────────────────────────────────────────────────┘      │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📦 Component Architecture

### Frontend Components

```
src/app/
├── components/
│   ├── home/
│   │   ├── home.component.ts          # Landing page with navigation
│   │   ├── home.component.html        # Hero section, features
│   │   └── home.component.css         # Gradient styling
│   │
│   ├── available-slots/
│   │   ├── available-slots.component.ts    # Browse available slots
│   │   ├── available-slots.component.html  # Slot cards with filters
│   │   └── available-slots.component.css   # Grid layout
│   │
│   ├── book-appointment/
│   │   ├── book-appointment.component.ts    # Booking form logic
│   │   ├── book-appointment.component.html  # Reactive form
│   │   └── book-appointment.component.css   # Form styling
│   │
│   ├── confirmation/
│   │   ├── confirmation.component.ts        # Success page
│   │   ├── confirmation.component.html      # Confirmation details
│   │   └── confirmation.component.css       # Success animations
│   │
│   └── admin-slots/
│       ├── admin-slots.component.ts         # Admin management
│       ├── admin-slots.component.html       # CRUD interface
│       └── admin-slots.component.css        # Admin styling
│
├── services/
│   └── appointment.service.ts          # HTTP communication layer
│
├── models/
│   └── appointment.model.ts            # TypeScript interfaces
│
└── app.routes.ts                       # Route configuration
```

### Backend Structure

```
backend/
├── Controllers/
│   ├── AppointmentsController.cs     # Booking endpoints
│   ├── ProvidersController.cs        # Provider management
│   └── SlotsController.cs            # Time slot operations
│
├── Models/
│   ├── Appointment.cs               # Appointment entity
│   ├── Provider.cs                  # Provider entity
│   └── TimeSlot.cs                  # Time slot entity
│
├── Data/
│   └── AppDbContext.cs              # EF Core context
│
├── Program.cs                        # App configuration
└── appsettings.json                  # Configuration file
```

---

## 🔄 Data Flow

### Booking Flow

```
1. User Request
   │
   ▼
2. Angular Component
   │ (User clicks "Book Appointment")
   ▼
3. Appointment Service
   │ POST /api/appointments
   ▼
4. AppointmentsController
   │ Validate request
   │ Check slot availability
   ▼
5. AppDbContext
   │ Begin Transaction
   │ Create Appointment
   │ Update Slot (IsAvailable = false)
   │ Commit Transaction
   ▼
6. Return Response
   │ 201 Created with appointment details
   ▼
7. Update UI
   │ Navigate to confirmation page
   │ Display booking details
```

### Conflict Prevention

```
Concurrent Request A          Concurrent Request B
       │                             │
       ▼                             ▼
  Check Slot (Available)       Check Slot (Available)
       │                             │
       ▼                             │
  Lock Row                           │
       │                             ▼
  Recheck Availability          Wait for Lock
       │                             │
       ▼                             │
  Create Appointment                 │
       │                             │
       ▼                             │
  Update Slot (Unavailable)          │
       │                             │
       ▼                             ▼
  Commit & Release            Check Slot (Unavailable)
                                     │
                                     ▼
                              Return 409 Conflict
```

---

## 🌐 API Design

### RESTful Principles

| Method | Endpoint | Description | Response |
|--------|----------|-------------|----------|
| GET | `/api/providers` | List all providers | 200 OK |
| GET | `/api/providers/{id}` | Get provider by ID | 200 OK / 404 |
| POST | `/api/providers` | Create provider | 201 Created |
| PUT | `/api/providers/{id}` | Update provider | 200 OK |
| DELETE | `/api/providers/{id}` | Delete provider | 204 No Content |
| GET | `/api/slots/available` | Get available slots | 200 OK |
| POST | `/api/slots` | Create slot | 201 Created |
| GET | `/api/appointments` | List appointments | 200 OK |
| POST | `/api/appointments` | Book appointment | 201 Created |

### Request/Response Format

**Request (Book Appointment):**
```json
{
  "slotId": 5,
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "customerPhone": "+1-555-0100",
  "serviceType": "Consultation",
  "notes": "First visit"
}
```

**Response (Success):**
```json
{
  "id": 1,
  "slotId": 5,
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "customerPhone": "+1-555-0100",
  "serviceType": "Consultation",
  "notes": "First visit",
  "status": "Confirmed",
  "createdAt": "2026-02-08T10:00:00Z",
  "slot": {
    "id": 5,
    "date": "2026-02-15",
    "startTime": "09:00:00",
    "endTime": "09:30:00",
    "providerId": 1,
    "providerName": "Dr. Sarah Johnson"
  }
}
```

---

## 🔐 Security Architecture

### Current Implementation

1. **CORS Protection**
   - Whitelist specific origins
   - Configured in `Program.cs`

2. **Input Validation**
   - Server-side validation in controllers
   - Client-side validation in Angular forms

3. **SQL Injection Prevention**
   - Parameterized queries via EF Core
   - LINQ expressions (never raw SQL)

4. **Error Handling**
   - Generic error messages to client
   - Detailed logging server-side

### Future Enhancements

- **Authentication**: JWT Bearer tokens
- **Authorization**: Role-based access (Admin, Provider, Customer)
- **Rate Limiting**: Prevent DoS attacks
- **HTTPS Only**: Force secure connections
- **API Keys**: For third-party integrations

---

## 📊 Database Design

### Entity Relationship Diagram

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│   Providers     │         │   TimeSlots     │         │  Appointments   │
├─────────────────┤         ├─────────────────┤         ├─────────────────┤
│ Id (PK)         │1      ∞│ Id (PK)         │1      ∞│ Id (PK)         │
│ Name            │─────────│ ProviderId (FK) │─────────│ SlotId (FK)     │
│ Email           │         │ Date            │         │ CustomerName    │
│ Phone           │         │ StartTime       │         │ CustomerEmail   │
│ Specialization  │         │ EndTime         │         │ CustomerPhone   │
└─────────────────┘         │ IsAvailable     │         │ ServiceType     │
                            └─────────────────┘         │ Notes           │
                                                        │ Status          │
                                                        │ CreatedAt       │
                                                        └─────────────────┘
```

### Indexes

```sql
-- Performance optimization
CREATE INDEX IX_TimeSlots_ProviderId ON TimeSlots(ProviderId);
CREATE INDEX IX_TimeSlots_Date ON TimeSlots(Date);
CREATE INDEX IX_TimeSlots_IsAvailable ON TimeSlots(IsAvailable);
CREATE INDEX IX_Appointments_SlotId ON Appointments(SlotId);
```

---

## 🚀 Deployment Architecture

### Azure Deployment

```
┌─────────────────────────────────────────────────────────────┐
│                     Azure Cloud                              │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────┐                                     │
│  │  GitHub Repository  │                                     │
│  └──────────┬──────────┘                                     │
│             │                                                 │
│             │ Push to branch                                 │
│             ▼                                                 │
│  ┌─────────────────────┐                                     │
│  │  GitHub Actions     │                                     │
│  │  (CI/CD Pipeline)   │                                     │
│  └──────────┬──────────┘                                     │
│             │                                                 │
│      ┌──────┴────────┐                                       │
│      │               │                                       │
│      ▼               ▼                                       │
│  ┌────────┐    ┌─────────────┐                              │
│  │ Build  │    │  Build      │                              │
│  │Frontend│    │  Backend    │                              │
│  └────┬───┘    └──────┬──────┘                              │
│       │               │                                      │
│       ▼               ▼                                      │
│  ┌─────────────┐  ┌──────────────┐                          │
│  │Static Web   │  │ App Service  │                          │
│  │App (Angular)│  │ (.NET API)   │                          │
│  └─────────────┘  └──────┬───────┘                          │
│                           │                                  │
│                           ▼                                  │
│                   ┌──────────────┐                           │
│                   │  Azure SQL   │                           │
│                   │  Database    │                           │
│                   └──────────────┘                           │
│                                                               │
│  ┌─────────────────────┐                                     │
│  │ Application Insights│                                     │
│  │   (Monitoring)      │                                     │
│  └─────────────────────┘                                     │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### CI/CD Pipeline

**Development Branch** → Auto-deploy to Dev environment  
**Staging Branch** → Auto-deploy to Staging + smoke tests  
**Main Branch** → Manual approval → Production deployment

---

## 📈 Scalability Considerations

### Current Capacity
- **Frontend**: Static files (infinite horizontal scaling)
- **Backend**: Single instance (F1 tier)
- **Database**: SQLite (single file, limited)

### Production Scaling

1. **Frontend**: Azure Static Web Apps with CDN
2. **Backend**: Azure App Service with auto-scaling
3. **Database**: Azure SQL with read replicas
4. **Caching**: Redis for frequently accessed data
5. **Load Balancing**: Azure Load Balancer

---

## 🔍 Monitoring & Observability

### Application Insights
- Request tracking
- Dependency calls
- Exception logging
- Performance metrics

### Health Checks
- `/health` endpoint
- Database connectivity
- External API status

### Logging Levels
- Development: Information
- Production: Warning
- Critical errors: Always logged

---

## 🧪 Testing Strategy

### Unit Tests
- Component logic
- Service methods
- Controller actions

### Integration Tests
- API endpoint testing
- Database operations
- CORS validation

### E2E Tests
- Complete booking flow
- Conflict scenarios
- Error handling

---

## 📚 Technology Choices

### Why Angular?
- Modern framework with signals
- Strong TypeScript support
- Comprehensive CLI tooling
- Enterprise-ready

### Why .NET?
- High performance
- Cross-platform
- Strong typing with C#
- Excellent Azure integration

### Why SQLite → SQL Server?
- SQLite: Easy local development
- SQL Server: Production-ready scaling
- EF Core: Seamless migration

---

## 🔮 Future Architecture

### Planned Enhancements
- Microservices architecture
- Event-driven notifications (SignalR)
- Caching layer (Redis)
- API Gateway
- Service mesh

### Integration Points
- Email service (SendGrid)
- SMS notifications (Twilio)
- Calendar sync (Google/Outlook)
- Payment gateway (Stripe)

---

**Version**: 1.0  
**Last Updated**: February 2026  
**Author**: Siddharth (@Sid770)
