using Microsoft.AspNetCore.SignalR;

namespace SignalRWebPack.Models
{
    public class CustomUserIdProvider : IUserIdProvider
    {
        //public string GetUserId(IRequest request)
        //{
        //    // your logic to fetch a user identifier goes here.

        //    // for example:

        //    //var userId = MyCustomUserClass.FindUserId(request.User.Identity.Name);
        //    return userId.ToString();
        //}

        public string GetUserId(HubConnectionContext connection)
        {
            var userId = connection.User.Identity.Name;
                return userId;
        }
    }
}
