using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace RecruitmentApi.Models
{
    public class Users : BaseEntity
    {
        public int id { get; set; }

        public string firstName { get; set; }

        public string middleName { get; set; }

        public string lastName { get; set; }

        public string userid { get; set; }

        public string email { get; set; }

        [JsonIgnore]
        public string password { get; set; }

        public int roleId { get; set; }

        public int country { get; set; }

        public string loginTypes { get; set; }

        public bool active { get; set; }

        public bool passwordChangeRequired { get; set; }
    }
}
