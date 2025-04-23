using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using API.Models;
using API.Databases;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class TeachesController : ControllerBase
    {
        // GET: api/<teaches>
        [HttpGet] // gets all of the teaches from the database
        public async Task<List<Teaches>> Get()
        {
            Database myDatabase = new();
            return await myDatabase.GetAllTeaches();
        }

        // GET: api/teaches/id
        [HttpGet("{id}")] // gets a teach from the database bu the id of the teach
        public async Task<Teaches> Get(int id)
        {
            Database myDatabase = new();
            return (await myDatabase.GetTeaches(id)).FirstOrDefault();
        }

        // POST api/<teaches>
        [HttpPost] // adds a new teach to the database
        public async Task Post([FromBody] Teaches value)
        {
            Database myDatabase = new();
            await myDatabase.InsertTeaches(value);
        }


        // DELETE api/<teaches>/5
        [HttpDelete("{id}")] // deletes a teach from the database
        public async Task Delete(int id)
        {
            Database myDatabase = new();
            await myDatabase.DeleteTeaches(id);
        }

        [HttpPut("{id}")] // updates a teach in the database
        public async Task Put(int id, [FromBody] Teaches value)
        {
            Database myDatabase = new();
            await myDatabase.UpdateTeaches(value, id); // updates the teach in the database
        }

    }

}
