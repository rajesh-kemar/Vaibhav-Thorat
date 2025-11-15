using TripDashboard1.Models.Dto;

namespace TripDashboard1.Interfaces
{
    public interface IUserLoginService
    {
        LoginResponse LoginUser(LoginRequest request);
    }
}
