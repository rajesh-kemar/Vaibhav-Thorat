using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TripDashboard1.Interfaces;
using TripEntity5.Models;

namespace TripDashboard.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VehicleController : ControllerBase
    {
        private readonly IVehicleService _vehicleService;

        public VehicleController(IVehicleService vehicleService)
        {
            _vehicleService = vehicleService;
        }

        // ---------------- Dispatcher + Driver ----------------
        [Authorize(Roles = "Dispatcher,Driver")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Vehicle>>> GetAllVehicles()
        {
            var vehicles = await _vehicleService.GetAllVehiclesAsync();
            return Ok(vehicles);
        }

        [Authorize(Roles = "Dispatcher,Driver")]
        [HttpGet("available")]
        public async Task<ActionResult<IEnumerable<Vehicle>>> GetAvailableVehicles()
        {
            var vehicles = await _vehicleService.GetAvailableVehiclesAsync();
            return Ok(vehicles);
        }

        [Authorize(Roles = "Dispatcher,Driver")]
        [HttpGet("{id}")]
        public async Task<ActionResult<Vehicle>> GetVehicleById(int id)
        {
            var vehicle = await _vehicleService.GetVehicleByIdAsync(id);
            if (vehicle == null) return NotFound(new { Message = "Vehicle not found." });

            return Ok(vehicle);
        }

        // ---------------- Dispatcher Only ------------------
        [Authorize(Roles = "Dispatcher")]
        [HttpPost]
        public async Task<ActionResult> AddVehicle([FromBody] Vehicle vehicle)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var (success, message, createdVehicle) = await _vehicleService.AddVehicleAsync(vehicle);
            if (!success) return BadRequest(new { Message = message });

            return CreatedAtAction(nameof(GetVehicleById), new { id = createdVehicle!.VehicleId }, createdVehicle);
        }

        [Authorize(Roles = "Dispatcher")]
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateVehicle(int id, [FromBody] Vehicle updatedVehicle)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var (success, message) = await _vehicleService.UpdateVehicleAsync(id, updatedVehicle);
            if (!success) return NotFound(new { Message = message });

            return Ok(new { Message = message });
        }

        [Authorize(Roles = "Dispatcher")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteVehicle(int id)
        {
            var (success, message) = await _vehicleService.DeleteVehicleAsync(id);
            if (!success) return NotFound(new { Message = message });

            return Ok(new { Message = message });
        }
    }
}
