using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using RecruitmentApi.Data;
using RecruitmentApi.Models;
using RecruitmentGlobal.Models;

namespace RecruitmentApi.Controllers
{
    [Authorize]
    
    [Route("api/[controller]")]
    [ApiController]
    public class CountriesController : Base
    {
        private readonly DataContext _context;

        public CountriesController(DataContext context)
        {
            _context = context;
        }

        // GET: api/Countries
        [HttpGet]
        public async Task<ServiceResponse<IEnumerable<CountryView>>> GetAllCountries()
        {
            var response = new ServiceResponse<IEnumerable<CountryView>>();
            try
            {
                response.Data = await (from x in _context.Countries
                                       join y in _context.Users on x.createdBy equals y.id
                                       join z in _context.Users on x.modifiedBy equals z.id into modifies
                                       from z in modifies.DefaultIfEmpty()
                                       select new CountryView()
                                       {
                                           Code = x.Code,
                                           modifiedBy = x.modifiedBy,
                                           createdBy = x.createdBy,
                                           createdByName = Common.GetFullName(y),
                                           createdDate = x.createdDate,
                                           Id = x.Id,
                                           modifiedByName = Common.GetFullName(z),
                                           modifiedDate = x.modifiedDate,
                                           Name = x.Name

                                       }).AsQueryable().ToListAsync();
                response.Success = true;
                response.Message = "Data Retrived";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = await CustomLog.Log(ex, _context);
            }
            return response;
        }

        [HttpPost]
        [Route("GetCountries")]
        public async Task<ServiceResponse<PagedList<CountryView>>> GetCountries(CustomPagingRequest request)
        {
            var response = new ServiceResponse<PagedList<CountryView>>();
            try
            {
               var query = (from x in _context.Countries
                                       join y in _context.Users on x.createdBy equals y.id
                                       join z in _context.Users on x.modifiedBy equals z.id into modifies
                                       from z in modifies.DefaultIfEmpty()
                                       select new CountryView()
                                       {
                                           Code = x.Code,
                                           modifiedBy = x.modifiedBy,
                                           createdBy = x.createdBy,
                                           createdByName = Common.GetFullName(y),
                                           createdDate = x.createdDate,
                                           Id = x.Id,
                                           modifiedByName = Common.GetFullName(z),
                                           modifiedDate = x.modifiedDate,
                                           Name = x.Name

                                       }).AsQueryable();

                switch (request.sort)
                {
                    case "code":
                        query = (request.sortOrder == "Descending" ? query.OrderByDescending(x => x.Code) : query.OrderBy(x => x.Code));
                        break;
                    case "modifiedBy":
                        query = (request.sortOrder == "Descending" ? query.OrderByDescending(x => x.modifiedBy) :
                            query.OrderBy(x => x.modifiedBy));
                        break;
                    case "createdBy":
                        query = (request.sortOrder == "Descending" ? query.OrderByDescending(x => x.createdBy) : query.OrderBy(x => x.createdBy));
                        break;
                    case "createdDate":
                        query = (request.sortOrder == "Descending" ? query.OrderByDescending(x => x.createdDate) : query.OrderBy(x => x.createdDate));
                        break;
                    case "modifiedName":
                        query = (request.sortOrder == "Descending" ? query.OrderByDescending(x => x.modifiedBy) : query.OrderBy(x => x.modifiedBy));
                        break;
                    case "modifiedDate":
                        query = (request.sortOrder == "Descending" ? query.OrderByDescending(x => x.modifiedDate) : query.OrderBy(x => x.modifiedDate));
                        break;
                    case "id":
                        query = (request.sortOrder == "Descending" ? query.OrderByDescending(x => x.Id) : query.OrderBy(x => x.Id));
                        break;
                    case "name":
                        query = (request.sortOrder == "Descending" ? query.OrderByDescending(x => x.Name) : query.OrderBy(x => x.Name));
                        break;

                    default:
                        break;
                }

                response.Data = new PagedList<CountryView>(
                query, request);
                response.Success = true;
                response.Message = "Data Retrived";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = await CustomLog.Log(ex, _context);
            }
            return response;
        }

