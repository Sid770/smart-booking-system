namespace AppointmentAPI.Models
{
    public class TimeSlot
    {
        public int Id { get; set; }
        public string Date { get; set; } = string.Empty;
        public string StartTime { get; set; } = string.Empty;
        public string EndTime { get; set; } = string.Empty;
        public bool IsAvailable { get; set; } = true;
        public int ProviderId { get; set; }
        public string ProviderName { get; set; } = string.Empty;
        
        public Provider? Provider { get; set; }
        public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
    }
}
