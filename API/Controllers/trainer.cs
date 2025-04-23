using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using API.Models;
using API.Databases;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class TrainersController : ControllerBase
    {
        // GET: api/trainers
        [HttpGet] // gets all of the trainers from the database
        public async Task<List<Trainer>> Get()
        {
            Database myDatabase = new();
            return await myDatabase.GetAllTrainers();
        }

        // GET: api/trainers/id
        [HttpGet("{id}")] // gets a trainer from the database bu the id of the trainer
        public async Task<Trainer> Get(int id)
        {
            Database myDatabase = new();
            return (await myDatabase.GetTrainer(id)).FirstOrDefault();
        }

        // POST api/<trainers>
        [HttpPost] // adds a new trainer to the database
        public async Task Post([FromBody] Trainer value)
        {
            Database myDatabase = new();
            await myDatabase.InsertTrainer(value);
        }

        // DELETE api/<trainers>/5
        [HttpDelete("{id}")] // deletes a trainer from the database
        public async Task Delete(int id)
        {
            Database myDatabase = new();
            await myDatabase.DeleteTrainer(id);
        }

        [HttpPut("{id}")] // updates a trainer in the database
        public async Task Put(int id, [FromBody] Trainer value)
        {
            Database myDatabase = new();
            await myDatabase.UpdateTrainer(value, id);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            
                Database myDatabase = new(); // creates the database class
                var trainers = await myDatabase.GetAllTrainers(); // gets all of the trainers from the database

                Trainer trainer = null;
                for (int i = 0; i < trainers.Count; i++) // loops thorugh the array of users to find if any of them match the provided email and password in the login form. 
                {
                    if (trainers[i].trainerEmail.ToLower() == request.Email.ToLower() && trainers[i].trainerPassword == request.Password)
                    {
                        trainer = trainers[i];
                        break;
                    }
                }

                if (trainer != null) // makes sure the user is found then returns the User back with the information below. 
                {
                    return new JsonResult(new
                    {
                        success = true,
                        trainer = new
                        {
                            id = trainer.trainerID,
                            email = trainer.trainerEmail,
                            name = trainer.trainerName
                        }
                    });
                }
                return new JsonResult(new // returns this json message if the password or email did not match.
                {
                    success = false,
                    message = "Invalid email or password"
                });

        }
    }

    public class LoginRequestTrainer
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

}
