# Smart Appointment Booking System - API Documentation

## .NET Web API Specifications

### Technology Stack
- **Framework**: ASP.NET Core 8.0 Web API
- **Database**: SQL Server (Local or Azure SQL)
- **ORM**: Entity Framework Core
- **Authentication**: Optional (JWT Bearer for production)

---

## Database Schema

### 1. Providers Table
```sql
CREATE TABLE Providers (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(100) NOT NULL,
    Email NVARCHAR(100) NOT NULL UNIQUE,
    Phone NVARCHAR(20),
    Specialization NVARCHAR(100),
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    IsActive BIT DEFAULT 1
);
```

### 2. TimeSlots Table
```sql
CREATE TABLE TimeSlots (
    Id INT PRIMARY KEY IDENTITY(1,1),
    ProviderId INT NOT NULL,
    Date DATE NOT NULL,
    StartTime TIME NOT NULL,
    EndTime TIME NOT NULL,
    IsAvailable BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (ProviderId) REFERENCES Providers(Id) ON DELETE CASCADE,
    CONSTRAINT UQ_ProviderDateTime UNIQUE (ProviderId, Date, StartTime)
);
```

### 3. Appointments Table
```sql
CREATE TABLE Appointments (
    Id INT PRIMARY KEY IDENTITY(1,1),
    SlotId INT NOT NULL,
    CustomerName NVARCHAR(100) NOT NULL,
    CustomerEmail NVARCHAR(100) NOT NULL,
    CustomerPhone NVARCHAR(20) NOT NULL,
    ServiceType NVARCHAR(100) NOT NULL,
    Notes NVARCHAR(500),
    Status NVARCHAR(20) DEFAULT 'Pending',
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (SlotId) REFERENCES TimeSlots(Id) ON DELETE CASCADE,
    CHECK (Status IN ('Pending', 'Confirmed', 'Cancelled'))
);
```

### 4. Create Indexes for Performance
```sql
CREATE INDEX IX_TimeSlots_ProviderId ON TimeSlots(ProviderId);
CREATE INDEX IX_TimeSlots_Date ON TimeSlots(Date);
CREATE INDEX IX_TimeSlots_IsAvailable ON TimeSlots(IsAvailable);
CREATE INDEX IX_Appointments_SlotId ON Appointments(SlotId);
CREATE INDEX IX_Appointments_CustomerEmail ON Appointments(CustomerEmail);
CREATE INDEX IX_Appointments_Status ON Appointments(Status);
```

---

## API Endpoints

### Base URL
- **Local Development**: `https://localhost:7000/api`
- **Azure Production**: `https://your-app-name.azurewebsites.net/api`

---

### 1. Providers Endpoints

#### GET /api/providers
**Description**: Get all active providers

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "name": "Dr. John Smith",
    "email": "john.smith@clinic.com",
    "phone": "+1-555-0100",
    "specialization": "General Practice",
    "isActive": true
  }
]
```

#### GET /api/providers/{id}
**Description**: Get provider by ID

**Response** (200 OK):
```json
{
  "id": 1,
  "name": "Dr. John Smith",
  "email": "john.smith@clinic.com",
  "phone": "+1-555-0100",
  "specialization": "General Practice",
  "isActive": true
}
```

#### POST /api/providers
**Description**: Create a new provider

**Request Body**:
```json
{
  "name": "Dr. Sarah Johnson",
  "email": "sarah.johnson@clinic.com",
  "phone": "+1-555-0101",
  "specialization": "Dentistry"
}
```

**Response** (201 Created):
```json
{
  "id": 2,
  "name": "Dr. Sarah Johnson",
  "email": "sarah.johnson@clinic.com",
  "phone": "+1-555-0101",
  "specialization": "Dentistry",
  "isActive": true
}
```

---

### 2. Time Slots Endpoints

#### GET /api/slots/available
**Description**: Get all available time slots with optional filters

**Query Parameters**:
- `date` (optional): Filter by date (YYYY-MM-DD)
- `providerId` (optional): Filter by provider ID

**Example**: `/api/slots/available?date=2026-02-10&providerId=1`

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "date": "2026-02-10",
    "startTime": "09:00:00",
    "endTime": "09:30:00",
    "isAvailable": true,
    "providerId": 1,
    "providerName": "Dr. John Smith"
  },
  {
    "id": 2,
    "date": "2026-02-10",
    "startTime": "09:30:00",
    "endTime": "10:00:00",
    "isAvailable": true,
    "providerId": 1,
    "providerName": "Dr. John Smith"
  }
]
```

