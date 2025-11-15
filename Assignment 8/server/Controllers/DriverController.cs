using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TripDashboard.Models;
using TripDashboard1.Interfaces;


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

        // Dispatcher only
        [Authorize(Roles = "Dispatcher")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Driver>>> GetAllDrivers()
        {
            var drivers = await _driverService.GetAllDriversAsync();
            return Ok(drivers);
        }

        [Authorize(Roles = "Dispatcher,Driver")]
        [HttpGet("{id}")]
        public async Task<ActionResult<Driver>> GetDriverById(int id)
        {
            // Driver can only see themselves
            if (User.IsInRole("Driver") && id != GetDriverIdFromUser())
                return Forbid();

            var driver = await _driverService.GetDriverByIdAsync(id);
            if (driver == null) return NotFound(new { Message = "Driver not found." });

            return Ok(driver);
        }

        [Authorize(Roles = "Dispatcher")]
        [HttpPost]
        public async Task<ActionResult> AddDriver([FromBody] Driver driver)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var (success, message, createdDriver) = await _driverService.AddDriverAsync(driver);
            if (!success) return BadRequest(new { Message = message });

            return CreatedAtAction(nameof(GetDriverById), new { id = createdDriver!.DriverId }, createdDriver);
        }

        [Authorize(Roles = "Dispatcher")]
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateDriver(int id, [FromBody] Driver driver)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var (success, message) = await _driverService.UpdateDriverAsync(id, driver);
            if (!success) return NotFound(new { Message = message });

            return Ok(new { Message = message });
        }

        [Authorize(Roles = "Dispatcher")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteDriver(int id)
        {
            var (success, message) = await _driverService.DeleteDriverByIdAsync(id);
            if (!success) return BadRequest(new { Message = message });

            return Ok(new { Message = message });
        }

        private int GetDriverIdFromUser()
        {
            var claim = User.Claims.FirstOrDefault(c => c.Type == "DriverId")?.Value;
            return claim != null ? int.Parse(claim) : 0;
        }
    }
}
