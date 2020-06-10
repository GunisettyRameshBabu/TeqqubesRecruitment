using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RecruitmentApi.Models
{
    public class ClientCodesView : ClientCodes
    {
       public string createdByName { get; set; }

       public string ModifiedByName { get; set; }
    }
}
