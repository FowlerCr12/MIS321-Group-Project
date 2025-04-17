using System.Collections.Generic;
using API.Models;

namespace API.Models.Interfaces
{
    public interface IGetAllTrainerRequests
    {
        List<TrainerRequest> GetAllTrainerRequests();
    }
}
