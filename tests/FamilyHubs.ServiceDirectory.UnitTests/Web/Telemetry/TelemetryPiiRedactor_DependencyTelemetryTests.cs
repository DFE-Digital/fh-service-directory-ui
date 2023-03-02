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
    [InlineData("", "", "GET /postcodes/B1 1AA")]
    [InlineData("", "", "GET /api/services")]
    public void RedactPiiFromDataTest(string expectedData, string data, string name)
    {
        var dependencyTelemetry = CreateDependencyTelemetry(name, data);
        TelemetryPiiRedactor.Initialize(dependencyTelemetry);

        Assert.Equal(expectedData, dependencyTelemetry.Data);
    }

    [Theory]
    [InlineData("", "", "GET /postcodes/B1 1AA")]
    [InlineData("", "", "GET /api/services")]
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