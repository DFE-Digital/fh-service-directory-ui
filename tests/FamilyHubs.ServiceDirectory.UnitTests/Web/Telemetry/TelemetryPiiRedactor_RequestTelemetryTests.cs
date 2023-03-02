using FamilyHubs.ServiceDirectory.Web.Telemetry;
using Microsoft.ApplicationInsights.DataContracts;
using Microsoft.ApplicationInsights.Extensibility;

namespace FamilyHubs.ServiceDirectory.UnitTests.Web.Telemetry;

public class TelemetryPiiRedactor_RequestTelemetryTests
{
    public ITelemetryInitializer TelemetryPiiRedactor { get; set; }

    public TelemetryPiiRedactor_RequestTelemetryTests()
    {
        TelemetryPiiRedactor = new TelemetryPiiRedactor();
    }   

    [Theory]
    // actual url
    [InlineData("https://find-support-for-your-family.education.gov.uk/ServiceFilter?postcode=REDACTED&adminarea=E08000006&latitude=REDACTED&longitude=REDACTED&frompostcodesearch=True", "https://find-support-for-your-family.education.gov.uk/ServiceFilter?postcode=M27 8SS&adminarea=E08000006&latitude=53.508884&longitude=-2.294605&frompostcodesearch=True")]
    // redactable parameter at the end (in case url changes)
    [InlineData("https://find-support-for-your-family.education.gov.uk/ServiceFilter?frompostcodesearch=True&postcode=REDACTED&adminarea=E08000006&latitude=REDACTED&longitude=REDACTED", "https://find-support-for-your-family.education.gov.uk/ServiceFilter?frompostcodesearch=True&postcode=M27 8SS&adminarea=E08000006&latitude=53.508884&longitude=-2.294605")]
    // different host
    [InlineData("https://example.com:123/ServiceFilter?postcode=REDACTED&adminarea=E08000006&latitude=REDACTED&longitude=REDACTED&frompostcodesearch=True", "https://example.com:123/ServiceFilter?postcode=M27 8SS&adminarea=E08000006&latitude=53.508884&longitude=-2.294605&frompostcodesearch=True")]
    public void RedactPiiTest(string expectedUrl, string initialUrl)
    {
        TestRequestTelemetry(expectedUrl, initialUrl);
    }

    [Theory]
    [InlineData("M1 1AA")]
    [InlineData("M60 1NW")]
    [InlineData("CR2 6XH")]
    [InlineData("DN55 1PT")]
    [InlineData("W1P 1HQ")]
    [InlineData("EC1A 1BB")]
    // we use the canonical postcode format in the url, but check non-canonical formats just in case there's a later change
    [InlineData("M11AA")]
    [InlineData("M601NW")]
    [InlineData("CR26XH")]
    [InlineData("DN551PT")]
    [InlineData("W1P1HQ")]
    [InlineData("EC1A1BB")]
    [InlineData("m1 1aa")]
    [InlineData("m60 1nw")]
    [InlineData("cr2 6xh")]
    [InlineData("dn55 1pt")]
    [InlineData("w1p 1hq")]
    [InlineData("ec1a 1bb")]
    public void PostcodeFormats_RedactPiiTest(string postcode)
    {
        TestRequestTelemetry("https://find-support-for-your-family.education.gov.uk/ServiceFilter?postcode=REDACTED&adminarea=E08000006&latitude=REDACTED&longitude=REDACTED&frompostcodesearch=True", $"https://find-support-for-your-family.education.gov.uk/ServiceFilter?postcode={postcode}&adminarea=E08000006&latitude=53.508884&longitude=-2.294605&frompostcodesearch=True");
    }

    [Theory]
    [InlineData("-90")]
    [InlineData("-90.001")]
    [InlineData("-45")]
    [InlineData("-45.0")]
    [InlineData("0")]
    [InlineData("0.07")]
    [InlineData("49")]
    [InlineData("49.999")]
    [InlineData("61.123456789")]
    [InlineData("90")]
    [InlineData("90.000")]
    public void Latitudes_RedactPiiTest(string latitude)
    {
        TestRequestTelemetry("https://find-support-for-your-family.education.gov.uk/ServiceFilter?postcode=REDACTED&adminarea=E08000006&latitude=REDACTED&longitude=REDACTED&frompostcodesearch=True", $"https://find-support-for-your-family.education.gov.uk/ServiceFilter?postcode=M1 1AA&adminarea=E08000006&latitude={latitude}&longitude=-2.294605&frompostcodesearch=True");
    }

    [Theory]
    [InlineData("-180")]
    [InlineData("-180.001")]
    [InlineData("-8")]
    [InlineData("-8.0")]
    [InlineData("0")]
    [InlineData("0.07")]
    [InlineData("2")]
    [InlineData("2.999")]
    [InlineData("61.123456789")]
    [InlineData("180")]
    [InlineData("180.000")]
    public void Longitude_RedactPiiTest(string longitude)
    {
        TestRequestTelemetry("https://find-support-for-your-family.education.gov.uk/ServiceFilter?postcode=REDACTED&adminarea=E08000006&latitude=REDACTED&longitude=REDACTED&frompostcodesearch=True", $"https://find-support-for-your-family.education.gov.uk/ServiceFilter?postcode=M1 1AA&adminarea=E08000006&latitude=53.508884&longitude={longitude}&frompostcodesearch=True");
    }

    [Fact]
    public void NoRedactionForOtherPages_RedactPiiTest()
    {
        const string urlWithPostcode = "http://example.com/?postcode=B1 2AA";
        var requestTelemetry = CreateRequestTelemetry("GET /Index", urlWithPostcode);
        TelemetryPiiRedactor.Initialize(requestTelemetry);

        Assert.Equal(urlWithPostcode, requestTelemetry.Url.ToString());
    }

    private void TestRequestTelemetry(string expectedUrl, string initialUrl)
    {
        var requestTelemetry = CreateRequestTelemetry("GET /ServiceFilter/Index", initialUrl);
        TelemetryPiiRedactor.Initialize(requestTelemetry);

        Assert.Equal(expectedUrl, requestTelemetry.Url.ToString());
    }

    // we need to use the concrete class, as Initialize checks the type
    private RequestTelemetry CreateRequestTelemetry(string name, string url)
    {
        return new RequestTelemetry(name, DateTimeOffset.MinValue, TimeSpan.Zero, "200", true)
        {
            Url = new Uri(url)
        };
    }
}