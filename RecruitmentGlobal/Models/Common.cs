using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RecruitmentApi.Models
{
    public class Common
    {
        public static string GetFullName(dynamic x)
        {
            return x != null ? (x != null ? x.firstName + " " + (x.middleName + " " ?? "") + x.lastName : "") : "";
        }
    }
}
