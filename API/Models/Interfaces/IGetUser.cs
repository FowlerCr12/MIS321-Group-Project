using System.Collections.Generic;
using API.Models;

namespace API.Models.Interfaces
{
    public interface IGetUser
    {
        User GetUser(int id);
    }
}
