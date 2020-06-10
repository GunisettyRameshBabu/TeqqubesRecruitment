using AutoMapper;
using RecruitmentApi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RecruitmentApi.Mappers
{
    public class AutoMapping : Profile
    {
        public AutoMapping()
        {
            CreateMap<Users, UserDto>().ForMember(dest =>
            dest.countryId,
            opt => opt.MapFrom(src => src.country)).ReverseMap(); // means you want to map from User to UserDTO

            CreateMap<RecruitCare, JobCandidates>().ReverseMap();
        }
    }
}
