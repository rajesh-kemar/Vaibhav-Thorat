namespace TripDashboard1.Models.Dto
{
    public class LoginResponse
    {
        public int UserId { get; set; }
        public string? Name { get; set; }
        public string? Role { get; set; }
        public int? DriverId { get; set; }
        public string Token { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
    }
}
