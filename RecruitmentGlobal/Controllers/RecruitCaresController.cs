using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using RecruitmentApi.Data;
using RecruitmentApi.Models;

namespace RecruitmentApi.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class RecruitCaresController : Base
    {
        private readonly DataContext _context;
        private readonly IConfiguration _configuration;
        private readonly IMapper _mapper;

        public RecruitCaresController(DataContext context, IConfiguration configuration, IMapper mapper)
        {
            _context = context;
            _configuration = configuration;
            _mapper = mapper;
        }

        [HttpGet("Download/{id}")]
        public async Task<IActionResult> Download(int id)
        {
            var candidate = _context.RecruitCare.Find(id);
            if (candidate == null)
            {
                return NotFound("Resume Not Found");
            }


            return File(candidate.resume, "application/octet-stream"); // returns a FileStreamResult
        }

        // GET: api/RecruitCares
        [HttpGet]
        public async Task<ServiceResponse<IEnumerable<RecruitCareView>>> GetRecruitCare()
        {
            var response = new ServiceResponse<IEnumerable<RecruitCareView>>();
            try
            {
                response.Data = await (from x in _context.RecruitCare
                                       join y in _context.Openings on x.jobid equals y.id
                                       join s in _context.MasterData on x.status equals s.id
                                       join c in _context.Users on x.createdBy equals c.id
                                       join m in _context.Users on x.modifiedBy equals m.id into modifiedUsers
                                       from m in modifiedUsers.DefaultIfEmpty()
                                       join n in _context.MasterData on x.noticePeriod equals n.id into notices
                                       from n in notices.DefaultIfEmpty()
                                       join t in _context.MasterData on x.totalExp equals t.id
                                       join r in _context.MasterData on x.relavantExp equals r.id
                                       join b in _context.MasterData on x.bestWayToReach equals b.id into bestways
                                       from b in bestways.DefaultIfEmpty()
                                       join v in _context.MasterData on x.visaType equals v.id into visaTypes
                                       from v in visaTypes.DefaultIfEmpty()
                                       join h in _context.MasterData on x.highestQualification equals h.id into qualifications
                                       from h in qualifications.DefaultIfEmpty()
                                       join st in _context.State on x.state equals st.Id
                                       join ci in _context.Citys on x.city equals ci.Id
                                       select new RecruitCareView()
                                       {
                                           jobid = y.id,
                                           jobName = y.jobid,
                                           comments = x.comments,
                                           createdBy = x.createdBy,
                                           createdByName = Common.GetFullName(c),
                                           email = x.email,
                                           id = x.id,
                                           modifiedBy = x.modifiedBy,
                                           modifiedName = Common.GetFullName(m),
                                           modifiedDate = x.modifiedDate,
                                           name = Common.GetFullName(x),
                                           createdDate = x.createdDate.Value,
                                           firstName = x.firstName,
                                           lastName = x.lastName,
                                           middleName = x.middleName,
                                           phone = x.phone,
                                           status = x.status,
                                           statusName = s.name,
                                           fileName = x.fileName,
                                           noticePeriod = x.noticePeriod,
                                           notice = n.name,
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
                                           stateName = st.Name
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

        // GET: api/RecruitCares
        [HttpGet("GetRecruitCareByMe")]
        public async Task<ServiceResponse<IEnumerable<RecruitCareView>>> GetRecruitCareByMe()
        {
            var response = new ServiceResponse<IEnumerable<RecruitCareView>>();
            try
            {
                var user = _context.Users.FirstOrDefault(x => x.id == LoggedInUser);
                response.Data = await (from x in _context.RecruitCare
                                       join y in _context.Openings on x.jobid equals y.id
                                       join s in _context.MasterData on x.status equals s.id
                                       join c in _context.Users on x.createdBy equals c.id
                                       join m in _context.Users on x.modifiedBy equals m.id into modifiedUsers
                                       from m in modifiedUsers.DefaultIfEmpty()
                                       join n in _context.MasterData on x.noticePeriod equals n.id into notices
                                       from n in notices.DefaultIfEmpty()
                                       join t in _context.MasterData on x.totalExp equals t.id 
                                       join r in _context.MasterData on x.relavantExp equals r.id
                                       join b in _context.MasterData on x.bestWayToReach equals b.id into bestways
                                       from b in bestways.DefaultIfEmpty()
                                       join v in _context.MasterData on x.visaType equals v.id into visaTypes
                                       from v in visaTypes.DefaultIfEmpty()
                                       join h in _context.MasterData on x.highestQualification equals h.id into qualifications
                                       from h in qualifications.DefaultIfEmpty()
                                       join st in _context.State on x.state equals st.Id
                                       join ci in _context.Citys on x.city equals ci.Id
                                       join co in _context.Countries on y.country equals co.Id
                                       where ( user != null && user.roleId == (int)Roles.SuperAdmin ) || ( x.createdBy == LoggedInUser || x.modifiedBy == LoggedInUser)
                                       select new RecruitCareView()
                                       {
                                           jobid = y.id,
                                           jobName = y.jobid,
                                           comments = x.comments,
                                           createdBy = x.createdBy,
                                           createdByName = Common.GetFullName(c),
                                           email = x.email,
                                           id = x.id,
                                           modifiedBy = x.modifiedBy,
                                           modifiedName = Common.GetFullName(m),
                                           modifiedDate = x.modifiedDate,
                                           name = Common.GetFullName(x),
                                           createdDate = x.createdDate.Value,
                                           firstName = x.firstName,
                                           lastName = x.lastName,
                                           middleName = x.middleName,
                                           phone = x.phone,
                                           status = x.status,
                                           statusName = s.name,
                                           fileName = x.fileName,
                                           noticePeriod = x.noticePeriod,
                                           notice = n.name,
                                           anyOfferExist= x.anyOfferExist,
                                           bestTimeToReach = x.bestTimeToReach,
                                           bestWayToReach = x.bestWayToReach,
                                           city= x.city,
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
                                           countryCode = co.Code
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

        // GET: api/RecruitCares/5
        [HttpGet("{id}")]
        public async Task<ActionResult<RecruitCare>> GetRecruitCare(int id)
        {
            var recruitCare = await _context.RecruitCare.FindAsync(id);

            if (recruitCare == null)
            {
                return NotFound();
            }

            return recruitCare;
        }

        // PUT: api/RecruitCares/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<ServiceResponse<int>> PutRecruitCare(int id, RecruitCare recruitCare)
        {
            var response = new ServiceResponse<int>();
            try
            {
                if (recruitCare == null || recruitCare.id <= 0 || id != recruitCare.id)
                {
                    response.Message = "Invalid item , Please correct and try again";
                    response.Success = false;
                    return response;
                }
                var item = _context.RecruitCare.Find(id);
                recruitCare.modifiedDate = DateTime.UtcNow;
                _context.Entry(item).CurrentValues.SetValues(recruitCare);
                await _context.SaveChangesAsync();
                response.Success = true;
                response.Message = "Recruitcare item updated successfully";
                response.Data = recruitCare.id;
            }
            catch (Exception ex)
            {
                response.Message = await CustomLog.Log(ex, _context);
                response.Success = false;
            }
            return response;
        }

        // PUT: api/RecruitCares/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("UploadAttachment/{id}"), DisableRequestSizeLimit]
        public async Task<ServiceResponse<bool>> UploadAttachment(int id)
        {
            var response = new ServiceResponse<bool>();
            if (!Request.Form.Files.Any() || id <= 0)
            {
                response.Success = false;
                response.Message = "Unable to find resume or invalid candidate info";
                return response;
            }

            try
            {
                var candidate = _context.RecruitCare.Find(id);
                if (candidate == null)
                {
                    response.Success = false;
                    response.Message = "Unable to find candidate";
                    return response;
                }
                using (var memoryStream = new MemoryStream())
                {
                    Request.Form.Files[0].CopyTo(memoryStream);
                    candidate.resume = memoryStream.ToArray();
                    candidate.fileName = Request.Form.Files[0].FileName;
                }
                response.Success = true;
                response.Message = "Add or Update Success";

                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                if (!RecruitCareExists(id))
                {
                    response.Success = false;
                    response.Message = "Unable to find Recruit care candidate info";
                    return response;
                }
                else
                {
                    response.Success = false;
                    response.Message = await CustomLog.Log(ex, _context);
                    return response;
                }
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = await CustomLog.Log(ex, _context);
                return response;
            }

            return response;
        }

        // POST: api/RecruitCares
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ServiceResponse<int>> PostRecruitCare(RecruitCare recruitCare)
        {
            var response = new ServiceResponse<int>();
            try
            {
                if (recruitCare == null || recruitCare.id > 0)
                {
                    response.Message = "Invalid item , Please correct and try again";
                    response.Success = false;
                    return response;
                }
                var jobCandidate = _context.JobCandidates.FirstOrDefault(x => x.jobid == recruitCare.jobid && x.email == recruitCare.email);
                if (jobCandidate != null)
                {
                    response.Message = $"Candidate already exist for job {jobCandidate.jobid}";
                    response.Success = false;
                    return response;
                }
                recruitCare.createdBy = LoggedInUser;
                recruitCare.createdDate = DateTime.UtcNow;
                _context.RecruitCare.Add(recruitCare);
                await _context.SaveChangesAsync();
                response.Success = true;
                response.Message = "Recruitcare item added successfully";
                response.Data = recruitCare.id;
            }
            catch (Exception ex)
            {
                response.Message = await CustomLog.Log(ex, _context);
                response.Success = false;
            }
            return response;
        }


        [HttpPost("SendEmail")]
        public async Task<ServiceResponse<bool>> SendEmail(EmailModel[] emailModel)
        {
            var response = new ServiceResponse<bool>();
            try
            {
                if (emailModel == null)
                {
                    response.Message = "Invalid item , Please correct and try again";
                    response.Success = false;
                    return response;
                }
                var list = new List<EmailResponse>();
                foreach (var item in emailModel.Select(x => x.key).Distinct())
                {
                   list.Add(new EmailResponse(item,Email.SendEmail(emailModel.Where(x => x.key == item).Select(x => x.value).ToList(), string.Format("Job Info {0}", item),item , _context, _configuration)));
                }
               
                response.Success = list.Any(x => x.status) ;
                response.Message = list.Any(x => x.status) ? "Email Sent Successfully" : "Unable to send emails for jobs " + string.Join(",", list.Select(x => x.key));
                response.Data = true;
            }
            catch (Exception ex)
            {
                response.Message = await CustomLog.Log(ex, _context);
                response.Success = false;
            }
            return response;
        }
        // DELETE: api/RecruitCares/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<RecruitCare>> DeleteRecruitCare(int id)
        {
            var recruitCare = await _context.RecruitCare.FindAsync(id);
            if (recruitCare == null)
            {
                return NotFound();
            }

            _context.RecruitCare.Remove(recruitCare);
            await _context.SaveChangesAsync();

            return recruitCare;
        }

        private bool RecruitCareExists(int id)
        {
            return _context.RecruitCare.Any(e => e.id == id);
        }

        [HttpDelete("MoveToJobCandidates/{id}")]
        public async Task<ServiceResponse<bool>> MoveToJobCandidates(int id)
        {
            var response = new ServiceResponse<bool>();
            try
            {
                var recruitCare = await _context.RecruitCare.FindAsync(id);
                if (recruitCare == null)
                {
                    response.Success = false;
                    response.Message = "Invalid Recruitcare id";
                    return response;
                }

                var ifExist = await _context.JobCandidates.FirstOrDefaultAsync(x => x.email == recruitCare.email && x.jobid == recruitCare.jobid);
                if (ifExist != null)
                {
                    _context.RecruitCare.Remove(recruitCare);
                    await _context.SaveChangesAsync();
                    response.Success = true;
                    response.Message = "Successf fully removed item from Recruitcare , Entry already exists in job candidates";
                } else
                {
                    var mappedItem = _mapper.Map<JobCandidates>(recruitCare);
                    mappedItem.modifiedBy = LoggedInUser;
                    mappedItem.modifiedDate = DateTime.UtcNow;
                    mappedItem.modifiedBy = mappedItem.modifiedBy ?? mappedItem.createdBy;
                    mappedItem.id = 0;
                    _context.RecruitCare.Remove(recruitCare);
                    _context.JobCandidates.Add(mappedItem);
                    await _context.SaveChangesAsync();
                    response.Success = true;
                    response.Message = "Successf fully moved to job candidates";
                }
            }
            catch (Exception ex)
            {
                response.Message = await CustomLog.Log(ex, _context);
                response.Success = false;
            }

            return response;
           
        }

    }
}
