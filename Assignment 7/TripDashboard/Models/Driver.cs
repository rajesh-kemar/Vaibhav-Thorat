using System.Text.Json.Serialization;

namespace TripEntity5.Models
{
    public class Driver
    {
        public int DriverId { get; set; }

        public string DriverName { get; set; }
        public string LicenceNumber { get; set; }
     
        public int ExperienceYears { get; set; }

        public bool DriverAvailable { get; set; } = true;

        [JsonIgnore]
        public ICollection<Trip>? Trips { get; set; } = new List<Trip>();

    }
}
