using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RecruitmentApi.Models
{
    public class MasterDataView : BaseEntity
    {
        public int id { get; set; }

        public string name { get; set; }

        public int type { get; set; }

        public string typeName { get; set; }

        public string createdName { get; set; }

        public string modifiedName { get; set; }
    }
}
