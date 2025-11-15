using Microsoft.EntityFrameworkCore;
using TripDashboard.Data;
using TripDashboard.Models;
using TripDashboard1.Interfaces;

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
        // READ: Get all drivers with User details
        // ---------------------------
        public async Task<IEnumerable<Driver>> GetAllDriversAsync()
        {
            return await _context.Drivers
                .Include(d => d.User) // Include related User info (Name, Email, etc.)
                .ToListAsync();
        }

        // ---------------------------
        // READ: Get driver by ID
        // ---------------------------
        public async Task<Driver?> GetDriverByIdAsync(int driverId)
        {
            return await _context.Drivers
                .Include(d => d.User)
                .FirstOrDefaultAsync(d => d.DriverId == driverId);
        }

        // ---------------------------
        // CREATE: Add new driver (linked to User)
        // ---------------------------
        public async Task<(bool Success, string Message, Driver? Driver)> AddDriverAsync(Driver driver)
        {
            // ✅ Validate User existence
            var user = await _context.Users.FindAsync(driver.UserId);
            if (user == null)
                return (false, "Invalid UserId. User not found.", null);

            // ✅ Ensure user role is Driver
            if (!string.Equals(user.Role, "Driver", StringComparison.OrdinalIgnoreCase))
                return (false, "The specified user is not registered as a Driver.", null);

            // ✅ Check for duplicate license
            bool licenceExists = await _context.Drivers.AnyAsync(d => d.LicenceNumber == driver.LicenceNumber);
            if (licenceExists)
                return (false, "A driver with this license number already exists.", null);

            _context.Drivers.Add(driver);
            await _context.SaveChangesAsync();

            return (true, "Driver added successfully.", driver);
        }

        // ---------------------------
        // UPDATE: Modify driver info
        // ---------------------------
        public async Task<(bool Success, string Message)> UpdateDriverAsync(int driverId, Driver updatedDriver)
        {
            var existingDriver = await _context.Drivers
                .Include(d => d.User)
                .FirstOrDefaultAsync(d => d.DriverId == driverId);

            if (existingDriver == null)
                return (false, "Driver not found.");

            // ✅ Update only driver-specific details
            existingDriver.LicenceNumber = updatedDriver.LicenceNumber;
            existingDriver.Experience = updatedDriver.Experience;
            existingDriver.DriverAvailable = updatedDriver.DriverAvailable;

            // ✅ Optional: Update name in User table
            if (updatedDriver.User != null && !string.IsNullOrEmpty(updatedDriver.User.Name))
            {
                existingDriver.User.Name = updatedDriver.User.Name;
            }

            await _context.SaveChangesAsync();
            return (true, "Driver updated successfully.");
        }

        // ---------------------------
        // DELETE: Remove a driver safely
        // ---------------------------
        public async Task<(bool Success, string Message)> DeleteDriverByIdAsync(int driverId)
        {
            var driver = await _context.Drivers
                .Include(d => d.Trips)
                .Include(d => d.User)
                .FirstOrDefaultAsync(d => d.DriverId == driverId);

            if (driver == null)
                return (false, "Driver not found.");

            // ✅ Prevent deleting driver with active trips
            if (driver.Trips != null && driver.Trips.Any(t => t.Enddate == null))
                return (false, "Cannot delete driver with ongoing trips.");

            // ✅ Remove Driver record only (keep User record if needed)
            _context.Drivers.Remove(driver);
            await _context.SaveChangesAsync();

            return (true, "Driver deleted successfully.");
        }
    }
}
