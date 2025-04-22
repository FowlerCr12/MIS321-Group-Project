using System.Collections.Generic;
using API.Models;

namespace API.Models.Interfaces
{
    public interface IGetAllEnrolls
    {
        List<Enroll> GetAllEnrolls();
    }
}
