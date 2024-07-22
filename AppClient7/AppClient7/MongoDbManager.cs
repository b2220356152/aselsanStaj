using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Driver;
using Serilog;

namespace AppClient7
{
    internal class MongoDbManager
    {
        private readonly IMongoCollection<AircraftData> _collection;

        public MongoDbManager(string connectionString, string databaseName, string collectionName)
        {
            var client = new MongoClient(connectionString);
            var database = client.GetDatabase(databaseName);
            _collection = database.GetCollection<AircraftData>(collectionName);

        }

        public async Task InsertAircraftDataAsync(AircraftData aircraft)
        {
            try
            {
                await _collection.InsertOneAsync(aircraft);
               
            }
            catch (Exception ex)
            {
                SerilogManager.LogError(ex, "Error inserting data into MongoDB.");
                throw;
            }
        }

        public List<AircraftData> GetAllFlightData()
        {
            return _collection.Find(new BsonDocument()).ToList();
        }
        public List<AircraftData> GetFlightData(FilterDefinition<AircraftData> filter)
        {
            return _collection.Find(filter).ToList();
        }

        public List<AircraftData> GetSendFlightData()
        {
            var filter = Builders<AircraftData>.Filter.Eq(x => x.IsSend, false) &
                           Builders<AircraftData>.Filter.Ne(x => x.Lat, null) &
                            Builders<AircraftData>.Filter.Ne(x => x.Lon, null);

            var aircraftDataList = _collection.Find(filter).ToList();

            if (aircraftDataList.Count > 0)
            {
                var update = Builders<AircraftData>.Update.Set(x => x.IsSend, true);
                var ids = aircraftDataList.Select(x => x.Id).ToList();
                var idFilter = Builders<AircraftData>.Filter.In(x => x.Id, ids);

                try
                {
                    _collection.UpdateMany(idFilter, update);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error occurred in UpdateMany operation: {ex.Message}");
                }
            }
            else
            {
                Console.WriteLine("No record found to update.");
            }
        

            return aircraftDataList;
        }
        public async Task InsertManyAircraftDataAsync(List<AircraftData> aircraftDataList)
        {
            if (aircraftDataList != null && aircraftDataList.Count > 0)
            {
                await _collection.InsertManyAsync(aircraftDataList);
            }
          
        }

        public void LogAircraftData(List<AircraftData> aircraftDataList)
        {
            foreach (var aircraftData in aircraftDataList)
            {
                var data = new { type10 = aircraftData.Lat, type12 = aircraftData.Lon, type22 = aircraftData.Spd, type32 = aircraftData.Hex };
                SerilogManager.LogInformationJson("Data {@Data}", data);

            }
        }





    }
}
