using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RecruitmentApi.Models
{
    public class UserView : BaseEntity
    {
        public int id { get; set; }

        public string firstName { get; set; }

        public string middleName { get; set; }

        public string lastName { get; set; }

        public string userid { get; set; }

        public string email { get; set; }


        public string role { get; set; }

        public int roleId { get; set; }

        public string countryName { get; set; }
        public int countryId { get; set; }

        public bool active { get; set; }
    }
}
