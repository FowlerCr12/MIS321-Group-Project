using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using API.Models; // adds connection so that it knows what "Book" is
//using API.Models.Interfaces; // adds so it knows what IGetAllBooks is
using API.Databases;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class EnrollController : ControllerBase
    {
        // GET: api/<shops>
        [HttpGet] // gets all of the shops from the database
        public async Task<List<Enroll>> Get()
        {
            Database myDatabase = new();
            return await myDatabase.GetAllEnrolls();
        }

        // GET: api/shops/id
        [HttpGet("{id}")] // gets a shop from the database bu the id of the shop
        public async Task<Enroll> Get(int id)
        {
            Database myDatabase = new();
            return (await myDatabase.GetEnroll(id)).FirstOrDefault();
        }

        // POST api/<shops>
        [HttpPost] // adds a new shop to the database
        public async Task Post([FromBody] Enroll value)
        {
            Console.WriteLine(value.userID);
            Database myDatabase = new();
            await myDatabase.InsertEnroll(value);
        }


        // DELETE api/<shops>/5
        [HttpDelete("{id}")] // deletes a shop from the database
        public async Task Delete(int id)
        {
            Database myDatabase = new();
            await myDatabase.DeleteEnroll(id);
            Console.WriteLine(id); // prints the id for denbugging purposes
        }

        [HttpPut("{id}")] // updates a shop in the database
        public async Task Put(int id, [FromBody] Enroll value)
        {
            Console.WriteLine(value.userID); // prints the shopname to the console for testing or debugging
            Database myDatabase = new();
            await myDatabase.UpdateEnroll(value, id); // updates the shop in the database
        }

        // GET: api/enroll/counts
        [HttpGet("counts")]
        public async Task<Dictionary<int, int>> GetEnrollmentCounts()
        {
            Database myDatabase = new();
            return await myDatabase.GetEnrollmentCountsByClass();
        }
    }
}
