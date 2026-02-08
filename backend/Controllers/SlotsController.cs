using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AppointmentAPI.Data;
using AppointmentAPI.Models;

namespace AppointmentAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SlotsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SlotsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TimeSlot>>> GetSlots()
        {
            return await _context.TimeSlots.ToListAsync();
        }

        [HttpGet("available")]
        public async Task<ActionResult<IEnumerable<TimeSlot>>> GetAvailableSlots([FromQuery] string? date, [FromQuery] int? providerId)
        {
            var query = _context.TimeSlots.Where(s => s.IsAvailable);

            if (!string.IsNullOrEmpty(date))
            {
                query = query.Where(s => s.Date == date);
            }

            if (providerId.HasValue)
            {
                query = query.Where(s => s.ProviderId == providerId.Value);
            }

            return await query.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TimeSlot>> GetSlot(int id)
        {
            var slot = await _context.TimeSlots.FindAsync(id);

            if (slot == null)
            {
                return NotFound();
            }

            return slot;
        }

        [HttpPost]
        public async Task<ActionResult<TimeSlot>> CreateSlot(TimeSlot slot)
        {
            _context.TimeSlots.Add(slot);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetSlot), new { id = slot.Id }, slot);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSlot(int id, TimeSlot slot)
        {
            if (id != slot.Id)
            {
                return BadRequest();
            }

            _context.Entry(slot).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SlotExists(id))
                {
                    return NotFound();
                }
                throw;
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSlot(int id)
        {
            var slot = await _context.TimeSlots.FindAsync(id);
            if (slot == null)
            {
                return NotFound();
            }

            _context.TimeSlots.Remove(slot);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool SlotExists(int id)
        {
            return _context.TimeSlots.Any(e => e.Id == id);
        }
    }
}
