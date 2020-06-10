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

namespace RecruitmentApi.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class MasterDataTypesController : ControllerBase
    {
        private readonly DataContext _context;

        public MasterDataTypesController(DataContext context)
        {
            _context = context;
        }

        // GET: api/MasterDataTypes
        [HttpGet]
        public async Task<ServiceResponse<IEnumerable<MasterDataType>>> GetMasterDataType()
        {
            var response = new ServiceResponse<IEnumerable<MasterDataType>>();
            try
            {
                response.Data = await _context.MasterDataType.ToListAsync();
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

        // GET: api/MasterDataTypes/5
        [HttpGet("{id}")]
        public async Task<ServiceResponse<MasterDataType>> GetMasterDataType(int id)
        {
            var response = new ServiceResponse<MasterDataType>();
            try
            {
                response.Data = await _context.MasterDataType.FindAsync(id);
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

        // PUT: api/MasterDataTypes/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<ServiceResponse<int>> PutMasterDataType(int id, MasterDataType masterDataType)
        {
            var response = new ServiceResponse<int>();
            try
            {
                if (id != masterDataType.id)
                {
                    response.Success = false;
                    response.Message = "Invalid master data";
                    return response;
                }

                var item = _context.MasterDataType.Find(id);
                if (item == null)
                {
                    response.Success = false;
                    response.Message = "Master Data type not found";
                    return response;
                }
                _context.Entry(item).CurrentValues.SetValues(masterDataType);
                await _context.SaveChangesAsync();
                response.Success = true;
                response.Message = "Master Data type updated successfully";
                response.Data = masterDataType.id;
            }
            catch (DbUpdateConcurrencyException ex)
            {
                if (!MasterDataTypeExists(id))
                {
                    response.Success = false;
                    response.Message = "Master Data type not found";
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

        // POST: api/MasterDataTypes
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ServiceResponse<int>> PostMasterDataType(MasterDataType masterDataType)
        {
            var response = new ServiceResponse<int>();
            try
            {
                _context.MasterDataType.Add(masterDataType);
                await _context.SaveChangesAsync();
                response.Data = masterDataType.id;
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

        // DELETE: api/MasterDataTypes/5
        [HttpDelete("{id}")]
        public async Task<ServiceResponse<bool>> DeleteMasterDataType(int id)
        {
            var response = new ServiceResponse<bool>();
            try
            {
                var masterData = await _context.MasterData.FindAsync(id);
                if (masterData == null)
                {
                    response.Success = false;
                    response.Message = "Invalid master data type";
                    return response;
                }

                _context.MasterData.Remove(masterData);
                await _context.SaveChangesAsync();
                response.Success = true;
                response.Message = "Master data type deleted successfully";
            }
            catch (Exception ex)
            {
                response.Success = false;
                 response.Message = await CustomLog.Log(ex, _context);
            }


            return response;
        }

        private bool MasterDataTypeExists(int id)
        {
            return _context.MasterDataType.Any(e => e.id == id);
        }
    }
}
