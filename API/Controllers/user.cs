using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using API.Models; // adds connection so that it knows what "Book" is
//using API.Models.Interfaces; // adds so it knows what IGetAllBooks is
using API.Databases;
namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        // GET: api/<users>
        [HttpGet] // gets all of the users from the database
        public async Task<List<User>> Get()
        {
            Database myDatabase = new();
            return await myDatabase.GetAllUsers();
        }

        // GET: api/users/id
        [HttpGet("{id}")] // gets a user from the database bu the id of the user
        public async Task<User> Get(int id)
        {
            Database myDatabase = new();
            return (await myDatabase.GetUser(id)).FirstOrDefault();
        }

        // POST api/<users>
        [HttpPost] // adds a new user to the database
        public async Task Post([FromBody] User value)
        {
            Database myDatabase = new();
            await myDatabase.InsertUser(value);
        }


        // DELETE api/<users>/5
        [HttpDelete("{id}")] // deletes a user from the database
        public async Task Delete(int id)
        {
            Database myDatabase = new();
            await myDatabase.DeleteUser(id);
        }

        [HttpPut("{id}")] // updates a user in the database
        public async Task Put(int id, [FromBody] User value)
        {
            Database myDatabase = new();
            await myDatabase.UpdateUser(value, id); // updates the user in the database
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                Database myDatabase = new(); // creates the database class
                var users = await myDatabase.GetAllUsers(); // gets all of the users from the database
                
                User user = null;
                for(int i = 0; i < users.Count; i++) // loops thorugh the array of users to find if any of them match the provided email and password in the login form. 
                {
                    if(users[i].userEmail.ToLower() == request.Email.ToLower() && users[i].userPassword == request.Password)
                    {
                        user = users[i];
                        break;
                    }
                }

                if (user != null) // makes sure the user is found then returns the User back with the information below. 
                {
                    return new JsonResult(new
                    {
                        success = true,
                        user = new{
                            id = user.userID,
                            email = user.userEmail,
                            name = user.userName
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

    public class LoginRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

}
