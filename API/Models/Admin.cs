using System;

namespace API.Models
{
    public class Admin
    {
        public int adminID { get; set; }
        public string? adminEmail { get; set; }
        public string? adminName { get; set; }
        public string? adminPassword { get; set; }
    }
}
