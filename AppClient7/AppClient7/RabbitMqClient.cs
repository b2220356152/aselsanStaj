using RabbitMQ.Client;
using System;
using System.Collections.Generic;
using System.Text;
using Newtonsoft.Json;
using AppClient7;

public class RabbitMqClient : IDisposable
{
    private readonly ConnectionFactory _factory;
    private readonly IConnection _connection;
    private readonly IModel _channel;

    public RabbitMqClient(string hostName)
    {
        _factory = new ConnectionFactory() { HostName = hostName };
        _connection = _factory.CreateConnection();
        _channel = _connection.CreateModel();
    }


    public void SendMessage(string queueName, List<AircraftData> aircraftList)
    {
        try
        {
            _channel.QueueDeclare(queue: queueName,
                                  durable: false,
                                  exclusive: false,
                                  autoDelete: false,
                                  arguments: null);

            foreach (var aircraft in aircraftList)
            {
                try
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

                    var json = JsonConvert.SerializeObject(serializedData);
                    var body = Encoding.UTF8.GetBytes(json);

                    var properties = _channel.CreateBasicProperties();
                    properties.Persistent = true;

                    _channel.BasicPublish(exchange: "",
                                         routingKey: queueName,
                                         basicProperties: properties,
                                         body: body);
                    Console.WriteLine($"Sent: {json}");
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                }
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
        }
    }

    //public void SendMessage(string queueName, AircraftData aircraft)
    //{
    //    try
    //    {
    //        _channel.QueueDeclare(queue: queueName,
    //                              durable: false,
    //                              exclusive: false,
    //                              autoDelete: false,
    //                              arguments: null);


    //            try
    //            {
    //                var serializedData = new
    //                {
    //                    FlightId = aircraft.Hex,
    //                    Latitude = aircraft.Lat,
    //                    Longitude = aircraft.Lon,
    //                    Velocity = aircraft.Spd,
    //                    Type = "FIXED WING",
    //                    Status = "UNKNOWN",
    //                    DataType = "Track",
    //                    DeviceUnit = "A205"
    //                };

    //                var json = JsonConvert.SerializeObject(serializedData);
    //                var body = Encoding.UTF8.GetBytes(json);

    //                var properties = _channel.CreateBasicProperties();
    //                properties.Persistent = true;

    //                _channel.BasicPublish(exchange: "",
    //                                     routingKey: queueName,
    //                                     basicProperties: properties,
    //                                     body: body);
    //                Console.WriteLine($"Sent: {json}");
    //            }
    //            catch (Exception ex)
    //            {
    //                Console.WriteLine(ex.Message);
    //            }

    //    }
    //    catch (Exception ex)
    //    {
    //        Console.WriteLine(ex.Message);
    //    }
    //}
    public void Dispose()
    {
        _channel.Close();
        _connection.Close();
    }
}


//foreach (var aircraft in sendFlights.GroupBy(a => a.Hex))
//{
//    if (!hexToIdMap.ContainsKey(aircraft.Key))
//    {
//        hexToIdMap[aircraft.Key] = nextId++;
//    }
//    int id = hexToIdMap[aircraft.Key];

//    string queueName = $"data_queue_{id}";
//    rabbitMqClient.SendMessage(queueName, aircraft.ToList());
//}
//foreach (var aircraft in sendFlights)
//{          

//    string queueName = $"aircraft_queue";
//    rabbitMqClient.SendMessage(queueName, aircraft);
//    string message = JsonConvert.SerializeObject(aircraft);
//    webSocket.Send(message);
//}