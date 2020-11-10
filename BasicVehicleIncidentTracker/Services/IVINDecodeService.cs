using BasicVehicleIncidentTracker.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BasicVehicleIncidentTracker.Services
{
    public interface IVINDecodeService
    {
        public Task<VINAttributes> GetAttributes(string vin);

    }
}
