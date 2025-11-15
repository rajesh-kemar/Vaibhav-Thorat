using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace TripEntity5.Models

{
    public class Vehicle
    {
        [Key]
        public int VehicleId { get; set; }

        [Required(ErrorMessage = "Vehicle number is required.")]
        [RegularExpression(@"^[A-Z]{2}\d{2}-[A-Z]{2}-\d{4}$",
            ErrorMessage = "Vehicle number must be in the format 'MH12-AB-1234'.")]
        [StringLength(13, ErrorMessage = "Vehicle number cannot exceed 13 characters.")]
        public string VehicleNumber { get; set; }

        [Required(ErrorMessage = "Vehicle type is required.")]
        [StringLength(50, ErrorMessage = "Vehicle type cannot exceed 50 characters.")]
        public string Type { get; set; } = string.Empty;

        [Required(ErrorMessage = "Capacity is required.")]
        [Range(1, 100, ErrorMessage = "Capacity must be between 1 and 100.")]
        public int Capacity { get; set; }

        public bool IsAvailable { get; set; } = true;

        [JsonIgnore]
        public ICollection<Trip>? Trips { get; set; } = new List<Trip>();
    }
}
