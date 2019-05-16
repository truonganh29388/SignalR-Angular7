using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using SignalRWebPack.Identity;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace SignalRWebPack.Authorization
{
    public static class TokenFactory
    {
        public static string CreateRandomSalt()
        {
            byte[] saltByte;

            // generate a 128-bit salt using a secure PRNG
            saltByte = new byte[128 / 8];
            using (var rng = RandomNumberGenerator.Create())
                rng.GetBytes(saltByte);
            var salt = Convert.ToBase64String(saltByte);

            return salt;
        }

        public static string CreateHashed(string password, string salt)
        {
            if (salt == null)
                throw new Exception();

            byte[] saltByte = Convert.FromBase64String(salt);

            // derive a 256-bit subkey (use HMACSHA1 with 10,000 iterations)
            var hashed = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: password,
                salt: saltByte,
                prf: KeyDerivationPrf.HMACSHA512,
                iterationCount: 10000,
                numBytesRequested: 256 / 8));

            return hashed;
        }

        public static string CreateToken(User user, int expiredInMinutes, IConfiguration config)
        {
            //create token
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Email, user.Email)
            };
        
            var expiredTime = DateTime.UtcNow.AddMinutes(expiredInMinutes);
            var jwtSecurityToken = new JwtSecurityToken(
                config["Jwt:Issuer"],
                config["Jwt:Issuer"],
                claims,
                expires: expiredTime,
                signingCredentials: creds
            );
            return new JwtSecurityTokenHandler().WriteToken(jwtSecurityToken);
        }
    }
}
