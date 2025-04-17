using System;
using System;
using API.Databases;
using API.Models;

namespace API
{
    public class DatabaseTeachesTest
    {
        public static async Task RunTest()
        {
            try
            {
                Console.WriteLine("Starting Teaches Database Test...");
                var db = new Database();

                // Get all users
                var admins = await db.GetAllTeaches();

                Console.WriteLine("\nAll Admins in Database:");
                Console.WriteLine("---------------------");
                foreach (var admin in admins)
                {
                    Console.WriteLine($"Trainer ID: {admin.trainerID}");
                    Console.WriteLine($"Class ID: {admin.classID}");
                    Console.WriteLine("---------------------");
                }

                Console.WriteLine($"\nTotal Teaches Found: {admins.Count}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error occurred: {ex.Message}");
                Console.WriteLine($"Stack Trace: {ex.StackTrace}");
            }
        }
    }
}
