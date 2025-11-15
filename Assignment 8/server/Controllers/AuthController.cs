//using Microsoft.AspNetCore.Mvc;
//using Microsoft.EntityFrameworkCore;
//using TripDashboard.Data;
//using TripDashboard.Models;
//using TripDashboard.Services;
//using TripEntity5.Models;
//using System.Linq;

//namespace TripDashboard.Controllers
//{
//    [Route("api/[controller]")]
//    [ApiController]
//    public class AuthController : ControllerBase
//    {
//        private readonly Jwtservice _jwtService;
//        private readonly AppDbContext _dbContext;

//        public AuthController(Jwtservice jwtService, AppDbContext dbContext)
//        {
//            _jwtService = jwtService;
//            _dbContext = dbContext;
//        }

//        // ----------------------------
//        // USER REGISTRATION (Driver or Dispatcher)
//        // ----------------------------
//        [HttpPost("register")]
//        public IActionResult Register([FromBody] Userlogin model)
//        {
//            if (model == null)
//                return BadRequest("Invalid registration data.");

//            // ✅ Validate role
//            if (string.IsNullOrEmpty(model.Role) || !(model.Role == "Driver" || model.Role == "Dispatcher"))
//                return BadRequest("Role must be either 'Driver' or 'Dispatcher'.");

//            // ✅ If role = Dispatcher
//            if (model.Role == "Dispatcher")
//            {
//                // Validate dispatcher-specific fields
//                if (string.IsNullOrEmpty(model.UserName) || string.IsNullOrEmpty(model.Password))
//                    return BadRequest("Dispatcher must provide username and password.");

//                // Prevent duplicate user by email or username
//                if (_dbContext.Userlogins.Any(u => u.UserName == model.UserName))
//                    return BadRequest("Dispatcher with this username already exists.");

//                var dispatcher = new Userlogin
//                {
//                    UserName = model.UserName,
//                    Password = model.Password,
//                    Role = "Dispatcher",
//                    LicenceNumber = null,
//                    Experience = null,
//                    Email = model.Email
//                };

//                _dbContext.Userlogins.Add(dispatcher);
//                _dbContext.SaveChanges();

//                var token = _jwtService.GenerateToken(dispatcher.UserName, dispatcher.Role, null);

//                return Ok(new AuthenticatedUser
//                {
//                    Id = dispatcher.Id,
//                    UserName = dispatcher.UserName,
//                    LicenceNumber = null,
//                    Role = dispatcher.Role,
//                    DriverId = null,
//                    Token = token
//                });
//            }

//            // ✅ If role = Driver
//            if (model.Role == "Driver")
//            {
//                if (string.IsNullOrEmpty(model.UserName) || string.IsNullOrEmpty(model.LicenceNumber) || model.Experience == null)
//                    return BadRequest("Driver must provide username, licence number, and experience.");

//                // Prevent duplicate license
//                if (_dbContext.Userlogins.Any(u => u.LicenceNumber == model.LicenceNumber))
//                    return BadRequest("Driver with this license number already exists.");

//                var driverUser = new Userlogin
//                {
//                    UserName = model.UserName,
//                    Password = model.Password,
//                    Role = "Driver",
//                    LicenceNumber = model.LicenceNumber,
//                    Experience = model.Experience
//                };

//                _dbContext.Userlogins.Add(driverUser);
//                _dbContext.SaveChanges();

//                // Create a driver record
//                var newDriver = new Driver
//                {
//                    DriverName = driverUser.UserName,
//                    LicenceNumber = driverUser.LicenceNumber!,
//                    DriverAvailable = true,
//                    ExperienceYears = model.Experience ?? 0
//                };

//                _dbContext.Drivers.Add(newDriver);
//                _dbContext.SaveChanges();

//                var token = _jwtService.GenerateToken(driverUser.UserName, driverUser.Role, newDriver.DriverId);

//                return Ok(new AuthenticatedUser
//                {
//                    Id = driverUser.Id,
//                    UserName = driverUser.UserName,
//                    LicenceNumber = driverUser.LicenceNumber,
//                    Role = driverUser.Role,
//                    DriverId = newDriver.DriverId,
//                    Token = token
//                });
//            }

//            return BadRequest("Invalid role.");
//        }

//        // ----------------------------
//        // LOGIN (Driver or Dispatcher)
//        // ----------------------------
//        [HttpPost("login")]
//        public IActionResult Login([FromBody] Userlogin model)
//        {
//            if (model == null)
//                return BadRequest("Invalid login data.");

//            Userlogin? user = null;

//            if (model.Role == "Dispatcher")
//            {
//                user = _dbContext.Userlogins
//                    .FirstOrDefault(u => u.UserName == model.UserName && u.Password == model.Password && u.Role == "Dispatcher");
//            }
//            else if (model.Role == "Driver")
//            {
//                user = _dbContext.Userlogins
//                    .FirstOrDefault(u => u.LicenceNumber == model.LicenceNumber && u.Password == model.Password && u.Role == "Driver");
//            }

//            if (user == null)
//                return Unauthorized("Invalid credentials.");

//            int? driverId = null;

//            if (user.Role == "Driver")
//            {
//                var driver = _dbContext.Drivers.FirstOrDefault(d => d.LicenceNumber == user.LicenceNumber);
//                driverId = driver?.DriverId;
//            }

//            var token = _jwtService.GenerateToken(user.UserName, user.Role, driverId);

//            return Ok(new AuthenticatedUser
//            {
//                Id = user.Id,
//                UserName = user.UserName,
//                LicenceNumber = user.LicenceNumber,
//                Role = user.Role,
//                DriverId = driverId,
//                Token = token
//            });
//        }
//    }
//}
