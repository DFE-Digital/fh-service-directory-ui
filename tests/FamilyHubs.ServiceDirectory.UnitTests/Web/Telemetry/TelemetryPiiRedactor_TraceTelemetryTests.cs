using FamilyHubs.ServiceDirectory.Web.Telemetry;
using Microsoft.ApplicationInsights.DataContracts;
using Microsoft.ApplicationInsights.Extensibility;

namespace FamilyHubs.ServiceDirectory.UnitTests.Web.Telemetry;

public class TelemetryPiiRedactor_TraceTelemetryTests
{
    public ITelemetryInitializer TelemetryPiiRedactor { get; set; }

    public TelemetryPiiRedactor_TraceTelemetryTests()
    {
        TelemetryPiiRedactor = new TelemetryPiiRedactor();
    }

    [Theory]
    [InlineData("Start processing HTTP request GET https://api.postcodes.io/postcodes/REDACTED", "Start processing HTTP request GET https://api.postcodes.io/postcodes/M27%208SS")]
    public void RedactPiiTest(string expectedMessage, string message)
    {
        TestTraceTelemetry(expectedMessage, message);
    }

    private void TestTraceTelemetry(string expectedMessage, string message)
    {
        var traceTelemetry = CreateTraceTelemetry(message);
        TelemetryPiiRedactor.Initialize(traceTelemetry);

        Assert.Equal(expectedMessage, traceTelemetry.Message);
    }

    // we need to use the concrete class, as Initialize checks the type
    private TraceTelemetry CreateTraceTelemetry(string message, string requestPath = "/ServiceFilter")
    {
        var traceTelemetry = new TraceTelemetry(message);
        traceTelemetry.Properties.Add("RequestPath", requestPath);
        return traceTelemetry;
    }
}