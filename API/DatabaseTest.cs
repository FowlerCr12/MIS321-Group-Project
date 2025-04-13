using System;
using API.Databases;
using API.Models;

namespace API
{
    public class DatabaseTest
    {
        public static async Task RunTest()
        {
            try
            {
                Console.WriteLine("Starting Database Test...");
                var db = new Database();
                
                // Get all users
                var classes = await db.GetAllClasses();
                
                Console.WriteLine("\nAll Users in Database:");
                Console.WriteLine("---------------------");
                foreach (var user in classes)
                {
                    Console.WriteLine($"ID: {user.classID}");
                    Console.WriteLine($"Name: {user.className}");
                    Console.WriteLine($"Email: {user.classTime}");
                    Console.WriteLine($"Payment: {user.classCapacity}");
                    Console.WriteLine("---------------------");
                }
                
                Console.WriteLine($"\nTotal Classes Found: {classes.Count}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error occurred: {ex.Message}");
                Console.WriteLine($"Stack Trace: {ex.StackTrace}");
            }
        }
    }
} 