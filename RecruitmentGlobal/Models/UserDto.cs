using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace RecruitmentApi.Models
{
    public class UserDto : BaseEntity
    {
        public int id { get; set; }

        public string firstName { get; set; }

        public string middleName { get; set; }

        public string lastName { get; set; }

        public string userid { get; set; }

        public string email { get; set; }
        public string password { get; set; }

        public int roleId { get; set; }

        public int countryId { get; set; }

        public string loginTypes { get; set; }

        public bool active { get; set; }

        public string roleName { get; set; }

        public string sessionId { get; set; }

        public string token { get; set; }

        public bool passwordChangeRequired { get; set; }
    }
}
