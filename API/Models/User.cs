using System;

namespace API.Models
{
    public class User
    {
        public int userID { get; set; }
        public string? userEmail { get; set; }
        public string? userName { get; set; }
        public string? userPassword { get; set; }
        public string? userPayment { get; set; }
    }
}
