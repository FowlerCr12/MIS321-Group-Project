using System.Collections.Generic;
using API.Models;

namespace API.Models.Interfaces
{
    public interface IGetEnroll
    {
        Enroll GetEnroll(int id);
    }
}
