using System;
using System.Threading.Tasks;
using AspNetCore.UnitOfWork;
using Microsoft.AspNetCore.Mvc;
using SignalRWebPack.Authorization;
using SignalRWebPack.Identity;
using SignalRWebPack.Models;
using static ResponseResult.ResponseResult;
using SignalRWebPack.Helpers;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Authorization;

namespace SignalRWebPack.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        public UsersController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<IActionResult> CreateUser([FromBody] UserModel model)
        {
            //check model
            if (!ModelState.IsValid)
                return BadRequestResponse(ModelState);


            //check existed email
            if (await _unitOfWork.Repository<User>().IsExistAsync(x => x.Email == model.Email))
                return BadRequest("Email Existed");

            //insert new account
            var salt = TokenFactory.CreateRandomSalt();
            var user = new User
            {
                Email = model.Email,
                FirstName = model.FirstName,
                LastName = model.LastName,
                PasswordSalt = salt,
                PasswordHash = TokenFactory.CreateHashed(model.Password, salt)
            };

            await _unitOfWork.Repository<User>().InsertAsync(user);
            await _unitOfWork.SaveAsync();
            return SuccessResponse();
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody]LoginModel model, [FromServices]IConfiguration config)
        {
            //check model state
            if (!ModelState.IsValid)
                return BadRequestResponse(ModelState);

            //check user email
            var user = await _unitOfWork.Repository<User>().GetFirstOrDefaultAsync(predicate: x => x.Email == model.Email);
            if (user == null)
                return BadRequestResponse("Invalid login");

            //check setup password of account
            if (string.IsNullOrEmpty(user.PasswordSalt) || string.IsNullOrEmpty(user.PasswordHash))
                return BadRequestResponse("Invalid login");

            //check password
            var hashedpassword = PasswordHelper.CreateHashed(model.Password, user.PasswordSalt);
            if (user.PasswordHash != hashedpassword)
                return BadRequestResponse("Invalid login");

            var expiresInMinutes = 60;
            var token = PasswordHelper.CreateToken(user, expiresInMinutes,config);

            //return response
            return SuccessResponse(data: new LoginSuccessModel
            {
                AccessToken = token,
                TokenType = "Bearer",
                ExpiresIn = DateTime.UtcNow.AddMinutes(expiresInMinutes),
                UserInfo = new LoginSuccessModel.AccountInfo
                {
                    Id = user.Id,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Email = user.Email,
                }
            });
        }

        [HttpGet]
        public async Task<IActionResult> UserList()
        {
            var userList = await _unitOfWork.Repository<User>().GetAsync();
            return SuccessResponse(data: userList);
        }


        }

}
