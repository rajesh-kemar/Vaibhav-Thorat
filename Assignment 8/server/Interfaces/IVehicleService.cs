using TripEntity5.Models;

namespace TripDashboard1.Interfaces
{
    public interface IVehicleService
    {
      
        Task<IEnumerable<Vehicle>> GetAllVehiclesAsync();


        Task<IEnumerable<Vehicle>> GetAvailableVehiclesAsync();

 
        Task<Vehicle?> GetVehicleByIdAsync(int id);

       
        Task<(bool Success, string Message, Vehicle? Vehicle)> AddVehicleAsync(Vehicle vehicle);

 
        Task<(bool Success, string Message)> UpdateVehicleAsync(int vehicleId, Vehicle updatedVehicle);

      
        Task<(bool Success, string Message)> DeleteVehicleAsync(int vehicleId);
    }
}
