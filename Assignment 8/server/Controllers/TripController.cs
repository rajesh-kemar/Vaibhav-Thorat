using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TripEntity5.Models;
using System.Security.Claims;
using TripDashboard1.Interfaces;

namespace TripDashboard.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TripController : ControllerBase
    {
        private readonly ITripservices _tripService;

        public TripController(ITripservices tripService)
        {
            _tripService = tripService;
        }

        // ---------------- Dispatcher Only ------------------
        [Authorize(Roles = "Dispatcher")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Trip>>> GetAllTrips()
        {
            var trips = await _tripService.GetTripsAsync();
            return Ok(trips);
        }


        [Authorize(Roles = "Dispatcher,Driver")]
        [HttpGet("paged")]
        public async Task<IActionResult> GetPagedTrips([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            var (trips, totalCount) = await _tripService.GetPagedTripsAsync(pageNumber, pageSize);
            return Ok(new { trips, totalCount });
        }


        // ---------------- Dispatcher + Driver ------------------
        [Authorize(Roles = "Dispatcher,Driver")]
        [HttpGet("{id}")]
        public async Task<ActionResult<Trip>> GetTripById(int id)
        {
            var trip = await _tripService.GetTripByIdAsync(id);
            if (trip == null)
                return NotFound(new { Message = "Trip not found." });

            // Driver can only see their own trips
            if (User.IsInRole("Driver") && trip.DriverId != GetDriverIdFromUser())
                return Forbid();

            return Ok(trip);
        }

        [Authorize(Roles = "Dispatcher,Driver")]
        [HttpGet("driver/{driverId}")]
        public async Task<ActionResult<IEnumerable<Trip>>> GetTripsByDriver(int driverId)
        {
            // Driver can only get their own trips
            if (User.IsInRole("Driver") && driverId != GetDriverIdFromUser())
                return Forbid();

            var trips = await _tripService.GetByDriverAsync(driverId);
            if (!trips.Any())
                return NotFound(new { Message = "No trips found for this driver." });

            return Ok(trips);
        }

        // ---------------- Dispatcher Only ------------------
        [Authorize(Roles = "Dispatcher")]
        [HttpPost]
        public async Task<ActionResult> AddTrip([FromBody] Trip trip)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var (success, message, createdTrip) = await _tripService.AddTripAsync(trip);
            if (!success) return BadRequest(new { Message = message });

            return CreatedAtAction(nameof(GetTripById), new { id = createdTrip!.TripId }, createdTrip);
        }

        [Authorize(Roles = "Dispatcher")]
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateTrip(int id, [FromBody] Trip updatedTrip)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var (success, message) = await _tripService.UpdateTripAsync(id, updatedTrip);
            if (!success) return NotFound(new { Message = message });

            return Ok(new { Message = message });
        }

        // ---------------- Driver + Dispatcher ------------------
        [Authorize(Roles = "Driver,Dispatcher")]
        [HttpPut("complete/{id}")]
        public async Task<ActionResult> CompleteTrip(int id)
        {
            var trip = await _tripService.GetTripByIdAsync(id);
            if (trip == null) return NotFound(new { Message = "Trip not found." });

            // Driver can only complete their own trip
            if (User.IsInRole("Driver") && trip.DriverId != GetDriverIdFromUser())
                return Forbid();

            var (success, message, updatedTrip) = await _tripService.CompleteTripAsync(id);
            if (!success) return BadRequest(new { Message = message });

            // ✅ Return updated trip details
            return Ok(new
            {
                Message = message,
                UpdatedTrip = updatedTrip
            });
        }


        [Authorize(Roles = "Dispatcher")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteTrip(int id)
        {
            var (success, message) = await _tripService.DeleteTripAsync(id);    
            if (!success) return BadRequest(new { Message = message });

            return Ok(new { Message = message });
        }

        // ---------------- Dispatcher Only ------------------
        [Authorize(Roles = "Dispatcher")]
        [HttpGet("longer-than/{hours}")]
        public async Task<ActionResult<IEnumerable<Trip>>> GetTripsLongerThanHours(double hours)
        {
            var trips = await _tripService.GetTripsLongerThanHoursAsync(hours);

            if (!trips.Any())
                return NotFound(new { Message = $"No trips longer than {hours} hours found." });

            return Ok(trips);
        }

        // ---------------Procedure call for driverTrip Summary -----------
        [HttpGet("driver/{driverId}/summary")]
        [Authorize(Roles = "Driver,Dispatcher")]
        public async Task<IActionResult> GetDriverSummary(int driverId)
        {
            var summary = await _tripService.GetDriverTripSummaryAsync(driverId);
            if (summary == null)
                return NotFound("Driver summary not found.");

            return Ok(summary);
        }


        // ---------------- Helper ------------------
        private int GetDriverIdFromUser()
        {
            var claim = User.Claims.FirstOrDefault(c => c.Type == "DriverId")?.Value;
            return claim != null ? int.Parse(claim) : 0;
        }
    }
}
