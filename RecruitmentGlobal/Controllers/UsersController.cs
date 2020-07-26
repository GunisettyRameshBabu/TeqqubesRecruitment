using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using RecruitmentApi.Data;
using RecruitmentApi.Models;
using RecruitmentGlobal.Models;

namespace RecruitmentApi.Controllers
{
    [Authorize]
    
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : Base
    {
        private readonly DataContext _context;
        private byte[] _key;
        private byte[] _iv;
        private TripleDESCryptoServiceProvider _provider;
        private readonly IMapper _mapper;
        private readonly AppSettings _appSettings;

        public UsersController(DataContext context, IMapper mapper, IOptions<AppSettings> appSettings)
        {
            _context = context;
            _mapper = mapper;
            _key = System.Text.ASCIIEncoding.ASCII.GetBytes("GSYAHAGCBDUUADIADKOPAAAW");
            _iv = System.Text.ASCIIEncoding.ASCII.GetBytes("USAZBGAW");
            _provider = new TripleDESCryptoServiceProvider();
            _appSettings = appSettings.Value;
        }

        // GET: api/Users
        [HttpPost]
        [Route("GetUsers")]
        public async Task<ActionResult> GetUsers(CustomPagingRequest request)
        {
            var response = new ServiceResponse<PagedList<UserView>>();
            try
            {

                var query = (from x in _context.Users
                                       join y in _context.MasterData on x.roleId equals y.id
                                       join c in _context.Countries on x.country equals c.Id into countries
                                       from c in countries.DefaultIfEmpty()
                                       select new UserView()
                                       {
                                           id = x.id,
                                           email = x.email,
                                           firstName = x.firstName,
                                           lastName = x.lastName,
                                           middleName = x.middleName,
                                           role = y.name,
                                           userid = x.userid,
                                           roleId = x.roleId,
                                           countryName = c.Name,
                                           countryId = c.Id,
                                           active = x.active,
                                           modifiedDate = x.modifiedDate,
                                           createdDate = x.createdDate,
                                           createdBy = x.createdBy,
                                           modifiedBy = x.modifiedBy
                                       }).AsQueryable();
                switch (request.sort)
                {
                    case "id":
                        query = (request.sortOrder == "Descending" ? query.OrderByDescending(x => x.id) : query.OrderBy(x => x.id));
                        break;
                    case "email":
                        query = (request.sortOrder == "Descending" ? query.OrderByDescending(x => x.email) :
                            query.OrderBy(x => x.email));
                        break;
                    case "firstName":
                        query = (request.sortOrder == "Descending" ? query.OrderByDescending(x => x.firstName) : query.OrderBy(x => x.firstName));
                        break;
                    case "lastName":
                        query = (request.sortOrder == "Descending" ? query.OrderByDescending(x => x.lastName) : query.OrderBy(x => x.lastName));
                        break;
                    case "middleName":
                        query = (request.sortOrder == "Descending" ? query.OrderByDescending(x => x.middleName) : query.OrderBy(x => x.middleName));
                        break;
                    case "role":
                    case "roleId":
                        query = (request.sortOrder == "Descending" ? query.OrderByDescending(x => x.roleId) : query.OrderBy(x => x.roleId));
                        break;
                    case "userid":
                        query = (request.sortOrder == "Descending" ? query.OrderByDescending(x => x.userid) : query.OrderBy(x => x.userid));
                        break;
                    case "countryName":
                    case "countryId":
                        query = (request.sortOrder == "Descending" ? query.OrderByDescending(x => x.countryId) : query.OrderBy(x => x.countryId));
                        break;
                    case "active":
                        query = (request.sortOrder == "Descending" ? query.OrderByDescending(x => x.active) : query.OrderBy(x => x.active));
                        break;
                    case "modifiedDate":
                        query = (request.sortOrder == "Descending" ? query.OrderByDescending(x => x.modifiedDate) : query.OrderBy(x => x.modifiedDate));
                        break;
                    case "createdDate":
                        query = (request.sortOrder == "Descending" ? query.OrderByDescending(x => x.createdDate) : query.OrderBy(x => x.createdDate));
                        break;
                    case "createdBy":
                        query = (request.sortOrder == "Descending" ? query.OrderByDescending(x => x.createdBy) : query.OrderBy(x => x.createdBy));
                        break;
                    case "modifiedBy":
                        query = (request.sortOrder == "Descending" ? query.OrderByDescending(x => x.modifiedBy) : query.OrderBy(x => x.modifiedBy));
                        break;
                    default:
                        break;
                }

                response.Data = new PagedList<UserView>(
                query, request);
                response.Success = true;
                response.Message = "Success";
            }
            catch (Exception ex)
            {
                 response.Message = await CustomLog.Log(ex, _context);
                response.Success = false;
            }

            return Ok(response);

        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Users>> GetUsers(int id)
        {
            var users = await _context.Users.FindAsync(id);

            if (users == null)
            {
                return NotFound();
            }

            return users;
        }

        // GET: api/Users/5
        [HttpGet("GetUsersByCountry")]
        public async Task<ServiceResponse<List<UserList>>> GetUsersByCountry()
        {
            var response = new ServiceResponse<List<UserList>>();
            try
            {
                response.Data = await (from x in _context.Users
                                       select new UserList
                                       {
                                           id = x.id,
                                           name = Common.GetFullName(x),
                                           country = x.country
                                       }).AsQueryable().ToListAsync();
                response.Message = "Users List";
                response.Success = true;

            }
            catch (Exception ex)
            {
                 response.Message = await CustomLog.Log(ex, _context);
                response.Success = false;
            }


            return response;
        }

        // PUT: api/Users/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPut("{id}")]
        public async Task<ServiceResponse<bool>> PutUsers(int id, UserDto users)
        {
            var response = new ServiceResponse<bool>();
            try
            {
                if (id != users.id)
                {
                    response.Success = false;
                    response.Message = "Invalid user id";
                    return response;
                }
                var user = await _context.Users.FindAsync(id);
                users.password = user.password;
                user.modifiedBy = LoggedInUser;
                users.modifiedDate = DateTime.UtcNow;
                var usr = _mapper.Map<Users>(users);
                _context.Entry(user).CurrentValues.SetValues(usr);
                await _context.SaveChangesAsync();
                response.Success = true;
                response.Message = "User updated successfully";
            }
            catch (Exception ex)
            {
                if (!UsersExists(id))
                {
                    response.Success = false;
                    response.Message = "User not found";
                    return response;
                }
                else
                {
                    response.Success = false;
                     response.Message = await CustomLog.Log(ex, _context);
                    return response;
                }
            }
            return response;
        }

        // POST: api/Users
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPost]
        public async Task<ActionResult<Users>> PostUsers(UserDto users)
        {

            users.password = EncodePasswordToBase64(users.password);
            var user = _mapper.Map<Users>(users);
            user.createdBy = LoggedInUser;
            user.createdDate = DateTime.UtcNow;
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetUsers", new { id = users.id }, users);
        }

        // DELETE: api/Users/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Users>> DeleteUsers(int id)
        {
            var users = await _context.Users.FindAsync(id);
            if (users == null)
            {
                return NotFound();
            }

            _context.Users.Remove(users);
            await _context.SaveChangesAsync();

            return users;
        }

        // GET: api/Users/UserExists
        [HttpGet("UserExists")]
        public ActionResult<bool> CheckUsersExists(string userid)
        {
            return _context.Users.Any(e => e.userid == userid);
        }

        [AllowAnonymous]
        [HttpPost("Login")]
        public async Task<IActionResult> Login(UserLoginDto userdto)
        {

            var response = await validateUser(userdto);
            return Ok(response);
        }

        // GET: api/Users/Logout
        [AllowAnonymous]
        [HttpGet("Logout/{id}")]
        public async Task<ServiceResponse<bool>> Logout(string id)
        {
            var response = new ServiceResponse<bool>();
            try
            {
                var session = _context.UserSession.Find(id);
                if (session == null)
                {
                    response.Message = "Invalid session";
                    response.Success = false;
                    return response;
                }

                session.outTime = DateTime.UtcNow;
                _context.Entry(session).CurrentValues.SetValues(session);
                await _context.SaveChangesAsync();
                response.Message = "Logout Successfully";
                response.Success = true;
            }
            catch (Exception ex)
            {
                 response.Message = await CustomLog.Log(ex, _context);
                response.Success = false;
            }
            return response;
        }

        [AllowAnonymous]
        // GET: api/Users/Logout
        [HttpGet("ResetPassword/{id}")]
        public async Task<ServiceResponse<bool>> ResetPassword(string id)
        {
            var response = new ServiceResponse<bool>();
            try
            {
                var user = _context.Users.FirstOrDefault(x => x.userid == id);
                if (user == null)
                {
                    response.Message = "User Details not found";
                    response.Success = false;
                    return response;
                } else if(!user.active)
                {
                    response.Message = "User is inactive , Please contact admin";
                    response.Success = false;
                    return response;
                }

                user.password = EncodePasswordToBase64("User@123");
                user.passwordChangeRequired = true;
                _context.Entry(user).CurrentValues.SetValues(user);
                await _context.SaveChangesAsync();
                response.Message = "Password Changed Successfully";
                response.Success = true;
            }
            catch (Exception ex)
            {
                response.Message = await CustomLog.Log(ex, _context);
                response.Success = false;
            }
            return response;
        }

        [AllowAnonymous]
      
        [HttpPost("ChangePassword")]
        public async Task<ServiceResponse<bool>> ChangePassword(PasswordChangeModel passwordChangeModel)
        {
            var response = new ServiceResponse<bool>();
            try
            {
                var user = _context.Users.FirstOrDefault(x => x.id == passwordChangeModel.id);
                if (user == null)
                {
                    response.Message = "User Details not found";
                    response.Success = false;
                    return response;
                }
                else if (!user.active)
                {
                    response.Message = "User is inactive , Please contact admin";
                    response.Success = false;
                    return response;
                }

                user.password = EncodePasswordToBase64(passwordChangeModel.password);
                user.passwordChangeRequired = false;
                _context.Entry(user).CurrentValues.SetValues(user);
                await _context.SaveChangesAsync();
                response.Message = "Password Changed Successfully";
                response.Success = true;
            }
            catch (Exception ex)
            {
                response.Message = await CustomLog.Log(ex, _context);
                response.Success = false;
            }
            return response;
        }

        private async Task<ServiceResponse<UserDto>> validateUser(UserLoginDto userdto)
        {
            var response = new ServiceResponse<UserDto>();
            try
            {
                response.Data = await (from x in _context.Users
                                       join y in _context.MasterData on x.roleId equals y.id
                                       where x.userid.ToLower() == userdto.UserId.ToLower()
                                       select new UserDto()
                                       {
                                           id = x.id,
                                           roleId = x.roleId,
                                           active = x.active,
                                           countryId = x.country,
                                           email = x.email,
                                           firstName = x.firstName,
                                           lastName = x.lastName,
                                           loginTypes = x.loginTypes,
                                           middleName = x.middleName,
                                           roleName = y.name,
                                           userid = x.userid,
                                           password = x.password,
                                           passwordChangeRequired = x.passwordChangeRequired
                                       }).FirstOrDefaultAsync();
                if (response.Data == null)
                {
                    response.Success = false;
                    response.Message = "User not found.";
                }
                else if (DecodeFrom64(response.Data.password) != userdto.Password)
                {
                    response.Success = false;
                    response.Message = "Wrong password.";
                }
                //else if((string.IsNullOrEmpty(user.loginTypes) || !user.loginTypes.Split(',').Contains(userdto.LoginType.ToString())) && user.loginTypes != "Admin")
                //{
                //    response.Success = false;
                //    response.Message = "You are not authorized to view this content";
                //}
                else
                {
                    response.Success = true;
                    var userSession = new UserSession();
                    userSession.sessionId = Guid.NewGuid().ToString();
                    userSession.userid = response.Data.id;
                    userSession.inTime = DateTime.UtcNow;
                    _context.UserSession.Add(userSession);
                    _context.SaveChanges();
                    response.Data.sessionId = userSession.sessionId;
                    response.Data = GenerateToken(response.Data);
                    response.Message = "Login Success";
                }
            }
            catch (Exception ex)
            {
                response.Success = false;
                 response.Message = await CustomLog.Log(ex, _context);
            }


            return response;
        }

        private UserDto GenerateToken(UserDto user)
        {
            // authentication successful so generate jwt token
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_appSettings.Secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, user.id.ToString(),ClaimValueTypes.Integer32)
                }),
                Expires = DateTime.UtcNow.AddHours(8),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            user.token = tokenHandler.WriteToken(token);
            return user;
        }

        private bool UsersExists(int id)
        {
            return _context.Users.Any(e => e.id == id);
        }

        //this function Convert to Encord your Password 
        private string EncodePasswordToBase64(string password)
        {
            try
            {
                byte[] encData_byte = new byte[password.Length];
                encData_byte = System.Text.Encoding.UTF8.GetBytes(password);
                string encodedData = Convert.ToBase64String(encData_byte);
                return encodedData;
            }
            catch (Exception ex)
            {
                throw new Exception("Error in base64Encode" + ex.Message);
            }
        } //this function Convert to Decord your Password
        private string DecodeFrom64(string encodedData)
        {
            System.Text.UTF8Encoding encoder = new System.Text.UTF8Encoding();
            System.Text.Decoder utf8Decode = encoder.GetDecoder();
            byte[] todecode_byte = Convert.FromBase64String(encodedData);
            int charCount = utf8Decode.GetCharCount(todecode_byte, 0, todecode_byte.Length);
            char[] decoded_char = new char[charCount];
            utf8Decode.GetChars(todecode_byte, 0, todecode_byte.Length, decoded_char, 0);
            string result = new String(decoded_char);
            return result;
        }
    }
}
