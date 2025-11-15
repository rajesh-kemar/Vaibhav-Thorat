using TripDashboard.Models;


namespace TripDashboard1.Interfaces
{
    public interface IDriverService
    {

        Task<IEnumerable<Driver >> GetAllDriversAsync();
  
        Task<Driver?> GetDriverByIdAsync(int id);

        Task<(bool Success, string Message, Driver? Driver)> AddDriverAsync(Driver driver);

        Task<(bool Success, string Message)> UpdateDriverAsync(int id, Driver driver);

        Task<(bool Success, string Message)> DeleteDriverByIdAsync(int driverId);
    }
}
