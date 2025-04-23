using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using API.Models; // adds connection so that it knows what "Book" is
//using API.Models.Interfaces; // adds so it knows what IGetAllBooks is
using API.Databases;

namespace API.Controllers
{
        [Route("api/[controller]")]
        [ApiController]

    public class AdminsController : ControllerBase
    {
        // GET: api/<shops>
        [HttpGet] // gets all of the shops from the database
        public async Task<List<Admin>> Get()
        {
            Database myDatabase = new();
            return await myDatabase.GetAllAdmins();
        }

        // GET: api/shops/id
        [HttpGet("{id}")] // gets a shop from the database bu the id of the shop
        public async Task<Admin> Get(int id)
        {
            Database myDatabase = new();
            return (await myDatabase.GetAdmin(id)).FirstOrDefault();
        }

        // POST api/<shops>
        [HttpPost] // adds a new shop to the database
        public async Task Post([FromBody] Admin value)
        {
            Database myDatabase = new();
            await myDatabase.InsertAdmin(value);
        }


        // DELETE api/<shops>/5
        [HttpDelete("{id}")] // deletes a shop from the database
        public async Task Delete(int id)
        {
            Database myDatabase = new();
            await myDatabase.DeleteAdmin(id);
        }

        [HttpPut("{id}")] // updates a shop in the database
        public async Task Put(int id, [FromBody] Admin value)
        {
            Database myDatabase = new();
            await myDatabase.UpdateAdmin(value, id); // updates the shop in the database
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestAdmin request)
        {
            try
            {
                Database myDatabase = new(); // creates the database class
                var admins = await myDatabase.GetAllAdmins(); // gets all of the admins from the database
                Admin admin = null;
                for(int i = 0; i < admins.Count; i++) // loops thorugh the array of users to find if any of them match the provided email and password in the login form. 
                {
                    if(admins[i].adminEmail.ToLower() == request.Email.ToLower() && admins[i].adminPassword == request.Password)
                    {
                        admin = admins[i];
                        break;
                    }
                }

                if (admin != null) // makes sure the user is found then returns the User back with the information below. 
                {
                    return new JsonResult(new
                    {
                        success = true,
                        admin = new{
                            id = admin.adminID,
                            email = admin.adminEmail,
                            name = admin.adminName
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

    public class LoginRequestAdmin
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
        
}
