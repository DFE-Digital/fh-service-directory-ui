using FamilyHubs.ServiceDirectory.Web.Telemetry;
using Microsoft.ApplicationInsights.DataContracts;
using Microsoft.ApplicationInsights.Extensibility;

namespace FamilyHubs.ServiceDirectory.UnitTests.Web.Telemetry;

public class TelemetryPiiRedactor_DependencyTelemetryTests
{
    public ITelemetryInitializer TelemetryPiiRedactor { get; set; }

    public TelemetryPiiRedactor_DependencyTelemetryTests()
    {
        TelemetryPiiRedactor = new TelemetryPiiRedactor();
    }

    [Theory]
    [InlineData("GET /postcodes/REDACTED", "GET /postcodes/B1 1AA")]
    [InlineData("GET /api/services", "GET /api/services")]
    public void RedactPiiFromNameTest(string expectedName, string name)
    {
        var dependencyTelemetry = CreateDependencyTelemetry(name, "");
        TelemetryPiiRedactor.Initialize(dependencyTelemetry);

        Assert.Equal(expectedName, dependencyTelemetry.Name);
    }

    [Theory]
    [InlineData("https://api.postcodes.io/postcodes/REDACTED", "https://api.postcodes.io/postcodes/M27 6NF", "GET /postcodes/B1 1AA")]
    [InlineData("https://example.com/api/services?serviceType=Family Experience&districtCode=E08000006&latitude=REDACTED&longtitude=REDACTED&proximity=32186&pageNumber=1&pageSize=10&maxFamilyHubs=1", "https://example.com/api/services?serviceType=Family Experience&districtCode=E08000006&latitude=53.53087&longtitude=-2.349673&proximity=32186&pageNumber=1&pageSize=10&maxFamilyHubs=1", "GET /api/services")]
    public void RedactPiiFromDataTest(string expectedData, string data, string name)
    {
        var dependencyTelemetry = CreateDependencyTelemetry(name, data);
        TelemetryPiiRedactor.Initialize(dependencyTelemetry);

        Assert.Equal(expectedData, dependencyTelemetry.Data);
    }

    [Theory]
    [InlineData("https://api.postcodes.io/postcodes/REDACTED", "https://api.postcodes.io/postcodes/M27 6NF", "GET /postcodes/B1 1AA")]
    [InlineData("https://example.com/api/services?serviceType=Family Experience&districtCode=E08000006&latitude=REDACTED&longtitude=REDACTED&proximity=32186&pageNumber=1&pageSize=10&maxFamilyHubs=1", "https://example.com/api/services?serviceType=Family Experience&districtCode=E08000006&latitude=53.53087&longtitude=-2.349673&proximity=32186&pageNumber=1&pageSize=10&maxFamilyHubs=1", "GET /api/services")]
    public void RedactPiiFromCommandNameTest(string expectedCommandName, string data, string name)
    {
        var dependencyTelemetry = CreateDependencyTelemetry(name, data);
        TelemetryPiiRedactor.Initialize(dependencyTelemetry);

        Assert.Equal(expectedCommandName, dependencyTelemetry.CommandName);
    }

    // we need to use the concrete class, as Initialize checks the type
    private DependencyTelemetry CreateDependencyTelemetry(string name, string data)
    {
        return new DependencyTelemetry("", "", name, data);
    }
}