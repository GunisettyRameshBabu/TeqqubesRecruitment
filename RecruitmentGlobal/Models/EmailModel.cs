using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RecruitmentApi.Models
{
    public class EmailModel
    {
        public string key { get; set; }

        public string value { get; set; }

        public bool status{ get; set; }
    }

    public class EmailResponse
    {
        public string key { get; set; }

        public bool status { get; set; }

        public EmailResponse(string _key, bool _status)
        {
            key = _key;
            status = _status;
        }
    }
}
