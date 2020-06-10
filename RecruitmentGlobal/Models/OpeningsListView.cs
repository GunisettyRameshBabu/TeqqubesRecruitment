using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RecruitmentApi.Models
{
    public class OpeningsList
    {
        public IEnumerable<OpeningsListView> Jobs { get; set; }

        public IEnumerable<JobCandidatesView> Candidates { get; set; }
    }
    public class OpeningsListView
    {
        public int id { get; set; }
        public int jobid { get; set; }

        public string jobName { get; set; }

        public string jobtitle { get; set; }

        public string assaignedTo { get; set; }

        public string city { get; set; }

        public string client { get; set; }

        public string contactName { get; set; }

        public string accountManager { get; set; }

        public string status { get; set; }

        public DateTime targetdate { get; set; }

        public bool canEdit { get; set; }

        public string countryCode { get; set; }

        public string createdByName { get; set; }

        public DateTime? createdDate { get; set; }

        public DateTime? modifiedDate { get; set; }

        public string modifiedName { get; set; }
    }
}
