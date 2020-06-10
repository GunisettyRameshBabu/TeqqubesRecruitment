using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RecruitmentApi.Models
{
    public class ExceptionLog
    {
        public Int64 Id { get; set; }

        public string ExceptionMessage { get; set; }

        public DateTime Date { get; set; }
    }
}
