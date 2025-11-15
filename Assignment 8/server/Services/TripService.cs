using Microsoft.EntityFrameworkCore;
using TripDashboard.Data;
using TripDashboard.Models;
using TripDashboard1.Interfaces;
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
                    .ThenInclude(d => d.User)   // ✅ Include the User for each Driver
                .Include(t => t.Vehicle)
                .ToListAsync();
        }


        public async Task<(IEnumerable<Trip> Trips, int TotalCount)> GetPagedTripsAsync(int pageNumber, int pageSize)
        {
            var totalCount = await _dbContext.Trips.CountAsync();

            var trips = await _dbContext.Trips
                .Include(t => t.Driver)
                    .ThenInclude(d => d.User)
                .Include(t => t.Vehicle)
                .OrderByDescending(t => t.Startdate)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (trips, totalCount);
        }


        // ---------------------------
        // READ: Get trip by ID
        // ---------------------------
        public async Task<Trip?> GetTripByIdAsync(int id)
        {
            return await _dbContext.Trips
                .Include(t => t.Driver)
                    .ThenInclude(d => d.User)   // ✅
                .Include(t => t.Vehicle)
                .FirstOrDefaultAsync(t => t.TripId == id);
        }

        // ---------------------------
        // CREATE: Add new trip
        // ---------------------------
        public async Task<(bool Success, string Message, Trip? Trip)> AddTripAsync(Trip trip)
        {
            var driver = await _dbContext.Drivers.FindAsync(trip.DriverId);
            if (driver == null || !driver.DriverAvailable)
                return (false, "Driver not available or not found.", null);

            var vehicle = await _dbContext.Vehicles.FindAsync(trip.VehicleId);
            if (vehicle == null || !vehicle.IsAvailable)
                return (false, "Vehicle not available or not found.", null);

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
                    .ThenInclude(d => d.User)   // ✅ (optional, good for full object)
                .Include(t => t.Vehicle)
                .FirstOrDefaultAsync(t => t.TripId == id);

            if (trip == null)
                return (false, "Trip not found.");

            if (trip.Vehicle != null)
                trip.Vehicle.IsAvailable = true;
            if (trip.Driver != null)
                trip.Driver.DriverAvailable = true;

            _dbContext.Trips.Remove(trip);
            await _dbContext.SaveChangesAsync();

            return (true, "Trip deleted successfully.");
        }

     
        public async Task<(bool Success, string Message, Trip? UpdatedTrip)> CompleteTripAsync(int id)
        {
            var trip = await _dbContext.Trips
                .Include(t => t.Driver)
                    .ThenInclude(d => d.User)
                .Include(t => t.Vehicle)
                .FirstOrDefaultAsync(t => t.TripId == id);

            if (trip == null)
                return (false, "Trip not found.", null);

            if (trip.Enddate.HasValue && trip.Status == "completed")
                return (false, "Trip already completed.", trip);

            // ✅ Update trip status and end date
            trip.Enddate = DateTime.Now;
            trip.Status = "completed";

            // ✅ Free up driver and vehicle
            if (trip.Vehicle != null)
                trip.Vehicle.IsAvailable = true;

            if (trip.Driver != null)
                trip.Driver.DriverAvailable = true;

            await _dbContext.SaveChangesAsync();

            return (true, "Trip marked as completed successfully.", trip);
        }


        // ---------------------------
        // READ: Get trips by driver
        // ---------------------------
        public async Task<IEnumerable<Trip>> GetByDriverAsync(int driverId)
        {
            return await _dbContext.Trips
                .Include(t => t.Driver)
                    .ThenInclude(d => d.User)   // ✅ this is needed
                .Include(t => t.Vehicle)
                .Where(t => t.DriverId == driverId)
                .ToListAsync();
        }

        // ---------------------------
        // Trips longer than X hours
        // ---------------------------
        public async Task<IEnumerable<Trip>> GetTripsLongerThanHoursAsync(double hours)
        {
            var trips = await _dbContext.Trips
                .Include(t => t.Driver)
                    .ThenInclude(d => d.User)
                .Include(t => t.Vehicle)
                .Where(t => t.Enddate.HasValue)
                .ToListAsync();

            return trips
                .Where(t => (t.Enddate.Value - t.Startdate).TotalHours > hours)
                .ToList();
        }

        // ---------------------------
        // Stored procedure summary
        // ---------------------------
        public async Task<DriverTripSummary?> GetDriverTripSummaryAsync(int driverId)
        {
            var summary = _dbContext.DriverTripSummaries
                .FromSqlRaw("EXEC GetDriverTripSummary @DriverId = {0}", driverId)
                .AsNoTracking()
                .AsEnumerable()
                .FirstOrDefault();

            return summary;
        }
    }
}
