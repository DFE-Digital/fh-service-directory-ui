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
    // redacting
    [InlineData("Start processing HTTP request GET https://api.postcodes.io/postcodes/REDACTED", "Start processing HTTP request GET https://api.postcodes.io/postcodes/M27%208SS")]
    [InlineData("Request starting HTTP/2 GET https://find-support-for-your-family.education.gov.uk/ServiceFilter?postcode=REDACTED&adminarea=E08000006&latitude=REDACTED&longitude=REDACTED&frompostcodesearch=True - ", "Request starting HTTP/2 GET https://find-support-for-your-family.education.gov.uk/ServiceFilter?postcode=M27%206NF&adminarea=E08000006&latitude=53.53087&longitude=-2.349673&frompostcodesearch=True - ")]
    // non redacting
    [InlineData("Request starting HTTP/2 POST https://find-support-for-your-family.education.gov.uk/ServiceFilter?_gl=1*rwc3vy*_up*MQ..*_ga*MzkwODc1NzA2LjE2Nzc3NjM5NzI.*_ga_TD99KTZEE1*MTG3Nzc1Mzk3MS4xLjAuMTY3Nzc2NDAzMi4wLjAuMA.. application/x-www-form-urlencoded 199", "Request starting HTTP/2 POST https://find-support-for-your-family.education.gov.uk/ServiceFilter?_gl=1*rwc3vy*_up*MQ..*_ga*MzkwODc1NzA2LjE2Nzc3NjM5NzI.*_ga_TD99KTZEE1*MTG3Nzc1Mzk3MS4xLjAuMTY3Nzc2NDAzMi4wLjAuMA.. application/x-www-form-urlencoded 199")]
    public void RedactPiiFromMessageTest(string expectedMessage, string message)
    {
        TestTraceTelemetry(expectedMessage, message);
    }

    [Theory]
    [InlineData("HTTP GET https://api.postcodes.io/postcodes/REDACTED", "Scope", "HTTP GET https://api.postcodes.io/postcodes/M27%208SS")]
    [InlineData("https://api.postcodes.io/postcodes/REDACTED", "Uri", "https://api.postcodes.io/postcodes/M27%208SS")]
    public void RedactPiiFromPropertiesTest(string expectedPropertyValue, string propertyName, string propertyValue)
    {
        var traceTelemetry = CreateTraceTelemetry("");
        traceTelemetry.Properties.Add(propertyName, propertyValue);
        TelemetryPiiRedactor.Initialize(traceTelemetry);

        Assert.Equal(expectedPropertyValue, traceTelemetry.Properties[propertyName]);
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