        // GET: api/Countries/5
        [HttpGet("{id}")]
        public async Task<ServiceResponse<Country>> GetCountry(int id)
        {
            var response = new ServiceResponse<Country>();
            try
            {
                response.Data = await _context.Countries.FindAsync(id);
                if (response.Data == null)
                {
                    response.Success = false;
                    response.Message = "Data not found";
                    return response;
                }
                response.Success = true;
                response.Message = "Data Retrived";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = await CustomLog.Log(ex, _context);
            }
            return response;
        }

        // GET: api/Countries/5
        [HttpGet("GetCountriesByUserId")]
        public async Task<ServiceResponse<List<Country>>> GetCountriesByUserId()
        {
            var response = new ServiceResponse<List<Country>>();
            try
            {
                var user = _context.Users.FirstOrDefault(x => x.id == LoggedInUser);
                response.Data = user.roleId == (int)Roles.SuperAdmin ? _context.Countries.ToList() : _context.Countries.Where(x => x.Id == user.country).ToList();
                if (response.Data == null)
                {
                    response.Success = false;
                    response.Message = "Data not found";
                    return response;
                }
                response.Success = true;
                response.Message = "Data Retrived";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = await CustomLog.Log(ex, _context);
            }
            return response;
        }

        [Route("GetJobCode/{id}")]
        [HttpGet]
        public async Task<ServiceResponse<string>> GetJobCode(int id)
        {
            var response = new ServiceResponse<string>();
            try
            {
                var item = await _context.Countries.FirstOrDefaultAsync(x => x.Id == id);
                var newId = _context.Openings.Any() ? _context.Openings.Max(x => x.id) : 0;
                response.Data = item.Code + "-" + (newId + 1).ToString("00000");
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
        // PUT: api/Countries/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<ServiceResponse<int>> PutCountry(int id, Country country)
        {
            var response = new ServiceResponse<int>();
            try
            {
                if (id != country.Id)
                {
                    response.Success = false;
                    response.Message = "Invalid country";
                    return response;
                }

                var item = _context.Countries.Find(id);
                if (item == null)
                {
                    response.Success = false;
                    response.Message = "Countries not found";
                    return response;
                }
                country.modifiedBy = LoggedInUser;
                country.modifiedDate = DateTime.UtcNow;
                _context.Entry(item).CurrentValues.SetValues(country);
                await _context.SaveChangesAsync();
                response.Success = true;
                response.Message = "Countries updated successfully";
                response.Data = country.Id;
            }
            catch (DbUpdateConcurrencyException ex)
            {
                if (!CountryExists(id))
                {
                    response.Success = false;
                    response.Message = "Country not found";
                }
                else
                {
                    response.Success = false;
                    response.Message = await CustomLog.Log(ex, _context);
                }
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = await CustomLog.Log(ex, _context);
            }

            return response;
        }

        // POST: api/Countries
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ServiceResponse<int>> PostCountry(Country country)
        {
            _context.Countries.Add(country);
            var response = new ServiceResponse<int>();
            try
            {
                if (country == null || country.Id > 0)
                {
                    response.Success = false;
                    response.Message = "Invalid country info";
                } else
                {
                    country.createdBy = LoggedInUser;
                    country.createdDate = DateTime.UtcNow;
                    _context.Countries.Add(country);
                    await _context.SaveChangesAsync();
                    response.Data = country.Id;
                    response.Success = true;
                    response.Message = "Country added successfully";
                }
               
            }
            catch (DbUpdateException e)
  when (e.InnerException?.InnerException is SqlException sqlEx &&
    (sqlEx.Number == 2601 || sqlEx.Number == 2627))
            {
                response.Success = false;
                await CustomLog.Log(e, _context);
                response.Message = "Country already Exists";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = await CustomLog.Log(ex, _context);
            }


            return response;
        }

        // DELETE: api/Countries/5
        [HttpDelete("{id}")]
        public async Task<ServiceResponse<bool>> DeleteCountry(int id)
        {
            var response = new ServiceResponse<bool>();
            try
            {
                var masterData = await _context.Countries.FindAsync(id);
                if (masterData == null)
                {
                    response.Success = false;
                    response.Message = "Invalid Country";
                    return response;
                }

                _context.Countries.Remove(masterData);
                await _context.SaveChangesAsync();
                response.Success = true;
                response.Message = "Country deleted successfully";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = await CustomLog.Log(ex, _context);
            }


            return response;
        }

        private bool CountryExists(int id)
        {
            return _context.Countries.Any(e => e.Id == id);
        }
    }
}
