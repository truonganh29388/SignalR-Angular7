using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace SignalRWebPack.Models
{
    public class LoginModel
    {
        [Required]
        public string Email { get; set; } 

        [Required]
        public string Password { get; set; } 
    }
    public class LoginSuccessModel
    {
        public string AccessToken { get; set; }
        public string TokenType { get; set; }
        public DateTime ExpiresIn { get; set; }
        public AccountInfo UserInfo { get; set; }   
        public class AccountInfo
        {
           public string Id { get; set; } 
           public string FirstName { get; set; } 
           public string LastName { get; set; } 
           public string Email { get; set; } 
        }
    }
}
