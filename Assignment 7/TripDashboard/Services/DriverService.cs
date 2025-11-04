using Microsoft.EntityFrameworkCore;
using TripDashboard.Data;
using TripEntity5.Models;

namespace TripDashboard.Services
{
    public class DriverService : IDriverService
    {
        private readonly AppDbContext _context;

        public DriverService(AppDbContext context)
        {
            _context = context;
        }

        // ---------------------------
        // READ: Get all drivers
        // ---------------------------
        public async Task<IEnumerable<Driver>> GetAllDriversAsync()
        {
            return await _context.Drivers.ToListAsync();
        }

        // ---------------------------
        // READ: Get driver by ID
        // ---------------------------
        public async Task<Driver?> GetDriverByIdAsync(int id)
        {
            return await _context.Drivers
                .Include(d => d.Trips)
                .FirstOrDefaultAsync(d => d.DriverId == id);
        }

        // ---------------------------
        // CREATE: Add new driver
        // ---------------------------
        public async Task<(bool Success, string Message, Driver? Driver)> AddDriverAsync(Driver driver)
        {
            // Prevent duplicate license numbers
            var existing = await _context.Drivers
                .FirstOrDefaultAsync(d => d.LicenceNumber == driver.LicenceNumber);

            if (existing != null)
                return (false, "A driver with this license number already exists.", null);

            _context.Drivers.Add(driver);
            await _context.SaveChangesAsync();

            return (true, "Driver added successfully.", driver);
        }

        // ---------------------------
        // UPDATE: Modify driver info
        // ---------------------------
        public async Task<(bool Success, string Message)> UpdateDriverAsync(int id, Driver driver)
        {
            var existingDriver = await _context.Drivers.FindAsync(id);
            if (existingDriver == null)
                return (false, "Driver not found.");

            existingDriver.DriverName = driver.DriverName;
            existingDriver.LicenceNumber = driver.LicenceNumber;
            existingDriver.ExperienceYears = driver.ExperienceYears;
            existingDriver.DriverAvailable = driver.DriverAvailable;

            await _context.SaveChangesAsync();
            return (true, "Driver updated successfully.");
        }

        // ---------------------------
        // DELETE: Remove a driver
        // ---------------------------
        public async Task<(bool Success, string Message)> DeleteDriverByIdAsync(int driverId)
        {
            var driver = await _context.Drivers
                .Include(d => d.Trips)
                .FirstOrDefaultAsync(d => d.DriverId == driverId);

            if (driver == null)
                return (false, "Driver not found.");

            // Prevent deleting driver with active trips
            if (driver.Trips.Any(t => t.Enddate == null))
                return (false, "Cannot delete driver with ongoing trips.");

            _context.Drivers.Remove(driver);
            await _context.SaveChangesAsync();

            return (true, "Driver deleted successfully.");
        }
    }
}
