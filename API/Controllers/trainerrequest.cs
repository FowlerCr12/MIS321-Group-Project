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
        // GET: api/trainerrequests
        [HttpGet] // gets all of the trainer requests from the database
        public async Task<List<TrainerRequest>> Get()
        {
            Database myDatabase = new();
            return await myDatabase.GetAllTrainerRequests();
        }

        // GET: api/trainerrequests/id
        [HttpGet("{id}")] // gets a trainer request from the database bu the id of the trainer request
        public async Task<TrainerRequest> Get(int id)
        {
            Database myDatabase = new();
            return (await myDatabase.GetTrainerRequest(id)).FirstOrDefault();
        }
        
        // GET: api/trainerrequests/pending
        [HttpGet("pending")] // gets all pending trainer requests
        public async Task<IActionResult> GetPendingRequests()
        {

            Database myDatabase = new();
            var requests = await myDatabase.GetPendingTrainerRequestsAsync();
            return Ok(requests);
        }

        // POST api/<trainerrequests>
        [HttpPost] // adds a new trainer request to the database
        public async Task Post([FromBody] TrainerRequest value)
        {
            Database myDatabase = new();
            await myDatabase.InsertTrainerRequest(value);
        }


        // DELETE api/<trainerrequests>/5
        [HttpDelete("{id}")] // deletes a trainer request from the database
        public async Task Delete(int id)
        {
            Database myDatabase = new();
            await myDatabase.DeleteTrainerRequest(id);
        }

        [HttpPut("{id}")] // updates a trainer request in the database
        public async Task Put(int id, [FromBody] TrainerRequest value)
        {
            Database myDatabase = new();
            await myDatabase.UpdateTrainerRequest(value, id); // updates the trainer request in the database
        }
        
        // PUT: api/trainerrequests/approve/{id}
        [HttpPut("approve/{id}")] // approve a specific trainer request
        public async Task<IActionResult> ApproveRequest(int id)
        {
            Database myDatabase = new();
            bool success = await myDatabase.ApproveTrainerRequestAsync(id);
            
                if (success){
                    return Ok(new { success = true, message = "Trainer request approved successfully" });
                }
                else {
                    return NotFound($"Trainer request with id {id} not found");
            }
        }

        // PUT: api/trainerrequests/deny/{id}
        [HttpPut("deny/{id}")] // deny a specific trainer request
        public async Task<IActionResult> DenyRequest(int id)
        {
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