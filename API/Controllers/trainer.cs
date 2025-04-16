using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using API.Models; // adds connection so that it knows what "Book" is
//using API.Models.Interfaces; // adds so it knows what IGetAllBooks is
using API.Databases;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class TrainersController : ControllerBase
    {
        // GET: api/<shops>
        [HttpGet] // gets all of the shops from the database
        public async Task<List<Trainer>> Get()
        {
            Database myDatabase = new();
            return await myDatabase.GetAllTrainers();
        }

        // GET: api/shops/id
        [HttpGet("{id}")] // gets a shop from the database bu the id of the shop
        public async Task<Trainer> Get(int id)
        {
            Database myDatabase = new();
            return (await myDatabase.GetTrainer(id)).FirstOrDefault();
        }

        // POST api/<shops>
        [HttpPost] // adds a new shop to the database
        public async Task Post([FromBody] Trainer value)
        {
            Console.WriteLine(value.trainerName);
            Database myDatabase = new();
            await myDatabase.InsertTrainer(value);
        }


        // DELETE api/<shops>/5
        [HttpDelete("{id}")] // deletes a shop from the database
        public async Task Delete(int id)
        {
            Database myDatabase = new();
            await myDatabase.DeleteTrainer(id);
            Console.WriteLine(id); // prints the id for denbugging purposes
        }

        [HttpPut("{id}")] // updates a shop in the database
        public async Task Put(int id, [FromBody] Trainer value)
        {
            Console.WriteLine(value.trainerName); // prints the shopname to the console for testing or debugging
            Database myDatabase = new();
            await myDatabase.UpdateTrainer(value, id); // updates the shop in the database
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                Database myDatabase = new(); // creates the database class
                var trainers = await myDatabase.GetAllTrainers(); // gets all of the admins from the database

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
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    success = false,
                    message = "An error occured. Please try again."
                });
            }
        }
    }

    public class LoginRequestTrainer
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

}
