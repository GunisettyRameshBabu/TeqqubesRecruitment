using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RecruitmentApi.Models
{
    public class DashboardInput
    {
        public int recruiter { get; set; }

        public DateTime? dateFrom { get; set; }

        public DateTime? dateTo { get; set; }
    }
}
