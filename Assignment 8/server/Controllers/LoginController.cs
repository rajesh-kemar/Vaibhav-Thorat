
using Microsoft.AspNetCore.Mvc;
using TripDashboard1.Interfaces;


namespace TripDashboard1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IUserLoginService _loginService;

        public AuthController(IUserLoginService loginService)
        {
            _loginService = loginService;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var response = _loginService.LoginUser(request);

            if (string.IsNullOrEmpty(response.Token))
                return Unauthorized(response.Message);

            return Ok(response);
        }
    }
}
