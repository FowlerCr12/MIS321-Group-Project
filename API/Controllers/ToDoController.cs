using Microsoft.AspNetCore.Mvc;
using testwebpatutorial.Models;
namespace testwebpatutorial.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ToDoController : ControllerBase
    {
        private static List<ToDo> MyTodos = [];

        // GET: api/todo
        [HttpGet]
        public List<ToDo> Get()
        {
            return MyTodos;
        }

        // POST: api/toDo
        [HttpPost]
        public void Post([FromBody] ToDo value)
        {
            MyTodos.Add(new ToDo
            {
                ToDoId = Guid.NewGuid().ToString(),
                TodoContent = value.TodoContent,
                IsImportant = value.IsImportant,
                IsDeleted = value.IsDeleted
            });
        }

        // PUT api/toDo/5
        [HttpPut("{id}")]
        public void Put(string id, [FromBody] ToDo value)
        {
            var ToDo = MyTodos.FirstOrDefault(t => t.ToDoId == id);
            if (ToDo == null)
            {
                return;
            }
            ToDo.TodoContent = value.TodoContent;
            ToDo.IsImportant = value.IsImportant;
            ToDo.IsDeleted = value.IsDeleted;
        }

        // DELETE api/toDo/5
        [HttpDelete("{id}")]
        public void Delete(string id)
        {
            var toDo = MyTodos.FirstOrDefault(t => t.ToDoId == id);
            if (toDo == null)
            {
                return;
            }
            toDo.IsDeleted = true;
        }
    }
}
