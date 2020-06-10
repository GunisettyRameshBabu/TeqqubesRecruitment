using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RecruitmentApi.Models
{
    public class UserLoginDto
    {
        public string UserId { get; set; }

        public string Password { get; set; }
        
    }

    public enum LoginTypes
    {
        Global,
        India,
        Admin, 
        New
    }
}
