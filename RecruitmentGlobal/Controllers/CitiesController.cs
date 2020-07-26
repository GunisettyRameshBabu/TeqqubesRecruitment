using System;
using System.Collections.Generic;
using System.Linq;
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
    public class CitiesController : Base
    {
        private readonly DataContext _context;

        public CitiesController(DataContext context)
        {
            _context = context;
        }

        // GET: api/Cities
        [HttpPost]
        [Route("GetCities")]
        public async Task<ServiceResponse<PagedList<CityView>>> GetCitys(CustomPagingRequest request)
        {
            var response = new ServiceResponse<PagedList<CityView>>();
            try
            {
                var query = (from x in _context.Citys
                                      join y in _context.State on x.State equals y.Id 
                                      join z in _context.Countries on y.Country equals z.Id
                                      join c in _context.Users on x.createdBy equals c.id
                                      join m in _context.Users on x.modifiedBy equals m.id into modifies
                                      from m in modifies.DefaultIfEmpty()
                                      select new CityView()
                                      { 
                                          modifiedBy = x.modifiedBy,
                                          countryName = z.Name,
                                          createdBy = x.createdBy,
                                          createdByName = Common.GetFullName(c),
                                          createdDate = x.createdDate,
                                          modifiedByName = Common.GetFullName(m),
                                          modifiedDate = x.modifiedDate,
                                          stateName = y.Name,
                                          Name = x.Name,
                                          Id = x.Id,
                                          State = x.State,
                                          country = y.Country
                                      }).AsQueryable();

                switch (request.sort)
                {
                    case "countryName":
                        query = (request.sortOrder == "Descending" ? query.OrderByDescending(x => x.country) : query.OrderBy(x => x.country));
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
                    case "stateName":
                        query = (request.sortOrder == "Descending" ? query.OrderByDescending(x => x.State) : query.OrderBy(x => x.State));
                        break;
                    
                    default:
                        break;
                }

                response.Data = new PagedList<CityView>(
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

        // GET: api/Cities/5
        [HttpGet("{id}")]
        public async Task<ServiceResponse<City>> GetCity(int id)
        {
            var response = new ServiceResponse<City>();
            try
            {
                response.Data = await _context.Citys.FindAsync(id);
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

        [Route("GetCitiesByState/{id}/{includeDefaults}")]
        [HttpGet]
        public async Task<ServiceResponse<IList<City>>> GetCitiesByState(int id,bool includeDefaults)
        {
            var response = new ServiceResponse<IList<City>>();
            try
            {
                response.Data = await _context.Citys.Where(x => x.State == id).OrderBy(x => x.Name).ToListAsync();
                if (includeDefaults)
                {
                    var items = await _context.MasterData.Where(x => x.type == (int)MasterDataTypes.Common).ToListAsync();
                    foreach (var item in items)
                    {
                        response.Data.Add(new City()
                        {
                            Name = item.name,
                            Id = item.id
                        });
                    }
                }
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



        // PUT: api/Cities/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<ServiceResponse<int>> PutCity(int id, City city)
        {
            var response = new ServiceResponse<int>();
            try
            {
                if (id != city.Id)
                {
                    response.Success = false;
                    response.Message = "Invalid city";
                    return response;
                }

                var item = _context.Citys.Find(id);
                if (item == null)
                {
                    response.Success = false;
                    response.Message = "City not found";
                    return response;
                }
                city.modifiedBy = LoggedInUser;
                city.modifiedDate = DateTime.UtcNow;
                _context.Entry(item).CurrentValues.SetValues(city);
                await _context.SaveChangesAsync();
                response.Success = true;
                response.Message = "City updated successfully";
                response.Data = city.Id;
            }
            catch (DbUpdateConcurrencyException ex)
            {
                if (!CityExists(id))
                {
                    response.Success = false;
                    response.Message = "City not found";
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

        // POST: api/Cities
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ServiceResponse<int>> PostCity(City city)
        {
            var response = new ServiceResponse<int>();
            try
            {
                city.createdBy = LoggedInUser;
                city.createdDate = DateTime.UtcNow;
                _context.Citys.Add(city);
                await _context.SaveChangesAsync();
                response.Data = city.Id;
                response.Success = true;
                response.Message = "Master data type added successfully";
            }
            catch (Exception ex)
            {
                response.Success = false;
                 response.Message = await CustomLog.Log(ex, _context);
            }


            return response;
        }

        // DELETE: api/Cities/5
        [HttpDelete("{id}")]
        public async Task<ServiceResponse<bool>> DeleteCity(int id)
        {
            var response = new ServiceResponse<bool>();
            try
            {
                var masterData = await _context.Citys.FindAsync(id);
                if (masterData == null)
                {
                    response.Success = false;
                    response.Message = "Invalid City";
                    return response;
                }

                _context.Citys.Remove(masterData);
                await _context.SaveChangesAsync();
                response.Success = true;
                response.Message = "City deleted successfully";
            }
            catch (Exception ex)
            {
                response.Success = false;
                 response.Message = await CustomLog.Log(ex, _context);
            }


            return response;
        }

        private bool CityExists(int id)
        {
            return _context.Citys.Any(e => e.Id == id);
        }
    }
}
