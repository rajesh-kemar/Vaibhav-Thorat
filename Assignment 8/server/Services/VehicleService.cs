using Microsoft.EntityFrameworkCore;
using TripDashboard.Data;
using TripEntity5.Models;
using System.Linq;
using TripDashboard1.Interfaces;

namespace TripDashboard.Services
{
    public class VehicleService : IVehicleService
    {
        private readonly AppDbContext _context;

        public VehicleService(AppDbContext context)
        {
            _context = context;
        }

        // Get all vehicles
        public async Task<IEnumerable<Vehicle>> GetAllVehiclesAsync()
        {
            return await _context.Vehicles.ToListAsync();
        }

        // Get only available vehicles
        public async Task<IEnumerable<Vehicle>> GetAvailableVehiclesAsync()
        {
            return await _context.Vehicles
                .Where(v => v.IsAvailable)
                .ToListAsync();
        }

        // Get vehicle by ID
        public async Task<Vehicle?> GetVehicleByIdAsync(int id)
        {
            return await _context.Vehicles.FindAsync(id);
        }

        // Add a new vehicle
        public async Task<(bool Success, string Message, Vehicle? Vehicle)> AddVehicleAsync(Vehicle vehicle)
        {
            var existing = await _context.Vehicles
                .FirstOrDefaultAsync(v => v.VehicleNumber == vehicle.VehicleNumber);

            if (existing != null)
                return (false, "Vehicle with this number already exists.", null);

            _context.Vehicles.Add(vehicle);
            await _context.SaveChangesAsync();
            return (true, "Vehicle added successfully.", vehicle);
        }

        // Update existing vehicle
        public async Task<(bool Success, string Message)> UpdateVehicleAsync(int vehicleId, Vehicle updatedVehicle)
        {
            var existingVehicle = await _context.Vehicles.FindAsync(vehicleId);
            if (existingVehicle == null)
                return (false, "Vehicle not found.");

            existingVehicle.VehicleNumber = updatedVehicle.VehicleNumber;
            existingVehicle.Type = updatedVehicle.Type;
            existingVehicle.IsAvailable = updatedVehicle.IsAvailable;

            await _context.SaveChangesAsync();
            return (true, "Vehicle updated successfully.");
        }

        // Delete vehicle
        public async Task<(bool Success, string Message)> DeleteVehicleAsync(int vehicleId)
        {
            var vehicle = await _context.Vehicles.FindAsync(vehicleId);
            if (vehicle == null)
                return (false, "Vehicle not found.");

            _context.Vehicles.Remove(vehicle);
            await _context.SaveChangesAsync();

            return (true, "Vehicle deleted successfully.");
        }
    }
}
