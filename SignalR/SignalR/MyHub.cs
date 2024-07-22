using Microsoft.AspNetCore.SignalR;

namespace SignalR
{
    public class MyHub : Hub
    {
        public async Task SendMessageAsync(string message)
        {
            Console.WriteLine(message);
            await Clients.All.SendAsync("ReceiveMessage", message);
        }
    }
}
