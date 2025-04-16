using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Models.Interfaces
{
    public interface IGetAdmin
    {
        Admin GetAdmin(int id);

    }
}