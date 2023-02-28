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
        [InlineData("https://localhost:7199/ServiceFilter?postcode=REDACTED&adminarea=E08000006&latitude=REDACTED&longitude=REDACTED&frompostcodesearch=True", "https://localhost:7199/ServiceFilter?postcode=M27 8SS&adminarea=E08000006&latitude=53.508884&longitude=-2.294605&frompostcodesearch=True")]
        public void RequestTelemetry_RedactPiiTest(string expectedUrl, string initialUrl)
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
