using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SignalRWebPack.Hubs
{
    //public interface IChatClient
    //{
    //    Task ReceiveMessage(string user, string message);
    //    Task ReceiveMessage(string message);
    //}
    //public class ChatHub: Hub<IChatClient>

    [Authorize]
    public class ChatHub : Hub
    {
        public async Task NewMessageToAll(string username, string message)
        {

            var userId = Context.UserIdentifier;

           // var userId = Context.User.Identity.Name;
            var connectionId = Context.ConnectionId;

            var user = Clients.User(userId);
            await user.SendAsync("messageReceived", username, message);
            //// Clients.
            //// await Clients.All.SendAsync("messageReceived", username, message);
        }

        public async Task SendMsgToUser(string fromUserName,string toUserId, string message)
        {
            var userId = Context.UserIdentifier;
            var fromUser = Clients.User(userId);
            var toUser = Clients.User(toUserId);        
            await toUser.SendAsync("messageReceived", fromUserName, message);
            await fromUser.SendAsync("messageReceived", fromUserName, message);
        }

        public async Task NewMessageToCaller(string username, string message)
        {
            await Clients.Caller.SendAsync("messageReceived", username, message);
        }
        //public Task SendMessageToCaller(string message)
        //{
        //    return Clients.Caller.SendAsync("ReceiveMessage", message);
        //}

        //public Task SendMessageToGroup(string message)
        //{
        //    return Clients.Group("SignalR Users").SendAsync("ReceiveMessage", message);
        //}
        public override async Task OnConnectedAsync()
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, "SignalR Users");
            await base.OnConnectedAsync();
        }
        public override async Task OnDisconnectedAsync(Exception exception)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, "SignalR Users");
            await base.OnDisconnectedAsync(exception);
        }
        public Task ThrowException()
        {
            throw new HubException("This error will be sent to the client!");
        }
    }
}
