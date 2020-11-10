using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace BasicVehicleIncidentTracker.Models
{
    public class VehicleIncident
    {
        [Key]
        public int ID { get; set; }
        public string VIN { get; set; }
        public DateTime DateTime { get; set; }
        public string Note { get; set; }
        public string Make { get; set; }
        public string Model { get; set; }
        public int Year { get; set; }
    }
}
