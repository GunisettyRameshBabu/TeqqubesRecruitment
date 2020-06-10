using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RecruitmentApi.Models
{
    public class JobOpeningView
    {
        public int? JobId { get; set; }

        public string JobTitle { get; set; }

        public string Description { get; set; }

        public bool ClientVisible { get; set; }

        public int Country { get; set; }

        public int State { get; set; }

        public int City { get; set; }

        public int Experience { get; set; }

        public string JobCode { get; set; }

        public int JobType { get; set; }

        public string Zip { get; set; }

        public int Client { get; set; }

        public DateTime TargetDate { get; set; }
        public int Industry { get; set; }
    }
}
