using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RecruitmentApi.Data;
using RecruitmentApi.Models;
using RecruitmentGlobal.Models;

namespace RecruitmentApi.Controllers
{
    [Authorize]
    
    [Route("api/[controller]")]
    [ApiController]
    public class OpeningsController : Base
    {
        private readonly DataContext _context;

        public OpeningsController(DataContext context)
        {
            _context = context;
        }

        // GET: api/Openings/
        [HttpPost("GetOpeningsByCountry/{type}")]
        public async Task<ActionResult<ServiceResponse<OpeningsList>>> GetOpeningsByCountry(string type, CustomPagingRequest request)
        {
            var response = new ServiceResponse<OpeningsList>();
            try
            {
                var countries = _context.Countries.ToList();
                var user = _context.Users.FirstOrDefault(x => x.id == LoggedInUser);
                if (user != null && user.roleId != (int)Roles.SuperAdmin)
                {
                    countries = countries.Where(x => x.Id == user.country).ToList();
                }
                switch (type)
                {
                    case "in":
                        countries = countries.Where(x => x.Code == "IN").ToList();
                        break;
                    case "gl":
                        countries = countries.Where(x => x.Code != "IN").ToList();
                        break;
               
                }
                var countryCodes = countries.Select(x => x.Id).ToList();
                response.Data = new OpeningsList();
                var query = (from o in _context.Openings
                                            join a in _context.Users on o.assaignedTo equals a.id into assaigns
                                            from a in assaigns.DefaultIfEmpty()
                                            join c in _context.Citys on o.city equals c.Id
                                            join cl in _context.ClientCodes on o.client equals cl.Id
                                            join co in _context.Users on o.contactName equals co.id into contacts
                                            from co in contacts.DefaultIfEmpty()
                                            join am in _context.Users on o.accountManager equals am.id into accounts
                                            from am in accounts.DefaultIfEmpty()
                                            join s in _context.MasterData on o.status equals s.id
                                            join cou in _context.Countries on o.country equals cou.Id
                                            join cr in _context.Users on o.createdBy equals cr.id
                                            join md in _context.Users on o.modifiedBy equals md.id into modifies
                                            from md in modifies.DefaultIfEmpty()
                                            where countryCodes.Contains(o.country)
                                            select new OpeningsListView()
                                            {
                                                id = o.id,
                                                accountManager = Common.GetFullName(am),
                                                account = o.accountManager,
                                                assaignedTo = Common.GetFullName(a),
                                                assaigned = o.assaignedTo,
                                                city = c.Name,
                                                client = cl.Name,
                                                contactName = Common.GetFullName(co),
                                                contact = o.contactName,
                                                jobid = o.id,
                                                jobName = o.jobid,
                                                jobtitle = o.jobtitle,
                                                status = s.name,
                                                targetdate = o.targetdate,
                                                canEdit = (user != null && user.roleId == (int)Roles.SuperAdmin) || (o.createdBy == LoggedInUser || o.modifiedBy == LoggedInUser),
                                                countryCode = cou.Code,
                                                createdByName = Common.GetFullName(cr),
                                                createdDate = o.createdDate,
                                                modifiedDate = o.modifiedDate,
                                                modifiedName    = Common.GetFullName(md),
                                                createdBy = o.createdBy,
                                                modifiedBy = o.modifiedBy
                                            }).AsQueryable();

                switch (request.sort)
                {
                    case "accountManager":
                        query = (request.sortOrder == "Descending" ? query.OrderByDescending(x => x.account) : query.OrderBy(x => x.account));
                        break;
                    case "assaignedTo":
                        query = (request.sortOrder == "Descending" ? query.OrderByDescending(x => x.assaigned) :
                            query.OrderBy(x => x.assaigned));
                        break;
                    case "city":
                        query = (request.sortOrder == "Descending" ? query.OrderByDescending(x => x.city) : query.OrderBy(x => x.city));
                        break;
                    case "client":
                        query = (request.sortOrder == "Descending" ? query.OrderByDescending(x => x.client) : query.OrderBy(x => x.client));
                        break;
                    case "contactName":
                        query = (request.sortOrder == "Descending" ? query.OrderByDescending(x => x.contact) : query.OrderBy(x => x.contact));
                        break;
                    case "modifiedDate":
                        query = (request.sortOrder == "Descending" ? query.OrderByDescending(x => x.modifiedDate) : query.OrderBy(x => x.modifiedDate));
                        break;
                    case "id":
                        query = (request.sortOrder == "Descending" ? query.OrderByDescending(x => x.id) : query.OrderBy(x => x.id));
                        break;
                    case "jobName":
                        query = (request.sortOrder == "Descending" ? query.OrderByDescending(x => x.jobid) : query.OrderBy(x => x.jobid));
                        break;
                    case "jobid":
                        query = (request.sortOrder == "Descending" ? query.OrderByDescending(x => x.id) : query.OrderBy(x => x.id));
                        break;
                    case "jobtitle":
                        query = (request.sortOrder == "Descending" ? query.OrderByDescending(x => x.jobtitle) : query.OrderBy(x => x.jobtitle));
                        break;
                    case "status":
                        query = (request.sortOrder == "Descending" ? query.OrderByDescending(x => x.status) : query.OrderBy(x => x.status));
                        break;
                    case "targetdate":
                        query = (request.sortOrder == "Descending" ? query.OrderByDescending(x => x.targetdate) : query.OrderBy(x => x.targetdate));
                        break;
                    case "createdByName":
                        query = (request.sortOrder == "Descending" ? query.OrderByDescending(x => x.createdBy) : query.OrderBy(x => x.createdBy));
                        break;
                    case "createdDate":
                        query = (request.sortOrder == "Descending" ? query.OrderByDescending(x => x.createdDate) : query.OrderBy(x => x.createdDate));
                        break;
                    case "modifiedName":
                        query = (request.sortOrder == "Descending" ? query.OrderByDescending(x => x.modifiedBy) : query.OrderBy(x => x.modifiedBy));
                        break;
                    default:
                        break;
                }

                response.Data.Jobs = new PagedList<OpeningsListView>(
                query, request);

                response.Data.Candidates = await (from x in _context.JobCandidates
                                                  join j in _context.Openings on x.jobid equals j.id
                                                  join s in _context.MasterData on x.status equals s.id
                                                  join t in _context.MasterData on x.totalExp equals t.id into totalExps
                                                  from t in totalExps.DefaultIfEmpty()
                                                  join r in _context.MasterData on x.relavantExp equals r.id into relavantExps
                                                  from r in relavantExps.DefaultIfEmpty()
                                                  join b in _context.MasterData on x.bestWayToReach equals b.id into bestways
                                                  from b in bestways.DefaultIfEmpty()
                                                  join v in _context.MasterData on x.visaType equals v.id into visaTypes
                                                  from v in visaTypes.DefaultIfEmpty()
                                                  join h in _context.MasterData on x.highestQualification equals h.id into qualifications
                                                  from h in qualifications.DefaultIfEmpty()
                                                  join st in _context.State on x.state equals st.Id into states
                                                  from st in states.DefaultIfEmpty()
                                                  join ci in _context.Citys on x.city equals ci.Id into cities
                                                  from ci in cities.DefaultIfEmpty()
                                                  join cu in _context.Countries on j.country equals cu.Id
                                                  where response.Data.Jobs.List.Select(x => x.jobid).Contains(x.jobid) && (user != null && user.roleId == (int)Roles.SuperAdmin) || (x.createdBy == LoggedInUser || x.modifiedBy == LoggedInUser)
                                                  select new JobCandidatesView()
                                                  {
                                                      jobid = x.jobid,
                                                      firstName = x.firstName,
                                                      id = x.id,
                                                      lastName = x.lastName,
                                                      middleName = x.middleName,
                                                      phone = x.phone,
                                                      resume = x.resume,
                                                      status = s.id,
                                                      statusName = s.name,
                                                      email = x.email,
                                                      fileName = x.fileName,
                                                      jobName = j.jobid,
                                                      anyOfferExist = x.anyOfferExist,
                                                      bestTimeToReach = x.bestTimeToReach,
                                                      bestWayToReach = x.bestWayToReach,
                                                      city = x.city,
                                                      educationDetails = x.educationDetails,
                                                      expectedRatePerHour = x.expectedRatePerHour,
                                                      highestQualification = x.highestQualification,
                                                      relavantExp = x.relavantExp,
                                                      rtr = x.rtr,
                                                      skypeid = x.skypeid,
                                                      state = x.state,
                                                      totalExp = x.totalExp,
                                                      visaType = x.visaType,
                                                      totalExpName = t.name,
                                                      relavantExpName = r.name,
                                                      bestWayToReachName = b.name,
                                                      highestQualificationName = h.name,
                                                      visaTypeName = v.name,
                                                      cityName = ci.Name,
                                                      stateName = st.Name,
                                                      countryCode = cu.Code,
                                                      currentCTC = x.currentCTC,
                                                      expectedCTC = x.expectedCTC
                                                  }).ToListAsync();
                response.Success = true;
                response.Message = "Success";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = await CustomLog.Log(ex, _context);
            }

            return Ok(response);

        }

