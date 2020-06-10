using Microsoft.EntityFrameworkCore;
using RecruitmentApi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RecruitmentApi.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }
        public DbSet<Users> Users { get; set; }


        public DbSet<JobOpenings> JobOpenings { get; set; }
    
        public DbSet<Openings> Openings { get; set; }
        public DbSet<Country> Countries { get; set; }

        public DbSet<City> Citys { get; set; }

        public DbSet<ClientCodes> ClientCodes { get; set; }

        public DbSet<RecruitmentApi.Models.State> State { get; set; }

        public DbSet<JobCandidates> JobCandidates { get; set; }

        public DbSet<RecruitmentApi.Models.RecruitCare> RecruitCare { get; set; }

        public DbSet<MasterData> MasterData { get; set; }

        public DbSet<MasterDataType> MasterDataType { get; set; }

        public DbSet<UserSession> UserSession { get; set; }

        public DbSet<ExceptionLog> ExceptionLog { get; set; }


    }
}
