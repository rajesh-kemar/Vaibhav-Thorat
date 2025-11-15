namespace TripDashboard1.Models.Dto
{
    public class RegisterRequest
    {
        public string Name { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;

        // Driver specific
        public string? LicenceNumber { get; set; }
        public int? Experience { get; set; }
    }

}
