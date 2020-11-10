using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BasicVehicleIncidentTracker.RequestForms
{
    public class CreateVehicleIncidentForm
    {

        [JsonProperty("vin")]
        public string VIN { get; set; }

        [JsonProperty("dateTime")]
        public string DateTime { get; set; }

        [JsonProperty("note")]
        public string Note { get; set; }

    }
}
