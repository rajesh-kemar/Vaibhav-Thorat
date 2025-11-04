using Microsoft.AspNetCore.Mvc;
using TripDashboard.Services;
using TripEntity5.Models;

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

        // ---------------------------------------------------------
        // GET: api/trip
        // Get all trips (with driver and vehicle)
        // ---------------------------------------------------------
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Trip>>> GetAllTrips()
        {
            var trips = await _tripService.GetTripsAsync();
            return Ok(trips);
        }

        // ---------------------------------------------------------
        // GET: api/trip/{id}
        // Get trip by ID
        // ---------------------------------------------------------
        [HttpGet("{id}")]
        public async Task<ActionResult<Trip>> GetTripById(int id)
        {
            var trip = await _tripService.GetTripByIdAsync(id);

            if (trip == null)
                return NotFound(new { Message = "Trip not found." });

            return Ok(trip);
        }

        // ---------------------------------------------------------
        // GET: api/trip/driver/{driverId}
        // Get all trips by driver
        // ---------------------------------------------------------
        [HttpGet("driver/{driverId}")]
        public async Task<ActionResult<IEnumerable<Trip>>> GetTripsByDriver(int driverId)
        {
            var trips = await _tripService.GetByDriverAsync(driverId);

            if (trips == null || !trips.Any())
                return NotFound(new { Message = "No trips found for this driver." });

            return Ok(trips);
        }

        // ---------------------------------------------------------
        // POST: api/trip
        // Add new trip
        // ---------------------------------------------------------
        [HttpPost]
        public async Task<ActionResult> AddTrip([FromBody] Trip trip)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var (success, message, createdTrip) = await _tripService.AddTripAsync(trip);

            if (!success)
                return BadRequest(new { Message = message });

            return CreatedAtAction(nameof(GetTripById), new { id = createdTrip!.TripId }, createdTrip);
        }

        // ---------------------------------------------------------
        // PUT: api/trip/{id}
        // Update trip details
        // ---------------------------------------------------------
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateTrip(int id, [FromBody] Trip updatedTrip)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var (success, message) = await _tripService.UpdateTripAsync(id, updatedTrip);

            if (!success)
                return NotFound(new { Message = message });

            return Ok(new { Message = message });
        }

        // ---------------------------------------------------------
        // PUT: api/trip/complete/{id}
        // Mark a trip as completed
        // ---------------------------------------------------------
        [HttpPut("complete/{id}")]
        public async Task<ActionResult> CompleteTrip(int id)
        {
            var (success, message) = await _tripService.CompleteTripAsync(id);

            if (!success)
                return BadRequest(new { Message = message });

            return Ok(new { Message = message });
        }

        // ---------------------------------------------------------
        // DELETE: api/trip/{id}
        // Delete a trip
        // ---------------------------------------------------------
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteTrip(int id)
        {
            var (success, message) = await _tripService.DeleteTripAsync(id);

            if (!success)
                return BadRequest(new { Message = message });

            return Ok(new { Message = message });
        }

        [HttpGet("longtrips")]
        public async Task<ActionResult<IEnumerable<Trip>>> GetLongTrips([FromQuery] double hours = 8)
        {
            var longTrips = await _tripService.GetTripsLongerThanHoursAsync(hours);

            if (!longTrips.Any())
                return NotFound(new { Message = $"No trips longer than {hours} hours found." });

            return Ok(longTrips);
        }


    }
}
