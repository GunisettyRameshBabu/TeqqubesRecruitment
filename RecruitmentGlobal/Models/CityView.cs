using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RecruitmentApi.Models
{
    public class CityView : City
    {
        public string createdByName { get; set; }
        public string modifiedByName { get; set; }

        public string countryName { get; set; }

        public string stateName { get; set; }

        public int country { get; set; }
    }
}
