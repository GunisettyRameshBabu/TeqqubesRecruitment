using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RecruitmentApi.Models
{
    public class OpeningsView
    {

        public OpeningsView()
        {
            Candidates = new List<JobCandidatesView>();
        }
        public string jobid { get; set; }

        public string jobtitle { get; set; }

        public string country { get; set; }

        public string assaigned { get; set; }

        public string createdBy { get; set; }

        public DateTime targetDate { get; set; }

        public string status { get; set; }

        public string state { get; set; }

        public string city { get; set; }

        public string client { get; set; }

        public string contactName { get; set; }

        public string accountManager { get; set; }

        public string jobtype { get; set; }

        public string industry { get; set; }

        public string experience { get; set; }

        public string salary { get; set; }

        public string zip { get; set; }

        public string description { get; set; }

        public string company_url { get; set; }

        public IList<JobCandidatesView> Candidates { get; set; }
    }
}
