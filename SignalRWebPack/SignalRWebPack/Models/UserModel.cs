using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace SignalRWebPack.Models
{
    public class UserModel
    {
        [Required]
        public string Password { get; set; }

        //[Required]
        //[Compare("Password", ErrorMessage = "Password not matched")]
        //public string ConfirmPassword { get; set; }

        [Required]
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
    }
}
