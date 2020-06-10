using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace RecruitmentApi.Models
{
    public class UserSession
    {
        [Key]
        public string sessionId { get; set; }

        public int userid { get; set; }

        public DateTime inTime { get; set; }

        public DateTime? outTime { get; set; }
    }
}