        // GET: api/Openings/5
        [HttpGet("{id}")]
        public async Task<ServiceResponse<OpeningsView>> GetOpenings(int id)
        {
            var response = new ServiceResponse<OpeningsView>();
            try
            {
                var user = _context.Users.FirstOrDefault(x => x.id == LoggedInUser);
                var openings = await (from x in _context.Openings
                                      join cr in _context.Users on x.createdBy equals cr.id
                                      join st in _context.MasterData on x.status equals st.id
                                      join cou in _context.Countries on x.country equals cou.Id
                                      join sta in _context.State on x.state equals sta.Id
                                      join ci in _context.Citys on x.city equals ci.Id
                                      join ass in _context.Users on x.assaignedTo equals ass.id into assains
                                      from ass in assains.DefaultIfEmpty()
                                      join cl in _context.ClientCodes on x.client equals cl.Id
                                      join con in _context.Users on x.contactName equals con.id into contacts
                                      from con in contacts.DefaultIfEmpty()
                                      join acc in _context.Users on x.accountManager equals acc.id into accounts
                                      from acc in accounts.DefaultIfEmpty()
                                      join exp in _context.MasterData on x.experience equals exp.id
                                      join indus in _context.MasterData on x.industry equals indus.id
                                      join types in _context.MasterData on x.jobtype equals types.id
                                      where x.id == id 
                                      select new OpeningsView()
                                      {
                                          jobid = x.jobid,
                                          accountManager = Common.GetFullName(acc),
                                          state = sta.Name,
                                          country = cou.Name,
                                          assaigned = Common.GetFullName(ass),
                                          city = ci.Name,
                                          client = cl.Name,
                                          contactName = Common.GetFullName(con),
                                          description = x.description,
                                          experience = exp.name,
                                          jobtitle = x.jobtitle,
                                          status = st.name,
                                          zip = x.zip,
                                          targetDate = x.targetdate,
                                          salary = x.salary,
                                          createdBy = Common.GetFullName(cr),
                                          industry = indus.name,
                                          jobtype = types.name,
                                          company_url = cl.url
                                      }).AsQueryable().FirstOrDefaultAsync();

                if (openings == null)
                {
                    response.Message = "Job Id not found";
                    response.Success = false;
                    return response;
                }

                openings.Candidates = (from x in _context.JobCandidates
                                       join j in _context.Openings on x.jobid equals j.id
                                       join s in _context.MasterData on x.status equals s.id
                                       join t in _context.MasterData on x.totalExp equals t.id into totalExps
                                       from t in totalExps.DefaultIfEmpty()
                                       join r in _context.MasterData on x.relavantExp equals r.id into relavantExps
                                       from r in relavantExps.DefaultIfEmpty()
                                       join b in _context.MasterData on x.bestWayToReach equals b.id into bestways
                                       from b in bestways.DefaultIfEmpty()
                                       join v in _context.MasterData on x.visaType equals v.id into visaTypes
                                       from v in visaTypes.DefaultIfEmpty()
                                       join h in _context.MasterData on x.highestQualification equals h.id into qualifications
                                       from h in qualifications.DefaultIfEmpty()
                                       join st in _context.State on x.state equals st.Id into states
                                       from st in states.DefaultIfEmpty()
                                       join ci in _context.Citys on x.city equals ci.Id into cities
                                       from ci in cities.DefaultIfEmpty()
                                       join cr in _context.Users on x.createdBy equals cr.id
                                       join md in _context.Users on x.modifiedBy equals md.id into modifies
                                       from md in modifies.DefaultIfEmpty()
                                       where j.id == id && (user != null && user.roleId == (int)Roles.SuperAdmin) || (x.createdBy == LoggedInUser || x.modifiedBy == LoggedInUser)
                                       select new JobCandidatesView()
                                       {
                                           jobid = x.jobid,
                                           jobName = j.jobid,
                                           firstName = x.firstName,
                                           id = x.id,
                                           lastName = x.lastName,
                                           middleName = x.middleName,
                                           phone = x.phone,
                                           resume = x.resume,
                                           status = s.id,
                                           statusName = s.name,
                                           email = x.email,
                                           fileName = x.fileName,
                                           anyOfferExist = x.anyOfferExist,
                                           bestTimeToReach = x.bestTimeToReach,
                                           bestWayToReach = x.bestWayToReach,
                                           city = x.city,
                                           educationDetails = x.educationDetails,
                                           expectedRatePerHour = x.expectedRatePerHour,
                                           highestQualification = x.highestQualification,
                                           relavantExp = x.relavantExp,
                                           rtr = x.rtr,
                                           skypeid = x.skypeid,
                                           state = x.state,
                                           totalExp = x.totalExp,
                                           visaType = x.visaType,
                                           totalExpName = t.name,
                                           relavantExpName = r.name,
                                           bestWayToReachName = b.name,
                                           highestQualificationName = h.name,
                                           visaTypeName = v.name,
                                           cityName = ci.Name,
                                           stateName = st.Name,
                                           modifiedDate = x.modifiedDate,
                                           createdDate = x.createdDate,
                                           createdBy = x.createdBy,
                                           modifiedBy = x.modifiedBy,
                                           createdByName = Common.GetFullName(cr),
                                           modifiedByName = Common.GetFullName(md)
                                       }).AsQueryable().ToList();
                response.Data = openings;
                response.Message = "Success";
                response.Success = true;
            }
            catch (Exception ex)
            {
                response.Message = await CustomLog.Log(ex, _context);
                response.Success = false;
                return response;
            }


            return response;
        }
        // GET: api/Openings/
        [HttpGet("GetOpeningById/{id}")]
        public async Task<ServiceResponse<Openings>> GetOpeningById(int id)
        {
            var response = new ServiceResponse<Openings>();
            try
            {
                response.Data = _context.Openings.Find(id);
                response.Success = true;
                response.Message = "Success";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = await CustomLog.Log(ex, _context);
            }

            return response;

        }


