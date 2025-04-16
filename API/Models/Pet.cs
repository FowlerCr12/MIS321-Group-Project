using System;

namespace API.Models
{
    public class Pet
    {
        public int petID { get; set; }
        public string? petName { get; set; }
        public string? petType { get; set; }
        public int petAge { get; set; }
        public int petWeight { get; set; }
        public string? petBreed { get; set; }
        public int userID { get; set; }
    }
}
