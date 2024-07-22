using System;
using System.Collections.Generic;
using System.Net.Sockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using AppClient7;
using Newtonsoft.Json;

public class TcpDataSender
{
    private readonly string _serverIp;
    private readonly int _port;

    public TcpDataSender(string serverIp, int port)
    {
        _serverIp = serverIp;
        _port = port;
    }

    public async Task SendAircraftDataAsync(List<AircraftData> aircraftList, CancellationToken cancellationToken)
    {
        foreach (var aircraft in aircraftList)
        {
            try
            {
                using (TcpClient client = new TcpClient(_serverIp, _port))
                {
                    if (aircraft.Lat != null && aircraft.Lon != null)
                    {
                        var serializedData = new
                        {
                            FlightId = aircraft.Hex,
                            Latitude = aircraft.Lat,
                            Longitude = aircraft.Lon,
                            Velocity = aircraft.Spd,
                            Type = "FIXED WING",
                            Status = "UNKNOWN",
                            DataType = "Track",
                            DeviceUnit = "A205"
                        };
                        string aircraftJson = JsonConvert.SerializeObject(serializedData);
                        byte[] data = Encoding.ASCII.GetBytes(aircraftJson);

                        NetworkStream stream = client.GetStream();
                        stream.Write(data, 0, data.Length);
                        Console.WriteLine($"Sent: {aircraftJson}");

                        stream.Close();
                        //await Task.Delay(1000, cancellationToken);
                    }
                }
            }
            catch (Exception e)
            {
                Console.WriteLine($"Exception: {e.Message}");
            }
        }
    }
}
