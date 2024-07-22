using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace AppClient7
{
    public class AircraftData
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        public DateTime Time { get; set; }
        public int Uti { get; set; }
        public int Ns { get; set; }
        public string Hex { get; set; }
        public string Fli { get; set; }
        public string Src { get; set; }
        public string Ava { get; set; }
        public string Lat { get; set; }
        public string Lon { get; set; }
        public string Alt { get; set; }
        public string Gda { get; set; }
        public string Spd { get; set; }
        public string Trk { get; set; }
        public string Vrt { get; set; }
        public string Tmp { get; set; }
        public string Wsp { get; set; }
        public string Wdi { get; set; }
        public string Cat { get; set; }
        public string Org { get; set; }
        public string Dst { get; set; }
        public string Opr { get; set; }
        public string Typ { get; set; }
        public string Reg { get; set; }
        public string Dis { get; set; }
        public string Dbm { get; set; }
        public string Cou { get; set; }
        public string Squ { get; set; }
        public int Tru { get; set; }
        public string Lla { get; set; }

        public bool IsSend { get; set; }
    }
}
