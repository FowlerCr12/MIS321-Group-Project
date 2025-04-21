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
        
        // GET: api/trainerrequests/pending
        [HttpGet("pending")] // gets all pending trainer requests
        public async Task<List<TrainerRequest>> GetPendingRequests()
        {
            Database myDatabase = new();
            return await myDatabase.GetPendingTrainerRequestsAsync();
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
        
        // PUT: api/trainerrequests/approve/{id}
        [HttpPut("approve/{id}")] // approve a specific trainer request
        public async Task<IActionResult> ApproveRequest(int id)
        {
            Console.WriteLine($"Approving request {id}"); // prints to console for debugging
            Database myDatabase = new();
            bool success = await myDatabase.ApproveTrainerRequestAsync(id);
            
            if (success){
                return Ok(new { success = true, message = "Trainer request approved successfully" });
            }
            else {
                return NotFound($"Trainer request with id {id} not found");
            }
        }

        // PUT: api/trainerrequests/denied/{id}
        [HttpPut("deny/{id}")] // deny a specific trainer request
        public async Task<IActionResult> DenyRequest(int id)
        {
            Console.WriteLine($"Denying request {id}"); // prints to console for debugging
            Database myDatabase = new();
            bool success = await myDatabase.DenyTrainerRequestAsync(id);
            
            if (success){
                return Ok(new { success = true, message = "Trainer request denied successfully" });
            }
            else {
                return NotFound($"Trainer request with id {id} not found");
            }
        }
    }
}