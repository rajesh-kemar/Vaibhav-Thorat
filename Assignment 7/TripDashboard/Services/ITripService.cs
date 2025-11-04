using TripEntity5.Models;

namespace TripDashboard.Services
{
    public interface ITripservices
    {

        Task<IEnumerable<Trip>> GetTripsAsync();

        Task<Trip?> GetTripByIdAsync(int id);

        Task<(bool Success, string Message, Trip? Trip)> AddTripAsync(Trip trip);

        Task<(bool Success, string Message)> UpdateTripAsync(int id, Trip updatedTrip);

        Task<(bool Success, string Message)> DeleteTripAsync(int id);

        Task<(bool Success, string Message)> CompleteTripAsync(int id);

        Task<IEnumerable<Trip>> GetByDriverAsync(int driverId);

        Task<IEnumerable<Trip>> GetTripsLongerThanHoursAsync(double hours);

    }
}
