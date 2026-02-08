using Azure.Data.Tables;
using Microsoft.AspNetCore.Mvc;
using AppointmentAPI.Models;

namespace AppointmentAPI.Controllers;

[ApiController]
[Route("api/users")]
public class UsersController : ControllerBase
{
    private readonly TableClient _table;

    public UsersController(TableServiceClient serviceClient)
    {
        _table = serviceClient.GetTableClient("Users");
        _table.CreateIfNotExists();
    }

    [HttpPost]
    public async Task<IActionResult> AddUser(UserEntity user)
    {
        try
        {
            // Ensure RowKey is set
            if (string.IsNullOrEmpty(user.RowKey))
            {
                user.RowKey = Guid.NewGuid().ToString();
            }

            await _table.AddEntityAsync(user);
            return Ok(user);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = "Error adding user", error = ex.Message });
        }
    }

    [HttpGet]
    public IActionResult GetAllUsers()
    {
        try
        {
            var users = _table.Query<UserEntity>();
            return Ok(users);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = "Error retrieving users", error = ex.Message });
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetUser(string id)
    {
        try
        {
            var user = await _table.GetEntityAsync<UserEntity>("Users", id);
            return Ok(user.Value);
        }
        catch (Exception ex)
        {
            return NotFound(new { message = "User not found", error = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUser(string id, UserEntity user)
    {
        try
        {
            user.RowKey = id;
            user.PartitionKey = "Users";
            await _table.UpdateEntityAsync(user, user.ETag);
            return Ok(user);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = "Error updating user", error = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(string id)
    {
        try
        {
            await _table.DeleteEntityAsync("Users", id);
            return Ok(new { message = "User deleted successfully" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = "Error deleting user", error = ex.Message });
        }
    }
}
