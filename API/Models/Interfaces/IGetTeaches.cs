using System.Collections.Generic;
using API.Models;

namespace API.Models.Interfaces
{
    public interface IGetTeaches
    {
        Teaches GetTeaches(int id);
    }
}
