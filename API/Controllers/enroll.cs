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
        // GET: api/<enrolls>
        [HttpGet] // gets all of the enrolls from the database
        public async Task<List<Enroll>> Get()
        {
            Database myDatabase = new();
            return await myDatabase.GetAllEnrolls();
        }

        // GET: api/enrolls/id
        [HttpGet("{id}")] // gets a enroll from the database bu the id of the enroll
        public async Task<Enroll> Get(int id)
        {
            Database myDatabase = new();
            return (await myDatabase.GetEnroll(id)).FirstOrDefault();
        }

        // POST api/<enrolls>
        [HttpPost] // adds a new enroll to the database
        public async Task Post([FromBody] Enroll value)
        {
            Database myDatabase = new();
            await myDatabase.InsertEnroll(value);
        }


        // DELETE api/<enrolls>/5
        [HttpDelete("{id}")] // deletes a enroll from the database
        public async Task Delete(int id)
        {
            Database myDatabase = new();
            await myDatabase.DeleteEnroll(id);
        }

        [HttpPut("{id}")] // updates a enroll in the database
        public async Task Put(int id, [FromBody] Enroll value)
        {
            Database myDatabase = new();
            await myDatabase.UpdateEnroll(value, id); // updates the enroll in the database
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
