using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace RecruitmentApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class Base : ControllerBase
    {
        public int LoggedInUser { get {
                var user = User.Identity.Name;
                return Convert.ToInt32(user);
            } }
    }
}
