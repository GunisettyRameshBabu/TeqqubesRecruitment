using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RecruitmentGlobal.Models
{
    public class CustomPagingRequest
    {
        public int size { get; set; }

        public int page { get; set; }

        public string sort { get; set; }

        public string sortOrder { get; set; }
    }
}
