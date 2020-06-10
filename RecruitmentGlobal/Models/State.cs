using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RecruitmentApi.Models
{
    public class State : BaseEntity
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public int Country { get; set; }

        public string Code { get; set; }
    }
}