#### GET /api/slots
**Description**: Get all time slots (admin only)

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "date": "2026-02-10",
    "startTime": "09:00:00",
    "endTime": "09:30:00",
    "isAvailable": true,
    "providerId": 1,
    "providerName": "Dr. John Smith"
  }
]
```

#### POST /api/slots
**Description**: Create a new time slot

**Request Body**:
```json
{
  "providerId": 1,
  "date": "2026-02-10",
  "startTime": "14:00:00",
  "endTime": "14:30:00"
}
```

**Response** (201 Created):
```json
{
  "id": 15,
  "date": "2026-02-10",
  "startTime": "14:00:00",
  "endTime": "14:30:00",
  "isAvailable": true,
  "providerId": 1,
  "providerName": "Dr. John Smith"
}
```

#### POST /api/slots/bulk
**Description**: Create multiple time slots at once

**Request Body**:
```json
{
  "providerId": 1,
  "date": "2026-02-11",
  "startTime": "09:00:00",
  "endTime": "17:00:00",
  "slotDurationMinutes": 30
}
```

**Response** (201 Created):
```json
{
  "message": "16 slots created successfully",
  "slotsCreated": 16
}
```

#### PUT /api/slots/{id}
**Description**: Update a time slot

**Request Body**:
```json
{
  "date": "2026-02-10",
  "startTime": "15:00:00",
  "endTime": "15:30:00",
  "isAvailable": true
}
```

**Response** (200 OK):
```json
{
  "id": 15,
  "date": "2026-02-10",
  "startTime": "15:00:00",
  "endTime": "15:30:00",
  "isAvailable": true,
  "providerId": 1,
  "providerName": "Dr. John Smith"
}
```

#### DELETE /api/slots/{id}
**Description**: Delete a time slot

**Response** (204 No Content)

---

### 3. Appointments Endpoints

#### GET /api/appointments
**Description**: Get all appointments

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "slotId": 5,
    "customerName": "Alice Brown",
    "customerEmail": "alice.brown@email.com",
    "customerPhone": "+1-555-0200",
    "serviceType": "Consultation",
    "notes": "First time visit",
    "status": "Confirmed",
    "createdAt": "2026-02-08T10:30:00",
    "slot": {
      "id": 5,
      "date": "2026-02-12",
      "startTime": "10:00:00",
      "endTime": "10:30:00",
      "providerId": 1,
      "providerName": "Dr. John Smith"
    }
  }
]
```

#### GET /api/appointments/{id}
**Description**: Get appointment by ID

**Response** (200 OK):
```json
{
  "id": 1,
  "slotId": 5,
  "customerName": "Alice Brown",
  "customerEmail": "alice.brown@email.com",
  "customerPhone": "+1-555-0200",
  "serviceType": "Consultation",
  "notes": "First time visit",
  "status": "Confirmed",
  "createdAt": "2026-02-08T10:30:00",
  "slot": {
    "id": 5,
    "date": "2026-02-12",
    "startTime": "10:00:00",
    "endTime": "10:30:00",
    "providerId": 1,
    "providerName": "Dr. John Smith"
  }
}
```

#### POST /api/appointments
**Description**: Book a new appointment

**Request Body**:
```json
{
  "slotId": 8,
  "customerName": "Bob Wilson",
  "customerEmail": "bob.wilson@email.com",
  "customerPhone": "+1-555-0201",
  "serviceType": "Check-up",
  "notes": "Annual check-up"
}
```

**Response** (201 Created):
```json
{
  "id": 2,
  "slotId": 8,
  "customerName": "Bob Wilson",
  "customerEmail": "bob.wilson@email.com",
  "customerPhone": "+1-555-0201",
  "serviceType": "Check-up",
  "notes": "Annual check-up",
  "status": "Pending",
  "createdAt": "2026-02-08T11:15:00",
  "slot": {
    "id": 8,
    "date": "2026-02-13",
    "startTime": "11:00:00",
    "endTime": "11:30:00",
    "providerId": 1,
    "providerName": "Dr. John Smith"
  }
}
```

