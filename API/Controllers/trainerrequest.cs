using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using API.Models; // adds connection so that it knows what "Book" is
//using API.Models.Interfaces; // adds so it knows what IGetAllBooks is
using API.Databases;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class TrainerRequestsController : ControllerBase
    {
        // GET: api/<shops>
        [HttpGet] // gets all of the shops from the database
        public async Task<List<TrainerRequest>> Get()
        {
            Database myDatabase = new();
            return await myDatabase.GetAllTrainerRequests();
        }

        // GET: api/shops/id
        [HttpGet("{id}")] // gets a shop from the database bu the id of the shop
        public async Task<TrainerRequest> Get(int id)
        {
            Database myDatabase = new();
            return (await myDatabase.GetTrainerRequest(id)).FirstOrDefault();
        }

        // POST api/<shops>
        [HttpPost] // adds a new shop to the database
        public async Task Post([FromBody] TrainerRequest value)
        {
            Console.WriteLine(value.requestID);
            Database myDatabase = new();
            await myDatabase.InsertTrainerRequest(value);
        }


        // DELETE api/<shops>/5
        [HttpDelete("{id}")] // deletes a shop from the database
        public async Task Delete(int id)
        {
            Database myDatabase = new();
            await myDatabase.DeleteTrainerRequest(id);
            Console.WriteLine(id); // prints the id for denbugging purposes
        }

        [HttpPut("{id}")] // updates a shop in the database
        public async Task Put(int id, [FromBody] TrainerRequest value)
        {
            Console.WriteLine(value.requestID); // prints the shopname to the console for testing or debugging
            Database myDatabase = new();
            await myDatabase.UpdateTrainerRequest(value, id); // updates the shop in the database
        }

    }


}
