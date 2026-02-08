namespace AppointmentAPI.Models
{
    public class Appointment
    {
        public int Id { get; set; }
        public int SlotId { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public string CustomerEmail { get; set; } = string.Empty;
        public string CustomerPhone { get; set; } = string.Empty;
        public string ServiceType { get; set; } = string.Empty;
        public string? Notes { get; set; }
        public string Status { get; set; } = "pending";
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public TimeSlot? Slot { get; set; }
    }
}
