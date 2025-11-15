
using TripDashboard.Data;
using TripDashboard1.Interfaces;
using TripDashboard1.Models.Dto;
using TripDashboard1.Services.Security;

namespace TripDashboard1.Services
{
    public class UserLoginService : IUserLoginService
    {
        private readonly AppDbContext _dbContext;
        private readonly JwtService _jwtService;

        public UserLoginService(AppDbContext dbContext, JwtService jwtService)
        {
            _dbContext = dbContext;
            _jwtService = jwtService;
        }

        public LoginResponse LoginUser(LoginRequest request)
        {
            var user = _dbContext.Users
                .FirstOrDefault(u =>
                    (u.Email == request.Email )
                    && u.Password == request.Password);

            if (user == null)
            {
                return new LoginResponse
                {
                    Message = "Invalid credentials. Please check username/email and password."
                };
            }

            string token;
            int? driverId = null;

            if (user.Role == "Driver")
            {
                var driver = _dbContext.Drivers.FirstOrDefault(d => d.UserId == user.UserId);
                driverId = driver?.DriverId;

                token = _jwtService.GenerateToken(user.Email, user.Role, driverId ?? 0);
            }
            else
            {
                // Dispatcher or SuperAdmin
                token = _jwtService.GenerateToken(user.Email, user.Role, null);
            }

            return new LoginResponse
            {
                UserId = user.UserId,
                Name = user.Name,
                Role = user.Role,
                DriverId = driverId,
                Token = token,
                Message = "Login successful."
            };
        }
    }
}
