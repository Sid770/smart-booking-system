using Azure;
using Azure.Data.Tables;

namespace AppointmentAPI.Models;

public class UserEntity : ITableEntity
{
    public string PartitionKey { get; set; } = "Users";
    public string RowKey { get; set; } = Guid.NewGuid().ToString();
    public DateTimeOffset? Timestamp { get; set; }
    public ETag ETag { get; set; }

    // Custom properties
    public string? Name { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? Role { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
