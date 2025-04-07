namespace testwebpatutorial.Models
{
    public class ToDo
    {
        public required string ToDoId { get; set; }
        public required string TodoContent { get; set; }
        public bool IsImportant { get; set; }
        public bool IsDeleted { get; set; }

        public override string ToString()
        {
            return ToDoId + " " + TodoContent + " " + IsImportant + " " + IsDeleted;
        }
    }
}