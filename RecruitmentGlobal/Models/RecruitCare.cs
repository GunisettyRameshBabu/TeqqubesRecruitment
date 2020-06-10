using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RecruitmentApi.Models
{
    public class RecruitCare : BaseEntity
    {
        public int id { get; set; }

        public string firstName { get; set; }

        public string middleName { get; set; }

        public string lastName { get; set; }

        public string email { get; set; }

        public int jobid { get; set; }

        public string comments { get; set; }

        public long phone { get; set; }

        public int status { get; set; }

        public byte[] resume { get; set; }

        public string fileName { get; set; }

        public int noticePeriod { get; set; }

        public int? state { get; set; }

        public int? city { get; set; }

        public int? totalExp { get; set; }

        public bool rtr { get; set; }

        public int? bestWayToReach { get; set; }

        public string bestTimeToReach { get; set; }

        public string educationDetails { get; set; }

        public bool? anyOfferExist { get; set; }

        public string expectedRatePerHour { get; set; }

        public int? visaType { get; set; }

        public string skypeid { get; set; }

        public int? highestQualification { get; set; }

        public int? relavantExp { get; set; }
    }
}
