using System;

namespace API.Models
{
    public class Class
    {
        public int classID { get; set; }
        public TimeSpan? classTime { get; set; }
        public DateTime? classDate { get; set; }
        public string? classType { get; set; }
        public string? className { get; set; }
        public Int32? classCapacity { get; set; }
        public string? classAllowedPetTypes { get; set; }
    }
}
