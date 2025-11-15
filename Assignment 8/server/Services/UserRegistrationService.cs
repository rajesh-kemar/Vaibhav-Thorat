
using TripDashboard.Data;
using TripDashboard.Models;
using TripDashboard1.Interfaces;
using TripDashboard1.Models.Dto;


namespace TripDashboard.Services
{
    public class UserRegistrationService : IUserRegistrationService
    {
        private readonly AppDbContext _dbContext;

        public UserRegistrationService(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public RegisterResponse RegisterUser(RegisterRequest model)
        {
            // Validate unique email
            if (_dbContext.Users.Any(u => u.Email == model.Email))
                throw new Exception("Email already registered.");

            // Validate role
            if (model.Role != "Driver" && model.Role != "Dispatcher")
                throw new Exception("Invalid role. Allowed: Driver, Dispatcher.");

            // Create User
            var user = new User
            {
                Name = model.Name,
                UserName = model.UserName,
                Email = model.Email,
                Password = model.Password,
                Role = model.Role
            };

            _dbContext.Users.Add(user);
            _dbContext.SaveChanges();

            // If driver — add Driver record
            if (model.Role == "Driver")
            {
                if (string.IsNullOrEmpty(model.LicenceNumber))
                    throw new Exception("Licence number is required for drivers.");

                var driver = new Driver
                {
                    UserId = user.UserId,
                    LicenceNumber = model.LicenceNumber,
                    Experience = model.Experience ?? 0
                };

                _dbContext.Drivers.Add(driver);
                _dbContext.SaveChanges();
            }

            return new RegisterResponse
            {
                UserId = user.UserId,
                Email = user.Email,
                Role = user.Role,
                Message = $"{user.Role} registered successfully."
            };
        }
    }
}