        [HttpGet("GetDashBoardData")]
        public async Task<ServiceResponse<dynamic>> GetDashBoardData()
        {
            var response = new ServiceResponse<dynamic>();
            try
            {
                var user = _context.Users.Find(LoggedInUser);
                var candidateStatus = await (from x in _context.MasterData
                                  join y in _context.MasterDataType on x.type equals y.id
                                  where y.name == "JobCandidateStatus" || y.name == "Common"
                                             select x).ToListAsync();

                var candidates = await (from x in _context.JobCandidates
                                        join j in _context.Openings on x.jobid equals j.id
                                        where j.country == user.country
                                        select x).ToListAsync();

                var res = (from x in candidateStatus
                           join y in candidates on x.id equals y.status 
                           group x by x.name into g
                           select new KeyValuePair<string,int>(g.Key , g.Count())).ToList();

                var recruitcare = await (from x in _context.RecruitCare
                                        join j in _context.Openings on x.jobid equals j.id
                                        where j.country == user.country
                                        select x).ToListAsync();

                var resRec = (from x in candidateStatus
                           join y in recruitcare on x.id equals y.status
                           group x by x.name into g
                           select new KeyValuePair<string, int>(g.Key, g.Count())).ToList();


                List<KeyValuePair<string, KeyValuePair<int, int>>> result = new List<KeyValuePair<string, KeyValuePair<int, int>>>();
                foreach (var item in candidateStatus)
                {
                    var count = 0;
                    count = (count + res.FirstOrDefault(x => x.Key == item.name).Value);
                    count = (count + resRec.FirstOrDefault(x => x.Key == item.name).Value);
                    result.Add(new KeyValuePair<string, KeyValuePair<int, int>>(item.name, new KeyValuePair<int, int>(item.id, count)));
                }
                response.Data = result; ;
                response.Message = "Data Retrived";
                response.Success = true;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = await CustomLog.Log(ex, _context);
            }

            return response;

        }

