using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace RecruitmentApi.Models
{
    [Table("City")]
    public class City : BaseEntity
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public int State { get; set; }
    }
}
