using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AppointmentAPI.Data;
using AppointmentAPI.Models;

namespace AppointmentAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AppointmentsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AppointmentsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Appointment>>> GetAppointments()
        {
            return await _context.Appointments.Include(a => a.Slot).ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Appointment>> GetAppointment(int id)
        {
            var appointment = await _context.Appointments.Include(a => a.Slot).FirstOrDefaultAsync(a => a.Id == id);

            if (appointment == null)
            {
                return NotFound();
            }

            return appointment;
        }

        [HttpPost]
        public async Task<ActionResult<Appointment>> CreateAppointment(Appointment appointment)
        {
            // Check if slot is available
            var slot = await _context.TimeSlots.FindAsync(appointment.SlotId);
            
            if (slot == null)
            {
                return BadRequest(new { message = "Slot not found" });
            }

            if (!slot.IsAvailable)
            {
                return BadRequest(new { message = "Slot is no longer available" });
            }

            // Mark slot as unavailable
            slot.IsAvailable = false;
            
            // Set appointment status and created time
            appointment.Status = "confirmed";
            appointment.CreatedAt = DateTime.UtcNow;
            
            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();

            // Load the slot relationship
            await _context.Entry(appointment).Reference(a => a.Slot).LoadAsync();

            return CreatedAtAction(nameof(GetAppointment), new { id = appointment.Id }, appointment);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> CancelAppointment(int id)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null)
            {
                return NotFound();
            }

            // Mark the slot as available again
            var slot = await _context.TimeSlots.FindAsync(appointment.SlotId);
            if (slot != null)
            {
                slot.IsAvailable = true;
            }

            appointment.Status = "cancelled";
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