        [HttpPost("GetDashBoardData")]
        public async Task<ServiceResponse<dynamic>> GetDashBoardData(DashboardInput dashboardInput)
        {
            var response = new ServiceResponse<dynamic>();
            try
            {
                var user = _context.Users.Find(LoggedInUser);
                var candidateStatus = await (from x in _context.MasterData
                                             join y in _context.MasterDataType on x.type equals y.id
                                             where y.name == "JobCandidateStatus"
                                             select x).ToListAsync();

                var candidates = await (from x in _context.JobCandidates
                                        join j in _context.Openings on x.jobid equals j.id
                                        where j.country == user.country && (dashboardInput.recruiter == 0 ? true : (dashboardInput.recruiter == x.createdBy || dashboardInput.recruiter == x.modifiedBy))
                                        && (dashboardInput.dateFrom.HasValue ? x.createdDate.Value.Date >= dashboardInput.dateFrom.Value.Date : true) 
                                        && (dashboardInput.dateTo.HasValue ? x.createdDate.Value.Date <= dashboardInput.dateTo.Value.Date : true)
                                        select x).ToListAsync();

                var res = (from x in candidateStatus
                           join y in candidates on x.id equals y.status
                           group x by x.name into g
                           select new KeyValuePair<string, int>(g.Key, g.Count())).ToList();

                var recruitcare = await (from x in _context.RecruitCare
                                         join j in _context.Openings on x.jobid equals j.id
                                         where j.country == user.country && (dashboardInput.recruiter == 0 ? true : (dashboardInput.recruiter == x.createdBy || dashboardInput.recruiter == x.modifiedBy))
                                        && (dashboardInput.dateFrom.HasValue ? x.createdDate.Value.Date >= dashboardInput.dateFrom.Value.Date : true)
                                        && (dashboardInput.dateTo.HasValue ? x.createdDate.Value.Date <= dashboardInput.dateTo.Value.Date : true)
                                         select x).ToListAsync();

                var resRec = (from x in candidateStatus
                              join y in recruitcare on x.id equals y.status
                              group x by x.name into g
                              select new KeyValuePair<string, int>(g.Key, g.Count())).ToList();


                List<KeyValuePair<string, KeyValuePair<int, int>>> result = new List<KeyValuePair<string, KeyValuePair<int, int>>>();
                foreach (var item in candidateStatus)
                {
                    var count = 0;
                    count = (count + res.FirstOrDefault(x => x.Key == item.name).Value);
                    count = (count + resRec.FirstOrDefault(x => x.Key == item.name).Value);
                    result.Add(new KeyValuePair<string, KeyValuePair<int, int>>(item.name, new KeyValuePair<int, int>(item.id, count)));
                }
                response.Data = result; ;
                response.Message = "Data Retrived";
                response.Success = true;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = await CustomLog.Log(ex, _context);
            }

            return response;

        }


