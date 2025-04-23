using System;

namespace API.Models
{
    public class TrainerRequest    
    {
        public int requestID { get; set; }
        public string? requestStatus { get; set; }
        public int trainerID { get; set; }
        public int classID { get; set; }
    }
}
