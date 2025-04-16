using System;
using System;
using API.Databases;
using API.Models;

namespace API
{
    public class DatabaseAdminTest
    {
        public static async Task RunTest()
        {
            try
            {
                Console.WriteLine("Starting Admin Database Test...");
                var db = new Database();
                
                // Get all users
                var admins = await db.GetAllAdmins();
                
                Console.WriteLine("\nAll Admins in Database:");
                Console.WriteLine("---------------------");
                foreach (var admin in admins)
                {
                    Console.WriteLine($"ID: {admin.adminID}");
                    Console.WriteLine($"Name: {admin.adminName}");
                    Console.WriteLine($"Email: {admin.adminEmail}");
                    Console.WriteLine($"Password: {admin.adminPassword}");
                    Console.WriteLine("---------------------");
                }
                
                Console.WriteLine($"\nTotal Admins Found: {admins.Count}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error occurred: {ex.Message}");
                Console.WriteLine($"Stack Trace: {ex.StackTrace}");
            }
        }
    }
}