        // GET: api/Openings/
        [HttpGet("GetJobs")]
        public async Task<ServiceResponse<IList<DropdownModel>>> GetJobs()
        {
            var response = new ServiceResponse<IList<DropdownModel>>();
            try
            {
                var user = _context.Users.Find(LoggedInUser);
                response.Data = await (from x in _context.Openings
                                       join c in _context.Countries on x.country equals c.Id
                                       where user.roleId == (int) Roles.SuperAdmin ||  x.country == user.country
                                       select new DropdownModel()
                                       {
                                           id = x.id,
                                           name = x.jobid + " - " + x.jobtitle,
                                           key = c.Code
                                       }).AsQueryable().ToListAsync();
                response.Success = true;
                response.Message = "Success";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = await CustomLog.Log(ex, _context);
            }

            return response;

        }
        // PUT: api/Openings/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<ServiceResponse<bool>> PutOpenings(int id, Openings openings)
        {
            var response = new ServiceResponse<bool>();
            if (id != openings.id)
            {
                response.Success = false;
                response.Message = "Invalid job id , Please check";
            }


            try
            {
                openings.modifiedBy = LoggedInUser;
                openings.modifiedDate = DateTime.UtcNow;
                var job = _context.Openings.Find(id);
                _context.Entry(job).CurrentValues.SetValues(openings);
                await _context.SaveChangesAsync();
                response.Success = true;
                response.Message = "Job Opening updated successfully";
                response.Data = true;
            }
            catch (DbUpdateConcurrencyException ex)
            {
                response.Success = false;
                if (!OpeningsExists(id))
                {
                    response.Message = "Invalid job id , Please check";
                }
                else
                {
                    response.Message = await CustomLog.Log(ex, _context);
                }
            }

            return response;
        }

