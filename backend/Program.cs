using Microsoft.EntityFrameworkCore;
using AppointmentAPI.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { 
        Title = "Smart Appointment Booking API", 
        Version = "v1",
        Description = "API for managing appointments, providers, and time slots"
    });
});

// Configure Database (SQLite for dev, SQL Server for production)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
if (builder.Environment.IsProduction())
{
    // Use SQL Server for production (Azure SQL)
    builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseSqlServer(connectionString));
}
else
{
    // Use SQLite for development
    builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseSqlite(connectionString ?? "Data Source=appointments.db"));
}

// Configure CORS dynamically
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        var allowedOrigins = builder.Configuration["AllowedOrigins"]?.Split(',') 
            ?? new[] { "http://localhost:4200" };
        
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

// Create database and apply migrations
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    try
    {
        if (app.Environment.IsDevelopment())
        {
            dbContext.Database.EnsureCreated();
        }
        else
        {
            // Use migrations in production
            dbContext.Database.Migrate();
        }
    }
    catch (Exception ex)
    {
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred creating the database.");
    }
}

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Appointment API V1");
        c.RoutePrefix = string.Empty; // Swagger at root URL
    });
}
else
{
    // Enable Swagger in production too (for demo/testing)
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Appointment API V1");
        c.RoutePrefix = string.Empty;
    });
}

app.UseCors("AllowAngular");

app.UseAuthorization();

app.MapControllers();

// Health check endpoint
app.MapGet("/health", () => Results.Ok(new { 
    status = "healthy", 
    timestamp = DateTime.UtcNow,
    environment = app.Environment.EnvironmentName 
}));

if (app.Environment.IsDevelopment())
{
    Console.WriteLine("🚀 Appointment API is running!");
    Console.WriteLine("📋 Swagger UI: http://localhost:5050");
    Console.WriteLine("🔗 API Base: http://localhost:5050/api");
}

app.Run(app.Environment.IsDevelopment() ? "http://localhost:5050" : null);

