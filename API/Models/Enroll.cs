
using System;

namespace API.Models
{
    public class Enroll
    {
        public int enrollmentID { get; set; }
        public string? enrollmentTimeStatus { get; set; }
        public int classID { get; set; }
        public int userID { get; set; }
    }
}
