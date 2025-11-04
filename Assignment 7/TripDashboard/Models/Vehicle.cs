using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace TripEntity5.Models

{
    public class Vehicle
    {
        [Key]
        public int VehicleId { get; set; }
        
        [Required]
        public String VehicleNumber { get; set; }
        public String Type { get; set; } = string.Empty;

        public bool IsAvailable { get; set; }

        [JsonIgnore]
        public ICollection<Trip>? Trips { get; set; } = new List<Trip>();

    }
}
