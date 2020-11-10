using BasicVehicleIncidentTracker.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BasicVehicleIncidentTracker.Data
{
    public class VehicleIncidentContext : DbContext
    {
        public VehicleIncidentContext(DbContextOptions<VehicleIncidentContext> options)
          : base(options)
        { }
        public DbSet<VehicleIncident> VehicleIncidents { get; set; }
        public DbSet<VINAttributes> VINAttributes { get; set; }

        public bool ContainsIncident(VehicleIncident incident)
        {
            return this.VehicleIncidents.Any(x => x.VIN == incident.VIN && x.DateTime == incident.DateTime);
        }
        public bool ContainsAttributes(string vin)
        {
            return this.VINAttributes.Any(x => x.VIN == vin);
        }
    }
}