**Error Response** (409 Conflict):
```json
{
  "message": "This slot is no longer available",
  "errorCode": "SLOT_NOT_AVAILABLE"
}
```

#### PUT /api/appointments/{id}/status
**Description**: Update appointment status

**Request Body**:
```json
{
  "status": "Confirmed"
}
```

**Response** (200 OK):
```json
{
  "id": 2,
  "status": "Confirmed",
  "updatedAt": "2026-02-08T12:00:00"
}
```

#### DELETE /api/appointments/{id}
**Description**: Cancel/Delete an appointment

**Response** (204 No Content)

---

## Conflict Detection Logic

### Double Booking Prevention
The API must implement the following logic to prevent double bookings:

1. **Slot Availability Check**:
   ```csharp
   // Before booking, check if slot is available
   var slot = await _context.TimeSlots
       .Include(s => s.Appointments)
       .FirstOrDefaultAsync(s => s.Id == slotId);
   
   if (slot == null || !slot.IsAvailable)
       return Conflict("Slot not available");
   
   // Check if slot already has an active appointment
   var hasActiveAppointment = slot.Appointments
       .Any(a => a.Status != "Cancelled");
   
   if (hasActiveAppointment)
       return Conflict("Slot already booked");
   ```

2. **Transaction with Locking**:
   ```csharp
   using var transaction = await _context.Database.BeginTransactionAsync();
   try
   {
       // Lock the slot row
       var slot = await _context.TimeSlots
           .FirstOrDefaultAsync(s => s.Id == slotId);
       
       // Double-check availability
       if (!slot.IsAvailable)
       {
           await transaction.RollbackAsync();
           return Conflict("Slot no longer available");
       }
       
       // Create appointment
       var appointment = new Appointment { ... };
       _context.Appointments.Add(appointment);
       
       // Mark slot as unavailable
       slot.IsAvailable = false;
       
       await _context.SaveChangesAsync();
       await transaction.CommitAsync();
   }
   catch
   {
       await transaction.RollbackAsync();
       throw;
   }
   ```

---

## Error Handling

### Standard Error Response Format
```json
{
  "message": "Error description",
  "errorCode": "ERROR_CODE",
  "details": {}
}
```

### HTTP Status Codes
- `200 OK`: Successful GET/PUT request
- `201 Created`: Successful POST request
- `204 No Content`: Successful DELETE request
- `400 Bad Request`: Invalid input data
- `404 Not Found`: Resource not found
- `409 Conflict`: Double booking or constraint violation
- `500 Internal Server Error`: Server error

---

## CORS Configuration

For local development, configure CORS in `Program.cs`:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

app.UseCors("AllowAngularApp");
```

---

## Testing Endpoints

### Sample Test Data Script
```sql
-- Insert sample providers
INSERT INTO Providers (Name, Email, Phone, Specialization)
VALUES 
    ('Dr. John Smith', 'john.smith@clinic.com', '+1-555-0100', 'General Practice'),
    ('Dr. Sarah Johnson', 'sarah.johnson@clinic.com', '+1-555-0101', 'Dentistry'),
    ('Dr. Mike Davis', 'mike.davis@clinic.com', '+1-555-0102', 'Cardiology');

-- Insert sample time slots
DECLARE @ProviderId INT = 1;
DECLARE @Date DATE = '2026-02-10';
DECLARE @Time TIME = '09:00:00';

WHILE @Time < '17:00:00'
BEGIN
    INSERT INTO TimeSlots (ProviderId, Date, StartTime, EndTime, IsAvailable)
    VALUES (@ProviderId, @Date, @Time, DATEADD(MINUTE, 30, @Time), 1);
    
    SET @Time = DATEADD(MINUTE, 30, @Time);
END;
```

---

## Deployment Notes

### Azure Configuration
1. **Azure SQL Database**: Create connection string and add to `appsettings.json`
2. **Azure App Service**: Deploy .NET API
3. **Environment Variables**: Configure in Azure portal
4. **CORS**: Update to include Azure Static Web App URL

### Connection String Format
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=tcp:your-server.database.windows.net,1433;Initial Catalog=AppointmentDB;Persist Security Info=False;User ID=your-username;Password=your-password;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"
  }
}
```
