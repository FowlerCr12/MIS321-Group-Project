using System.Collections.Generic;
using API.Models;

namespace API.Models.Interfaces
{
    public interface IGetAllTrainers
    {
        List<Trainer> GetAllTrainers();
    }
}
