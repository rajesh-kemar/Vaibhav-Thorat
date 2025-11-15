using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TripDashboard.Models;

namespace TripEntity5.Models
{
    public class Trip
    {
        [Key]
        public int TripId { get; set; }

        // Driver is optional, must exist if assigned
        [ForeignKey("Driver")]
        public int? DriverId { get; set; }

        // Vehicle is optional, must exist if assigned
        [ForeignKey("Vehicle")]
        public int? VehicleId { get; set; }

        [Required(ErrorMessage = "Vehicle number is required.")]
        [RegularExpression(@"^[A-Z]{2}\d{2}-[A-Z]{2}-\d{4}$",
            ErrorMessage = "Vehicle number must be in format 'MH12-AB-1234'.")]
        [StringLength(13, ErrorMessage = "Vehicle number cannot exceed 13 characters.")]
        public string VehicleNumber { get; set; } = string.Empty;

        [Required(ErrorMessage = "Source is required.")]
        [StringLength(100, ErrorMessage = "Source cannot exceed 100 characters.")]
        public string Source { get; set; } = string.Empty;

        [Required(ErrorMessage = "Destination is required.")]
        [StringLength(100, ErrorMessage = "Destination cannot exceed 100 characters.")]
        public string Destination { get; set; } = string.Empty;

        [Required(ErrorMessage = "Start date is required.")]
        public DateTime Startdate { get; set; } = DateTime.Now;

        public DateTime? Enddate { get; set; }

        [Required]
        [StringLength(20)]
        public string Status { get; set; } 

        // Navigation properties
        public Driver? Driver { get; set; }
        public Vehicle? Vehicle { get; set; }
    }
}
