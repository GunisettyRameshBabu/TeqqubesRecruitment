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
    public class ClientCodesController : Base
    {
        private readonly DataContext _context;

        public ClientCodesController(DataContext context)
        {
            _context = context;
        }

        // GET: api/ClientCodes
        [HttpGet]
        public async Task<ServiceResponse<IEnumerable<ClientCodesView>>> GetAllClientCodes()
        {
            var response = new ServiceResponse<IEnumerable<ClientCodesView>>();
            try
            {
                response.Data = await (from x in _context.ClientCodes
                                       join c in _context.Users on x.createdBy equals c.id
                                       join m in _context.Users on x.modifiedBy equals m.id into modifies
                                       from m in modifies.DefaultIfEmpty()
                                       select new ClientCodesView()
                                       {
                                           Code = x.Code,
                                           createdBy = x.createdBy,
                                           createdByName = Common.GetFullName(c),
                                           createdDate = x.createdDate,
                                           Id = x.Id,
                                           modifiedBy = x.modifiedBy,
                                           ModifiedByName = Common.GetFullName(m),
                                           modifiedDate = x.modifiedDate,
                                           Name = x.Name,
                                           url = x.url
                                       }).ToListAsync();
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
        [Route("GetClientCodes")]
        public async Task<ServiceResponse<PagedList<ClientCodesView>>> GetClientCodes(CustomPagingRequest request)
        {
            var response = new ServiceResponse<PagedList<ClientCodesView>>();
            try
            {
                var query = (from x in _context.ClientCodes
                                       join c in _context.Users on x.createdBy equals c.id
                                       join m in _context.Users on x.modifiedBy equals m.id into modifies
                                       from m in modifies.DefaultIfEmpty()
                                       select new ClientCodesView()
                                       {
                                           Code = x.Code,
                                           createdBy = x.createdBy,
                                           createdByName = Common.GetFullName(c),
                                           createdDate = x.createdDate,
                                           Id = x.Id,
                                           modifiedBy = x.modifiedBy,
                                           ModifiedByName = Common.GetFullName(m),
                                           modifiedDate = x.modifiedDate,
                                           Name = x.Name,
                                           url = x.url
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
                    case "url":
                        query = (request.sortOrder == "Descending" ? query.OrderByDescending(x => x.url) : query.OrderBy(x => x.url));
                        break;

                    default:
                        break;
                }

                response.Data = new PagedList<ClientCodesView>(
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

        // GET: api/ClientCodes/5
        [HttpGet("{id}")]
        public async Task<ServiceResponse<ClientCodes>> GetClientCodes(int id)
        {
            var response = new ServiceResponse<ClientCodes>();
            try
            {
                response.Data = await _context.ClientCodes.FindAsync(id);
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

        // PUT: api/ClientCodes/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<ServiceResponse<int>> PutClientCodes(int id, ClientCodes clientCodes)
        {
            var response = new ServiceResponse<int>();
            try
            {
                if (id != clientCodes.Id)
                {
                    response.Success = false;
                    response.Message = "Invalid Client";
                    return response;
                }

                var item = _context.ClientCodes.Find(id);
                if (item == null)
                {
                    response.Success = false;
                    response.Message = "Client not found";
                    return response;
                }
                clientCodes.modifiedDate = DateTime.UtcNow;
                clientCodes.modifiedBy = LoggedInUser;
                _context.Entry(item).CurrentValues.SetValues(clientCodes);
                await _context.SaveChangesAsync();
                response.Success = true;
                response.Message = "Client updated successfully";
                response.Data = clientCodes.Id;
            }
            catch (DbUpdateConcurrencyException ex)
            {
                if (!ClientCodesExists(id))
                {
                    response.Success = false;
                    response.Message = "Client not found";
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

        // POST: api/ClientCodes
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ServiceResponse<int>> PostClientCodes(ClientCodes clientCodes)
        {
            var response = new ServiceResponse<int>();
            try
            {
                clientCodes.createdDate = DateTime.UtcNow;
                clientCodes.createdBy = LoggedInUser;
                _context.ClientCodes.Add(clientCodes);
                await _context.SaveChangesAsync();
                response.Data = clientCodes.Id;
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

        // DELETE: api/ClientCodes/5
        [HttpDelete("{id}")]
        public async Task<ServiceResponse<bool>> DeleteClientCodes(int id)
        {
            var response = new ServiceResponse<bool>();
            try
            {
                var masterData = await _context.ClientCodes.FindAsync(id);
                if (masterData == null)
                {
                    response.Success = false;
                    response.Message = "Invalid Client";
                    return response;
                }

                _context.ClientCodes.Remove(masterData);
                await _context.SaveChangesAsync();
                response.Success = true;
                response.Message = "Client deleted successfully";
            }
            catch (Exception ex)
            {
                response.Success = false;
                 response.Message = await CustomLog.Log(ex, _context);
            }


            return response;
        }

        private bool ClientCodesExists(int id)
        {
            return _context.ClientCodes.Any(e => e.Id == id);
        }
    }
}
