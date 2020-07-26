using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RecruitmentApi.Data;
using RecruitmentApi.Models;
using RecruitmentGlobal.Models;

namespace RecruitmentApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserSessionsController : Base
    {
        private readonly DataContext _context;

        public UserSessionsController(DataContext context)
        {
            _context = context;
        }

        // GET: api/UserSessions
        [HttpPost]
        [Route("GetUserSessions")]
        public async Task<ServiceResponse<PagedList<UserSessionView>>> GetUserSession(CustomPagingRequest request)
        {
            var response = new ServiceResponse<PagedList<UserSessionView>>();
            try
            {
                var user = _context.Users.Find(LoggedInUser);
                var query = (from x in _context.UserSession
                                       join y in _context.Users on x.userid equals y.id
                                       where (y.roleId == (int)Roles.SuperAdmin) || ((y.roleId == (int)Roles.Recruiter) && y.country == user.country)
                                       select new UserSessionView()
                                       {
                                           userid = x.userid,
                                           sessionId = x.sessionId,
                                           inTime = x.inTime,
                                           name = Common.GetFullName(y),
                                           outTime = x.outTime,
                                           minutes = x.outTime == null ? 0 : (x.outTime.Value - x.inTime).TotalMinutes
                                       }).AsQueryable();
                switch (request.sort)
                {
                    case "userid":
                    case "name":
                        query = (request.sortOrder == "Descending" ? query.OrderByDescending(x => x.userid) : query.OrderBy(x => x.userid));
                        break;
                    case "sessionId":
                        query = (request.sortOrder == "Descending" ? query.OrderByDescending(x => x.sessionId) :
                            query.OrderBy(x => x.sessionId));
                        break;
                    case "inTime":
                        query = (request.sortOrder == "Descending" ? query.OrderByDescending(x => x.inTime) : query.OrderBy(x => x.inTime));
                        break;
                  
                    case "outTime":
                        query = (request.sortOrder == "Descending" ? query.OrderByDescending(x => x.outTime) : query.OrderBy(x => x.outTime));
                        break;
                    case "minutes":
                        query = (request.sortOrder == "Descending" ? query.OrderByDescending(x => x.minutes) : query.OrderBy(x => x.minutes));
                        break;
                   
                    default:
                        break;
                }

                response.Data = new PagedList<UserSessionView>(
                query, request);
                response.Success = true;
                response.Message = "Retrived";
            }
            catch (Exception ex)
            {
                
                response.Success = true;
                response.Message = await CustomLog.Log(ex, _context);
            }
            return response;
        }

        // GET: api/UserSessions/5
        [HttpGet("{id}")]
        public async Task<ActionResult<UserSession>> GetUserSession(string id)
        {
            var userSession = await _context.UserSession.FindAsync(id);

            if (userSession == null)
            {
                return NotFound();
            }

            return userSession;
        }

        // PUT: api/UserSessions/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUserSession(string id, UserSession userSession)
        {
            if (id != userSession.sessionId)
            {
                return BadRequest();
            }

            _context.Entry(userSession).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserSessionExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/UserSessions
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<UserSession>> PostUserSession(UserSession userSession)
        {
            _context.UserSession.Add(userSession);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (UserSessionExists(userSession.sessionId))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetUserSession", new { id = userSession.sessionId }, userSession);
        }

        // DELETE: api/UserSessions/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<UserSession>> DeleteUserSession(string id)
        {
            var userSession = await _context.UserSession.FindAsync(id);
            if (userSession == null)
            {
                return NotFound();
            }

            _context.UserSession.Remove(userSession);
            await _context.SaveChangesAsync();

            return userSession;
        }

        private bool UserSessionExists(string id)
        {
            return _context.UserSession.Any(e => e.sessionId == id);
        }
    }
}
