using FamilyHubs.ServiceDirectory.Web.Telemetry;
using FluentAssertions;
using Microsoft.ApplicationInsights.Channel;
using Microsoft.ApplicationInsights.DataContracts;
using Microsoft.ApplicationInsights.Extensibility;

namespace FamilyHubs.ServiceDirectory.UnitTests.Web.Telemetry
{
    public class TelemetryPiiRedactorTests
    {
        public ITelemetryInitializer TelemetryPiiRedactor { get; set; }

        public TelemetryPiiRedactorTests()
        {
            TelemetryPiiRedactor = new TelemetryPiiRedactor();
        }

        [Theory]
        // actual url
        [InlineData("https://find-support-for-your-family.education.gov.uk/ServiceFilter?postcode=REDACTED&adminarea=E08000006&latitude=REDACTED&longitude=REDACTED&frompostcodesearch=True", "https://find-support-for-your-family.education.gov.uk/ServiceFilter?postcode=M27 8SS&adminarea=E08000006&latitude=53.508884&longitude=-2.294605&frompostcodesearch=True")]
        // redactable parameter at the end (in case url changes)
        [InlineData("https://find-support-for-your-family.education.gov.uk/ServiceFilter?frompostcodesearch=True&postcode=REDACTED&adminarea=E08000006&latitude=REDACTED&longitude=REDACTED", "https://find-support-for-your-family.education.gov.uk/ServiceFilter?frompostcodesearch=True&postcode=M27 8SS&adminarea=E08000006&latitude=53.508884&longitude=-2.294605")]
        public void RequestTelemetry_RedactPiiTest(string expectedUrl, string initialUrl)
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
        public void RequestTelemetry_PostcodeFormats_RedactPiiTest(string postcode)
        {
            TestRequestTelemetry("https://find-support-for-your-family.education.gov.uk/ServiceFilter?postcode=REDACTED&adminarea=E08000006&latitude=REDACTED&longitude=REDACTED&frompostcodesearch=True", $"https://find-support-for-your-family.education.gov.uk/ServiceFilter?postcode={postcode}&adminarea=E08000006&latitude=53.508884&longitude=-2.294605&frompostcodesearch=True");
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
}
