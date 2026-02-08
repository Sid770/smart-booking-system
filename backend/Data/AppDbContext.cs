using Microsoft.EntityFrameworkCore;
using AppointmentAPI.Models;

namespace AppointmentAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Provider> Providers { get; set; }
        public DbSet<TimeSlot> TimeSlots { get; set; }
        public DbSet<Appointment> Appointments { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Seed Providers
            modelBuilder.Entity<Provider>().HasData(
                new Provider { Id = 1, Name = "Dr. Sarah Johnson", Specialty = "General Physician", Email = "sarah.johnson@clinic.com" },
                new Provider { Id = 2, Name = "Dr. Michael Chen", Specialty = "Cardiologist", Email = "michael.chen@clinic.com" },
                new Provider { Id = 3, Name = "Dr. Emily Davis", Specialty = "Dermatologist", Email = "emily.davis@clinic.com" },
                new Provider { Id = 4, Name = "Dr. Robert Smith", Specialty = "Pediatrician", Email = "robert.smith@clinic.com" }
            );

            // Seed TimeSlots for next 7 days
            var slots = new List<TimeSlot>();
            int slotId = 1;
            var today = DateTime.Today;

            for (int dayOffset = 0; dayOffset < 7; dayOffset++)
            {
                var date = today.AddDays(dayOffset).ToString("yyyy-MM-dd");

                for (int providerId = 1; providerId <= 4; providerId++)
                {
                    string providerName = providerId switch
                    {
                        1 => "Dr. Sarah Johnson",
                        2 => "Dr. Michael Chen",
                        3 => "Dr. Emily Davis",
                        4 => "Dr. Robert Smith",
                        _ => ""
                    };

                    // Morning slots: 9 AM - 12 PM
                    for (int hour = 9; hour < 12; hour++)
                    {
                        slots.Add(new TimeSlot
                        {
                            Id = slotId++,
                            Date = date,
                            StartTime = $"{hour:D2}:00:00",
                            EndTime = $"{hour + 1:D2}:00:00",
                            IsAvailable = true,
                            ProviderId = providerId,
                            ProviderName = providerName
                        });
                    }

                    // Afternoon slots: 2 PM - 5 PM
                    for (int hour = 14; hour < 17; hour++)
                    {
                        slots.Add(new TimeSlot
                        {
                            Id = slotId++,
                            Date = date,
                            StartTime = $"{hour:D2}:00:00",
                            EndTime = $"{hour + 1:D2}:00:00",
                            IsAvailable = true,
                            ProviderId = providerId,
                            ProviderName = providerName
                        });
                    }
                }
            }

            modelBuilder.Entity<TimeSlot>().HasData(slots);
        }
    }
}
