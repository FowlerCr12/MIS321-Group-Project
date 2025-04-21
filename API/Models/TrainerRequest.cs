using System;

namespace API.Models
{
    public class TrainerRequest    
    {
        public int requestID { get; set; }
        public string? requestStatus { get; set; }
        public string? requestClassType { get; set; }
        public string? trainerID { get; set; }
        public bool? approved { get; set; } = false;
    }
}
