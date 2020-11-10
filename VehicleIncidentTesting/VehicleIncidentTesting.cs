using BasicVehicleIncidentTracker;
using BasicVehicleIncidentTracker.Data;
using BasicVehicleIncidentTracker.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Linq;
using Xunit;
using FluentAssertions;
using BasicVehicleIncidentTracker.Services;

namespace VehicleIncidentTesting
{
    public class VehicleIncidentTesting
    {

        private static DbContextOptions<VehicleIncidentContext> CreateNewContextOptions()
        {
            // Create a fresh service provider, and therefore a fresh 
            // InMemory database instance.
            var serviceProvider = new ServiceCollection()
                .AddEntityFrameworkInMemoryDatabase()
                .BuildServiceProvider();

            // Create a new options instance telling the context to use an
            // InMemory database and the new service provider.
            var builder = new DbContextOptionsBuilder<VehicleIncidentContext>();
            builder.UseInMemoryDatabase(databaseName: "VehicleIncidentDB_Test")
                   .UseInternalServiceProvider(serviceProvider);

            return builder.Options;
        }

        [Fact]
        public void TestAddIncident()
        {
            using (var _dbContext = new VehicleIncidentContext(CreateNewContextOptions()))
            {
                var newVehicleIncident = new VehicleIncident
                {
                    VIN = "1FTNW21P04EB82562",
                    DateTime = DateTime.Today,
                    Note = "Hit a pole",
                    Model = "F-250",
                    Make = "FORD",
                    Year = 2004
                };

                _dbContext.VehicleIncidents.Add(newVehicleIncident);
                _dbContext.SaveChanges();

                var incidents = _dbContext.VehicleIncidents.ToList();
                incidents.Should().ContainSingle(x => x.VIN == "1FTNW21P04EB82562");
            }
        }

        [Fact]
        public void TestGetAttributes()
        {
            VINAttributes attributes;
            VINDecodeService decodeService = new VINDecodeService();

            attributes = decodeService.GetAttributes("1FTNW21P04EB82562").Result;

            attributes.Model.Should().Equals("F-250");
            attributes.Make.Should().Equals("FORD");
            attributes.Year.Should().Equals(2004);

        }

        [Fact]
        public void TestAttributes_HoldLookedUpValuesInMemory()
        {
            using (var _dbContext = new VehicleIncidentContext(CreateNewContextOptions()))
            {

                VINAttributes attributes;
                VINDecodeService decodeService = new VINDecodeService();
                string vinToLookup = "1FTNW21P04EB82562";

                attributes = decodeService.GetAttributes(vinToLookup).Result;
                _dbContext.VINAttributes.Add(attributes);
                _dbContext.SaveChanges();

                _dbContext.ContainsAttributes(vinToLookup).Should().BeTrue();
            }

        }

        [Fact]
        public void TestDecodingFakeVIN()
        {
            VINAttributes attributes;
            VINDecodeService decodeService = new VINDecodeService();
            string vinToLookup = "ABCDEFG";

            attributes = decodeService.GetAttributes(vinToLookup).Result;

            attributes.Model.Should().BeNull();
            attributes.Make.Should().BeNull();
            attributes.Year.Should().Equals(0);

        }
    }
}
