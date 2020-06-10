using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RecruitmentApi.Models
{
    public interface IBaseEntityByNames
    {
        string createdByName { get; set; }

        string ModifiedByName { get; set; }
    }
}
