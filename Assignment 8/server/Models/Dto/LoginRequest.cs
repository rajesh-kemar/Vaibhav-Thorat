//using System.ComponentModel.DataAnnotations;

//namespace TripDashboard.Models
//{
//    public class AuthenticatedUser
//    {
//        [Key]
//        public int Id { get; set; }

//        [Required(ErrorMessage = "Driver name is required.")]
//        [StringLength(100, ErrorMessage = "Driver name cannot exceed 100 characters.")]
//        public string DriverName { get; set; } = string.Empty;

//        [Required(ErrorMessage = "Licence number is required.")]
//        [RegularExpression(@"^[A-Z]{2}\d{2}-\d{6}$",
//            ErrorMessage = "Licence number must be in the format 'MH40-123423'.")]
//        public string LicenceNumber { get; set; } = string.Empty;

//        [Required(ErrorMessage = "Role is required.")]
//        [RegularExpression(@"^(Driver|Dispatcher)$",
//            ErrorMessage = "Role must be either 'Driver' or 'Dispatcher'.")]
//        public string Role { get; set; } = "Driver";

//        public int? DriverId { get; set; }

//        [Required(ErrorMessage = "Token is required.")]
//        public string Token { get; set; } = string.Empty;
//    }
//}


using System.ComponentModel.DataAnnotations;

public class LoginRequest
{
    [Required(ErrorMessage = "Email is required.")]
    [EmailAddress(ErrorMessage = "Invalid email format.")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Password is required.")]
    public string Password { get; set; } = string.Empty;
}
