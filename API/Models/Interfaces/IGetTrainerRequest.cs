using System.Collections.Generic;
using API.Models;

namespace API.Models.Interfaces
{
    public interface IGetTrainerRequest
    {
        TrainerRequest GetTrainerRequest(int id);
    }
}
