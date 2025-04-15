using System;

namespace API.Models
{
    public class Trainer    
    {
        public int trainerID { get; set; }
        public string? trainerEmail { get; set; }
        public string? trainerName { get; set; }
        public string? trainerPassword { get; set; }
        public string? trainerSpecialization { get; set; }
    }
}
