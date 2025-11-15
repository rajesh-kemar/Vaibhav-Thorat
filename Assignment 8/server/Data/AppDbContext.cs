using Microsoft.EntityFrameworkCore;
using TripDashboard.Models;
using TripEntity5.Models;

namespace TripDashboard.Data
{
    public class AppDbContext : DbContext
    {
        
        public AppDbContext (DbContextOptions<AppDbContext> options) : base(options)
        {

        }

        public DbSet <Driver> Drivers { get; set; }

        public DbSet<Trip> Trips { get; set; }
        public DbSet<Vehicle> Vehicles { get; set; }
        public DbSet<User> Users { get; set; }
  
        //public DbSet<AuthenticatedUser> AuthenticatedUsers { get; set; }

        public DbSet<DriverTripSummary> DriverTripSummaries { get; set; } // Add this line

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Driver → Trip
            modelBuilder.Entity<Trip>()
                .HasOne(t => t.Driver)
                .WithMany(d => d.Trips)
                .HasForeignKey(t => t.DriverId)
                .OnDelete(DeleteBehavior.Restrict); // Prevent cascade delete

            // Vehicle → Trip
            modelBuilder.Entity<Trip>()
                .HasOne(t => t.Vehicle)
                .WithMany(v => v.Trips)
                .HasForeignKey(t => t.VehicleId)
                .OnDelete(DeleteBehavior.Restrict); // Prevent cascade delete

            // ✅ Unique constraint for VehicleNumber
            modelBuilder.Entity<Vehicle>()
                .HasIndex(v => v.VehicleNumber)
                .IsUnique();


            modelBuilder.Entity<User>()
             .HasIndex(u => u.Email)
             .IsUnique();

            modelBuilder.Entity<User>()
                .HasIndex(u => u.UserName)
                .IsUnique();

            // One-to-one relationship: User → Driver
            modelBuilder.Entity<User>()
                .HasOne(u => u.DriverProfile)
                .WithOne(d => d.User)
                .HasForeignKey<Driver>(d => d.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // ✅ Unique constraint for LicenceNumber
            modelBuilder.Entity<Driver>()
               .HasIndex(d => d.LicenceNumber)
               .IsUnique();

            // ✅ Configure DriverTripSummary as keyless
            modelBuilder.Entity<DriverTripSummary>(eb =>
            {
                eb.HasNoKey();        // Mark as keyless
                eb.ToView(null);      // Tell EF Core this is not a table
            });
        }

    }
}
