using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
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
    public class MasterDatasController : Base
    {
        private readonly DataContext _context;

        public MasterDatasController(DataContext context)
        {
            _context = context;
        }

        // GET: api/MasterDatas
        [HttpPost]
        [Route("GetMasterData")]
        public async Task<ServiceResponse<PagedList<MasterDataView>>> GetMasterData(CustomPagingRequest request)
        {
            var response = new ServiceResponse<PagedList<MasterDataView>>();
            try
            {
                var query =  (from x in _context.MasterData
                                       join y in _context.MasterDataType on x.type equals y.id
                                       join c in _context.Users on x.createdBy equals c.id
                                       join m in _context.Users on x.modifiedBy equals m.id into modifies
                                       from m in modifies.DefaultIfEmpty()
                                       select new MasterDataView()
                                       {
                                            id = x.id,
                                            modifiedBy = x.modifiedBy,
                                            createdBy = x.createdBy,
                                            createdDate = x.createdDate,
                                            createdName = Common.GetFullName(c),
                                            modifiedName = Common.GetFullName(m),
                                            modifiedDate = x.modifiedDate,
                                            name = x.name,
                                            type = x.type,
                                            typeName = y.name
                                       }).AsQueryable();
                switch (request.sort)
                {
                    case "type":
                    case "typeName":
                        query = (request.sortOrder == "Descending" ? query.OrderByDescending(x => x.type) : query.OrderBy(x => x.type));
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
                        query = (request.sortOrder == "Descending" ? query.OrderByDescending(x => x.id) : query.OrderBy(x => x.id));
                        break;
                    case "name":
                        query = (request.sortOrder == "Descending" ? query.OrderByDescending(x => x.name) : query.OrderBy(x => x.name));
                        break;

                    default:
                        break;
                }

                response.Data = new PagedList<MasterDataView>(
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

        // GET: api/MasterDatas/5
        [HttpGet("{id}")]
        public async Task<ServiceResponse<MasterData>> GetMasterData(int id)
        {
            var response = new ServiceResponse<MasterData>();
            try
            {
                response.Data = await _context.MasterData.FindAsync(id);
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

        // GET: api/MasterDatas/5
        [HttpGet("GetMasterDataByType/{id}/{includeDefault}")]
        public async Task<ServiceResponse<IList<MasterData>>> GetMasterDataByType(int id,bool includeDefault)
        {
            var response = new ServiceResponse<IList<MasterData>>();
            try
            {
                
                if (Enum.IsDefined(typeof(MasterDataTypes), id))
                {
                    response.Data = await _context.MasterData.Where(x => x.type == id).OrderByDescending(x => x.type).ToListAsync();
                    if (includeDefault)
                    {
                        var list = await _context.MasterData.Where(x => x.type == (int)MasterDataTypes.Common).ToListAsync();
                        foreach (var item in list)
                        {
                            response.Data.Insert(0, item);
                        }
                    }
                    if (response.Data == null)
                    {
                        response.Success = false;
                        response.Message = "Data not found";
                        return response;
                    }
                    response.Success = true;
                    response.Message = "Data Retrived";
                } else
                {
                    response.Success = false;
                    response.Message = "Invalid Master type, please check";
                }
                
            }
            catch (Exception ex)
            {
                response.Success = false;
                 response.Message = await CustomLog.Log(ex, _context);
            }
            return response;
        }

        // PUT: api/MasterDatas/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<ServiceResponse<int>> PutMasterData(int id, MasterData masterData)
        {
            var response = new ServiceResponse<int>();
            try
            {
                if (id != masterData.id)
                {
                    response.Success = false;
                    response.Message = "Invalid master data";
                    return response;
                }

                var item = _context.MasterData.Find(id);
                if (item == null)
                {
                    response.Success = false;
                    response.Message = "Master Data not found";
                    return response;
                }
                masterData.modifiedBy = LoggedInUser;
                masterData.modifiedDate = DateTime.UtcNow;
                _context.Entry(item).CurrentValues.SetValues(masterData);
                await _context.SaveChangesAsync();
                response.Success = true;
                response.Message = "Master Data updated successfully";
                response.Data = masterData.id;
            }
            catch (DbUpdateConcurrencyException ex)
            {
                if (!MasterDataExists(id))
                {
                    response.Success = false;
                    response.Message = "Master Data not found";
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

        // POST: api/MasterDatas
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ServiceResponse<int>> PostMasterData(MasterData masterData)
        {
            var response = new ServiceResponse<int>();
            try
            {
                masterData.createdBy = LoggedInUser;
                masterData.createdDate = DateTime.UtcNow;
                _context.MasterData.Add(masterData);
                await _context.SaveChangesAsync();
                response.Data = masterData.id;
                response.Success = true;
                response.Message = "Master data added successfully";
            }
            catch (Exception ex)
            {
                response.Success = false;
                 response.Message = await CustomLog.Log(ex, _context);
            }
            

            return response;
        }

        // DELETE: api/MasterDatas/5
        [HttpDelete("{id}")]
        public async Task<ServiceResponse<bool>> DeleteMasterData(int id)
        {
            var response = new ServiceResponse<bool>();
            try
            {
                var masterData = await _context.MasterData.FindAsync(id);
                if (masterData == null)
                {
                    response.Success = false;
                    response.Message = "Invalid master data";
                    return response;
                }

                _context.MasterData.Remove(masterData);
                await _context.SaveChangesAsync();
                response.Success = true;
                response.Message = "Master data deleted successfully";
            }
            catch (Exception ex)
            {
                response.Success = false;
                 response.Message = await CustomLog.Log(ex, _context);
            }
           

            return response;
        }

        private bool MasterDataExists(int id)
        {
            return _context.MasterData.Any(e => e.id == id);
        }
    }
}
