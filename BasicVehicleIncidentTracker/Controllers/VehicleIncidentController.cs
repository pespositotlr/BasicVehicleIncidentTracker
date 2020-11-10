using BasicVehicleIncidentTracker.Data;
using BasicVehicleIncidentTracker.Models;
using BasicVehicleIncidentTracker.RequestForms;
using BasicVehicleIncidentTracker.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;

namespace BasicVehicleIncidentTracker.Controllers
{
    [ApiController]
    [Microsoft.AspNetCore.Mvc.Route("/")]
    public class VehicleIncidentController : ControllerBase
    {
        VehicleIncidentContext _dbContext;
        IVINDecodeService _vinDecodeService;
        private readonly ILogger<VehicleIncidentController> _logger;

        public VehicleIncidentController(VehicleIncidentContext dbContext, IVINDecodeService vinDecodeService, ILogger<VehicleIncidentController> logger)
        {
            _dbContext = dbContext;
            _vinDecodeService = vinDecodeService;
            _logger = logger;
        }

        [HttpGet]
        [Route("api/get-vehicle-incidents/")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public ActionResult<List<VehicleIncident>> GetVehicleIncidents()
        {
            var incidents = _dbContext.VehicleIncidents.ToList();

            return Ok(incidents);
        }

        [HttpPost]
        [Route("api/create-vehicle-incident/")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult CreateVehicleIncident([FromBody] CreateVehicleIncidentForm payload)
        {
            var newVehicleIncident = new VehicleIncident
            {
                VIN = payload.VIN,
                DateTime = Convert.ToDateTime(payload.DateTime),
                Note = payload.Note
            };

            if (_dbContext.ContainsIncident(newVehicleIncident))
            {
                return BadRequest();
            }

            SetAttributes(newVehicleIncident);

            _dbContext.VehicleIncidents.Add(newVehicleIncident);
            _dbContext.SaveChanges();

            return CreatedAtAction(nameof(VehicleIncident), new { vin = newVehicleIncident.VIN }, newVehicleIncident);
        }

        private void SetAttributes(VehicleIncident newVehicleIncident)
        {
            VINAttributes attributes;

            if (_dbContext.ContainsAttributes(newVehicleIncident.VIN))
            {
                attributes = _dbContext.VINAttributes.FirstOrDefault(x => x.VIN == newVehicleIncident.VIN);
            } else
            {
                attributes = _vinDecodeService.GetAttributes(newVehicleIncident.VIN).Result;
                _dbContext.VINAttributes.Add(attributes);
                _dbContext.SaveChanges();
            }

            newVehicleIncident.Make = attributes.Make;
            newVehicleIncident.Model = attributes.Model;
            newVehicleIncident.Year = attributes.Year;
        }


    }
}
