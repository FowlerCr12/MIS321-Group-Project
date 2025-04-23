using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using API.Models;
using API.Databases;
namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PetsController : ControllerBase
    {
        // GET: api/<pets>
        [HttpGet] // gets all of the pets from the database
        public async Task<List<Pet>> Get()
        {
            Database myDatabase = new();
            return await myDatabase.GetAllPets();
        }

        // GET: api/pets/id
        [HttpGet("{id}")] // gets a pet from the database bu the id of the pet
        public async Task<Pet> Get(int id)
        {
            Database myDatabase = new();
            return (await myDatabase.GetPet(id)).FirstOrDefault();
        }

        // POST api/<pets>
        [HttpPost] // adds a new pet to the database
        public async Task Post([FromBody] Pet value)
        {
            Database myDatabase = new();
            await myDatabase.InsertPet(value);
        }


        // DELETE api/<pets>/5
        [HttpDelete("{id}")] // deletes a pet from the database
        public async Task Delete(int id)
        {
            Database myDatabase = new();
            await myDatabase.DeletePet(id);
        }

        [HttpPut("{id}")] // updates a pet in the database
        public async Task Put(int id, [FromBody] Pet value)
        {
            Database myDatabase = new();
            await myDatabase.UpdatePet(value, id); // updates the pet in the database
        }
    }
}
