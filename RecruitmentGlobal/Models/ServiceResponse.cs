using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RecruitmentApi.Models
{
    public class ServiceResponse<T>
    {
        public string Message { get; set; }

        public bool Success { get; set; }

        public T Data { get; set; }


    }
}
