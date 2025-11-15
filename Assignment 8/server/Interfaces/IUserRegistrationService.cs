using TripDashboard1.Models.Dto;

namespace TripDashboard1.Interfaces
{
    public interface IUserRegistrationService
    {
        RegisterResponse RegisterUser(RegisterRequest model);
    }
}