        // POST: api/Openings
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<ServiceResponse<bool>>> PostOpenings(Openings openings)
        {
            var response = new ServiceResponse<bool>();

            try
            {
                if (openings == null)
                {
                    response.Success = false;
                    response.Message = "Invalid Response , Please check";
                    return Ok(response);
                }

                openings.createdBy = LoggedInUser;
                openings.createdDate = DateTime.UtcNow;

                _context.Openings.Add(openings);
                await _context.SaveChangesAsync();

                response.Success = true;
                response.Message = "Job Opening added successfully";
                response.Data = true;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = await CustomLog.Log(ex, _context);
            }

            return Ok(response);

        }

        // DELETE: api/Openings/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Openings>> DeleteOpenings(int id)
        {
            var openings = await _context.Openings.FindAsync(id);
            if (openings == null)
            {
                return NotFound();
            }

            _context.Openings.Remove(openings);
            await _context.SaveChangesAsync();

            return openings;
        }

        private bool OpeningsExists(int id)
        {
            return _context.Openings.Any(e => e.id == id);
        }

        [HttpGet("GetCountryCodeByJobId/{jobid}")]
        public async Task<ActionResult<ServiceResponse<string>>> GetCountryCodeByJobId(int jobid)
        {
            var response = new ServiceResponse<string>();

            try
            {
                response.Data = await (from x in _context.Openings 
                                      join c in _context.Countries on x.country equals c.Id
                                      where x.id == jobid
                                      select c.Code).FirstOrDefaultAsync();

                response.Success = true;
                response.Message = "Success";
                
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = await CustomLog.Log(ex, _context);
            }

            return Ok(response);

        }



    }
}
