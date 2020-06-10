using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RecruitmentApi.Models
{
    public class CountryView : Country
    {
        public string createdByName { get; set; }
        public string modifiedByName { get; set; }

    }
}
