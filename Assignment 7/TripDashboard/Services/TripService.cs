using Microsoft.EntityFrameworkCore;
using TripDashboard.Data;
using TripEntity5.Models;

namespace TripDashboard.Services
{
    public class TripService : ITripservices
    {
        private readonly AppDbContext _dbContext;

        public TripService(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        // ---------------------------
        // READ: Get all trips
        // ---------------------------
        public async Task<IEnumerable<Trip>> GetTripsAsync()
        {
            return await _dbContext.Trips
                .Include(t => t.Driver)
                .Include(t => t.Vehicle)
                .ToListAsync();
        }

        // ---------------------------
        // READ: Get trip by ID
        // ---------------------------
        public async Task<Trip?> GetTripByIdAsync(int id)
        {
            return await _dbContext.Trips
                .Include(t => t.Driver)
                .Include(t => t.Vehicle)
                .FirstOrDefaultAsync(t => t.TripId == id);
        }

        // ---------------------------
        // CREATE: Add new trip
        // ---------------------------
        public async Task<(bool Success, string Message, Trip? Trip)> AddTripAsync(Trip trip)
        {
            // Check if driver exists and is available
            var driver = await _dbContext.Drivers.FindAsync(trip.DriverId);
            if (driver == null || !driver.DriverAvailable)
                return (false, "Driver not available or not found.", null);

            // Check if vehicle exists and is available
            var vehicle = await _dbContext.Vehicles.FindAsync(trip.VehicleId);
            if (vehicle == null || !vehicle.IsAvailable)
                return (false, "Vehicle not available or not found.", null);

            // Update availability
            driver.DriverAvailable = false;
            vehicle.IsAvailable = false;

            _dbContext.Trips.Add(trip);
            await _dbContext.SaveChangesAsync();

            return (true, "Trip created successfully.", trip);
        }

        // ---------------------------
        // UPDATE: Modify trip details
        // ---------------------------
        public async Task<(bool Success, string Message)> UpdateTripAsync(int id, Trip updatedTrip)
        {
            var existingTrip = await _dbContext.Trips.FindAsync(id);
            if (existingTrip == null)
                return (false, "Trip not found.");

            existingTrip.Source = updatedTrip.Source;
            existingTrip.Destination = updatedTrip.Destination;
            existingTrip.Startdate = updatedTrip.Startdate;
            existingTrip.Enddate = updatedTrip.Enddate;
            existingTrip.VehicleNumber = updatedTrip.VehicleNumber;

            await _dbContext.SaveChangesAsync();
            return (true, "Trip updated successfully.");
        }

        // ---------------------------
        // DELETE: Remove a trip
        // ---------------------------
        public async Task<(bool Success, string Message)> DeleteTripAsync(int id)
        {
            var trip = await _dbContext.Trips
                .Include(t => t.Driver)
                .Include(t => t.Vehicle)
                .FirstOrDefaultAsync(t => t.TripId == id);

            if (trip == null)
                return (false, "Trip not found.");

            // Restore vehicle and driver availability
            if (trip.Vehicle != null)
                trip.Vehicle.IsAvailable = true;
            if (trip.Driver != null)
                trip.Driver.DriverAvailable = true;

            _dbContext.Trips.Remove(trip);
            await _dbContext.SaveChangesAsync();

            return (true, "Trip deleted successfully.");
        }

        // ---------------------------
        // COMPLETE: End trip
        // ---------------------------
        public async Task<(bool Success, string Message)> CompleteTripAsync(int id)
        {
            var trip = await _dbContext.Trips
                .Include(t => t.Driver)
                .Include(t => t.Vehicle)
                .FirstOrDefaultAsync(t => t.TripId == id);

            if (trip == null)
                return (false, "Trip not found.");

            if (trip.Enddate.HasValue)
                return (false, "Trip already completed.");

            // Mark trip as completed
            trip.Enddate = DateTime.Now;

            // Make driver & vehicle available again
            if (trip.Vehicle != null)
                trip.Vehicle.IsAvailable = true;
            if (trip.Driver != null)
                trip.Driver.DriverAvailable = true;

            await _dbContext.SaveChangesAsync();
            return (true, "Trip marked as completed successfully.");
        }

        // ---------------------------
        // READ: Get trips by driver
        // ---------------------------
        public async Task<IEnumerable<Trip>> GetByDriverAsync(int driverId)
        {
            return await _dbContext.Trips
                .Include(t => t.Vehicle)
                .Where(t => t.DriverId == driverId)
                .ToListAsync();
        }

        public async Task<IEnumerable<Trip>> GetTripsLongerThanHoursAsync(double hours)
        {
            // Get all trips with driver & vehicle included
            var trips = await _dbContext.Trips
                .Include(t => t.Driver)
                .Include(t => t.Vehicle)
                .Where(t => t.Enddate.HasValue) // Only completed trips
                .ToListAsync();

            // Filter trips longer than specified hours
            return trips
                .Where(t => (t.Enddate.Value - t.Startdate).TotalHours > hours)
                .ToList();
        }


    }
}
