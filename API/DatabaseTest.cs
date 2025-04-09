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
                var users = await db.GetAllUsers();
                
                Console.WriteLine("\nAll Users in Database:");
                Console.WriteLine("---------------------");
                foreach (var user in users)
                {
                    Console.WriteLine($"ID: {user.userID}");
                    Console.WriteLine($"Name: {user.userName}");
                    Console.WriteLine($"Email: {user.userEmail}");
                    Console.WriteLine($"Payment: {user.userPayment}");
                    Console.WriteLine("---------------------");
                }
                
                Console.WriteLine($"\nTotal Users Found: {users.Count}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error occurred: {ex.Message}");
                Console.WriteLine($"Stack Trace: {ex.StackTrace}");
            }
        }
    }
} 