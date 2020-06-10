using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RecruitmentApi.Models
{
    public class UserSessionView : UserSession
    {
        public string name { get; set; }

        public double minutes { get; set; }
    }
}
