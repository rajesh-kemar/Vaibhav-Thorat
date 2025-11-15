using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using TripEntity5.Models;

namespace TripDashboard.Models
{
    public class Driver
    {
        [Key]
        public int DriverId { get; set; }

        [Required]
        public int UserId { get; set; }

     
        [ForeignKey("UserId")]
        public User User { get; set; } 

        [Required(ErrorMessage = "Licence number is required.")]
        [RegularExpression(@"^[A-Z]{2}\d{2}-\d{5,7}$", ErrorMessage = "Licence number must be in the format 'MH40-12345'.")]
        [StringLength(20, ErrorMessage = "Licence number cannot exceed 20 characters.")]
        public string LicenceNumber { get; set; } = string.Empty;

        [Range(0, 50, ErrorMessage = "Experience must be between 0 and 50 years.")]
        public int Experience { get; set; }

        public bool DriverAvailable { get; set; } = true;

        [JsonIgnore]
        public ICollection<Trip>? Trips { get; set; } = new List<Trip>();
    }
}
