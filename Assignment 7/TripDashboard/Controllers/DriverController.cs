using Microsoft.AspNetCore.Mvc;
using TripDashboard.Services;
using TripEntity5.Models;

namespace TripDashboard.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DriverController : ControllerBase
    {
        private readonly IDriverService _driverService;

        public DriverController(IDriverService driverService)
        {
            _driverService = driverService;
        }

        // ---------------------------------------------------------
        // GET: api/driver
        // Get all drivers
        // ---------------------------------------------------------
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Driver>>> GetAllDrivers()
        {
            var drivers = await _driverService.GetAllDriversAsync();
            return Ok(drivers);
        }

        // ---------------------------------------------------------
        // GET: api/driver/{id}
        // Get a single driver by ID
        // ---------------------------------------------------------
        [HttpGet("{id}")]
        public async Task<ActionResult<Driver>> GetDriverById(int id)
        {
            var driver = await _driverService.GetDriverByIdAsync(id);

            if (driver == null)
                return NotFound(new { Message = "Driver not found." });

            return Ok(driver);
        }

        // ---------------------------------------------------------
        // POST: api/driver
        // Add a new driver
        // ---------------------------------------------------------
        [HttpPost]
        public async Task<ActionResult> AddDriver([FromBody] Driver driver)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var (success, message, createdDriver) = await _driverService.AddDriverAsync(driver);

            if (!success)
                return BadRequest(new { Message = message });

            return CreatedAtAction(nameof(GetDriverById), new { id = createdDriver!.DriverId }, createdDriver);
        }

        // ---------------------------------------------------------
        // PUT: api/driver/{id}
        // Update an existing driver
        // ---------------------------------------------------------
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateDriver(int id, [FromBody] Driver driver)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var (success, message) = await _driverService.UpdateDriverAsync(id, driver);

            if (!success)
                return NotFound(new { Message = message });

            return Ok(new { Message = message });
        }

        // ---------------------------------------------------------
        // DELETE: api/driver/{id}
        // Delete a driver
        // ---------------------------------------------------------
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteDriver(int id)
        {
            var (success, message) = await _driverService.DeleteDriverByIdAsync(id);

            if (!success)
                return BadRequest(new { Message = message });

            return Ok(new { Message = message });
        }
    }
}
