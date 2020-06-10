using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RecruitmentApi.Models
{
    public class MasterData : BaseEntity
    {
        public int id { get; set; }

        public string name { get; set; }

        public int type { get; set; }
    }
}
