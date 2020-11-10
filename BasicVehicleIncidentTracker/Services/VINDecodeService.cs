using BasicVehicleIncidentTracker.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BasicVehicleIncidentTracker.Services
{
    public class VINDecodeService : IVINDecodeService
    {
        public async Task<VINAttributes> GetAttributes(string vin)
        {
            VINAttributes attributes = new VINAttributes();

            try
            {
                var client = new RestClient($"https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/{vin}?format=json");
                var request = new RestRequest(Method.GET);
                IRestResponse response = await client.ExecuteAsync(request);

                if (response.IsSuccessful)
                {
                    var content = JsonConvert.DeserializeObject<JToken>(response.Content);

                    List<VINResultsObject> resultsObjects = JsonConvert.DeserializeObject<List<VINResultsObject>>(content["Results"].ToString());

                    attributes.VIN = vin;
                    attributes.Make = resultsObjects.FirstOrDefault(x => x.Variable == "Make").Value;
                    attributes.Model = resultsObjects.FirstOrDefault(x => x.Variable == "Model").Value;
                    attributes.Year = Convert.ToInt32(resultsObjects.FirstOrDefault(x => x.Variable == "Model Year").Value);
                }
                else
                {
                    throw response.ErrorException;
                }

            } catch (Exception ex)
            {
                throw ex;
            }

            return attributes;
        }

        private class VINResultsObject
        {
            public string Value;
            public string ValueId;
            public string Variable;
            public int VariableId;
        }
    }

}
