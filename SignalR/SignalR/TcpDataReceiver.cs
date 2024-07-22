namespace SignalR
{
    using Microsoft.AspNetCore.SignalR;
    using Newtonsoft.Json;
    using System;
    using System.Net.Sockets;
    using System.Net;
    using System.Text;
    using System.Threading;
    using System.Threading.Tasks;
    using System.Reflection.Metadata;

    public class TcpDataReceiver : BackgroundService
    {
        private readonly IHubContext<MyHub> _hubContext;
        private readonly string filePath = "C:\\Users\\staj\\source\\repos\\SignalR\\SignalR\\Controllers\\api.txt";

        public TcpDataReceiver(IHubContext<MyHub> hubContext)
        {
            _hubContext = hubContext;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            int port = 56000;

            TcpListener listener = new TcpListener(IPAddress.Any, port);
            listener.Start();
            Console.WriteLine("Server is listening...");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    using (TcpClient client = await listener.AcceptTcpClientAsync())
                    {
                        Console.WriteLine("Client connected.");
                        using (NetworkStream stream = client.GetStream())
                        {
                            byte[] buffer = new byte[4096];
                            int bytesRead = await stream.ReadAsync(buffer, 0, buffer.Length, stoppingToken);
                            if (bytesRead > 0)
                            {
                                string receivedData = Encoding.ASCII.GetString(buffer, 0, bytesRead);
                                Console.WriteLine($"Received: {receivedData}");
                                using (var writer = new StreamWriter(filePath, append: true)) // append: true ile dosyayı append modunda aç
                                {
                                    await writer.WriteLineAsync(receivedData);
                                }
                                await _hubContext.Clients.All.SendAsync("ReceiveMessage", receivedData);
                            }
                        }
                    }
                }
                catch (Exception e)
                {
                    Console.WriteLine($"Exception: {e.Message}");
                }
            }

            listener.Stop();
        }
    }
}
