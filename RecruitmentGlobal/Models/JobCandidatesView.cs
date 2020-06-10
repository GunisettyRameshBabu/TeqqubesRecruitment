using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RecruitmentApi.Models
{
    public class JobCandidatesView : JobCandidates
    {
       

        public string jobName { get; set; }

       
        public string statusName { get; set; }

        
        public string cityName { get; set; }

        public string stateName { get; set; }

        public string totalExpName { get; set; }

        public string bestWayToReachName { get; set; }

        public string visaTypeName { get; set; }

        public string highestQualificationName { get; set; }

        public string relavantExpName { get; set; }

        public string countryCode { get; set; }

        public string createdByName { get; set; }

        public string modifiedByName { get; set; }
    }
}
