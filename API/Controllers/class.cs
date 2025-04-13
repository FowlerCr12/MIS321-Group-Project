using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using API.Models; // adds connection so that it knows what "Book" is
//using API.Models.Interfaces; // adds so it knows what IGetAllBooks is
using API.Databases;
namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClassesController : ControllerBase
    {
        // GET: api/<classes>
        [HttpGet] // gets all of the classes from the database
        public async Task<List<Class>> Get()
        {
            Database myDatabase = new();
            return await myDatabase.GetAllClasses();
        }

        // GET: api/classes/id
        [HttpGet("{id}")] // gets a class from the database bu the id of the class
        public async Task<Class> Get(int id)
        {
            Database myDatabase = new();
            return (await myDatabase.GetClass(id)).FirstOrDefault();
        }

        // POST api/<classes>
        [HttpPost] // adds a new class to the database
        public async Task Post([FromBody] Class value)
        {
            Console.WriteLine(value.className);
            Database myDatabase = new();
            await myDatabase.InsertClass(value);
        }


        // DELETE api/<classes>/5
        [HttpDelete("{id}")] // deletes a class from the database
        public async Task Delete(int id)
        {
            Database myDatabase = new();
            await myDatabase.DeleteClass(id);
            Console.WriteLine(id); // prints the id for denbugging purposes
        }

        [HttpPut("{id}")] // updates a class in the database
        public async Task Put(int id, [FromBody] Class value)
        {
            Console.WriteLine(value.className); // prints the classname to the console for testing or debugging
            Database myDatabase = new();
            await myDatabase.UpdateClass(value, id); // updates the class in the database
        }
    }
}
