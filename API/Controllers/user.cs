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
        // GET: api/<shops>
        [HttpGet] // gets all of the shops from the database
        public async Task<List<User>> Get()
        {
            Database myDatabase = new();
            return await myDatabase.GetAllUsers();
        }

        // GET: api/shops/id
        [HttpGet("{id}")] // gets a shop from the database bu the id of the shop
        public async Task<User> Get(int id)
        {
            Database myDatabase = new();
            return (await myDatabase.GetUser(id)).FirstOrDefault();
        }

        // POST api/<shops>
        [HttpPost] // adds a new shop to the database
        public async Task Post([FromBody] User value)
        {
            Console.WriteLine(value.userName);
            Database myDatabase = new();
            await myDatabase.InsertShop(value);
        }


        // DELETE api/<shops>/5
        [HttpDelete("{id}")] // deletes a shop from the database
        public async Task Delete(int id)
        {
            Database myDatabase = new();
            await myDatabase.DeleteUser(id);
            Console.WriteLine(id); // prints the id for denbugging purposes
        }

        [HttpPut("{id}")] // updates a shop in the database
        public async Task Put(int id, [FromBody] User value)
        {
            Console.WriteLine(value.userName); // prints the shopname to the console for testing or debugging
            Database myDatabase = new();
            await myDatabase.UpdateUser(value, id); // updates the shop in the database
        }
    }
}
