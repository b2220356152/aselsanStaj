using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Http;
using System.Net.Sockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using AppClient7;
using Microsoft.Extensions.Configuration;
using MongoDB.Bson;
using MongoDB.Driver;
using Newtonsoft.Json;
using Serilog;
using Serilog.Formatting.Json;
using Serilog.Sinks.MongoDB;
using WebSocketSharp;

class Program
    {
        static async Task Main(string[] args)
        {
            var configuration = ConfigurationHelper.GetConfiguration();

            string JsonFilePath = configuration["Logging:JsonFilePath"];
            string TextFilePath = configuration["Logging:TextFilePath"];
            string apiUrl = configuration["API:Adress"];

            var mongoConnectionString = configuration["MongoDB:ConnectionString"];
            var mongoDbName = configuration["MongoDB:DatabaseName"];
            var mongoCollectionName = configuration["MongoDB:CollectionName"];

        
            SerilogManager.Configure(TextFilePath);

          
            



        using CancellationTokenSource cts = new CancellationTokenSource();
            Console.CancelKeyPress += (sender, eventArgs) =>
            {
                eventArgs.Cancel = true;
                cts.Cancel();
            }; ;

            var mongoDbManager = new MongoDbManager(mongoConnectionString, mongoDbName, mongoCollectionName);
        //var mongoDbManager2 = new MongoDbManager(mongoConnectionString, mongoDbName, "AircraftCollection5");


        var allAircraftData = mongoDbManager.GetAllFlightData();
        List<AircraftData> allAircraftList = new List<AircraftData>();
        allAircraftList = allAircraftData.ToList();
;

        string serverIp = configuration["TCP:Adress"];
        int port = int.Parse(configuration["TCP:Port"]);

        var tcpDataSender = new TcpDataSender(serverIp, port);
        await tcpDataSender.SendAircraftDataAsync(allAircraftList, cts.Token);





        var rabbitMqClient = new RabbitMqClient("localhost");
        Dictionary<string, int> hexToIdMap = new Dictionary<string, int>();
        int nextId = 0;

        try
            {
                while (!cts.Token.IsCancellationRequested)
                {
                    try
                {
                    //HttpResponseMessage response = await client.GetAsync(apiUrl, cts.Token);
                    //response.EnsureSuccessStatusCode();
                    //string jsonData = await response.Content.ReadAsStringAsync(cts.Token);

                   string jsonData = File.ReadAllText("C:\\Users\\staj\\Desktop\\New folder (2)\\aircraftlist1.52.json");


                    List <AircraftData> aircraftList = JsonConvert.DeserializeObject<List<AircraftData>>(jsonData);

                    // await File.AppendAllTextAsync("C:\\Users\\staj\\source\\repos\\AppClient7\\AppClient7\\data3.json", jsonData + Environment.NewLine, cts.Token);
                    foreach (var aircraft in aircraftList)
                        {
                            if (!string.IsNullOrWhiteSpace(aircraft.Fli) &&
                                !allAircraftList.Any(a => a.Hex == aircraft.Hex && a.Lat == aircraft.Lat && a.Lon == aircraft.Lon))
                            {
                                TimeZoneInfo turkeyTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Turkey Standard Time");
                                DateTime localTime = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, turkeyTimeZone);

                                aircraft.Time = localTime;
                                aircraft.IsSend = false;

      
                                 allAircraftList.Add(aircraft);
                                 Console.WriteLine(3);

                            await mongoDbManager.InsertAircraftDataAsync(aircraft);

                           


                        }
                        }
                                     
                    }
                    catch (HttpRequestException e)
                    {
                        Log.Error(e, "HTTP request error");
                    }
                    catch (TaskCanceledException)
                    {
                        Log.Information("Task canceled");
                        break;
                    }
                    catch (Exception e)
                    {
                        Log.Error(e, "Unexpected error");
                    }
                    List<AircraftData> sendFlights = mongoDbManager.GetSendFlightData();

                await tcpDataSender.SendAircraftDataAsync(sendFlights, cts.Token);
                await Task.Delay(2000, cts.Token);
                }
            }
            catch (OperationCanceledException)
            {
                Log.Information("Program cancelled.");
            }
            finally
            {
                Log.CloseAndFlush();
            }
        }
    }


