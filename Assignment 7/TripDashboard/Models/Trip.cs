using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace TripEntity5.Models
{
    public class Trip
    {
        [Key]
        public int TripId { get; set; }


        [ForeignKey("Driver")]
        public int DriverId { get; set; }


        [ForeignKey("Vehicle")]
        public int VehicleId { get; set; }

        public string VehicleNumber { get; set; }
        public string Source { get; set; } = string.Empty;
        public string Destination { get; set; } = string.Empty;
        public DateTime Startdate { get; set; } = DateTime.Now;
        public DateTime? Enddate { get; set; }
        public string Status  => Enddate.HasValue ? "completed" :"InProgress";

        public Driver? Driver { get; set; }
        public Vehicle? Vehicle { get; set; }

    }
}
