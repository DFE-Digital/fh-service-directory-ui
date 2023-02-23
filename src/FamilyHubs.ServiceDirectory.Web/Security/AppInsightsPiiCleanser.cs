using System.Diagnostics;
using Microsoft.ApplicationInsights.Channel;
using Microsoft.ApplicationInsights.Extensibility;
using Microsoft.ApplicationInsights.DataContracts;
using System.Text.RegularExpressions;

namespace FamilyHubs.ServiceDirectory.Web.Security;

//todo: looks like might a ITelemetryInitializer instead of a ITelemetryProcessor

//todo: doesn't belong in security
// how much will this slow things down?
// can we do it earlier
// remove values/properties or the whole trace instead if it's too slow
#if cant_modify_only_filter
public class AppInsightsPiiCleanser : ITelemetryProcessor
{
    private static readonly Regex PiiRegex = new Regex(@"(?<=(postcode|latitude|longitude)=)[^&\s]+", RegexOptions.Compiled);

    private static readonly string[] PropertiesToRedact =
        new[] {"Uri", "Scope", "QueryString", "HostingRequestStartingLog"};

    private ITelemetryProcessor Next { get; }

    public AppInsightsPiiCleanser(ITelemetryProcessor next)
    {
        Next = next;
    }

    public void Process(ITelemetry item)
    {
        //todo: we still want to log all lines, just remove pii
        // To filter out an item, return without calling the next processor.

        //if (item.Sanitize())

        //todo: we don't want to keep doing this repeatedly for all the traces in a request
        // can we come in earlier? do the properties get passed on to the next trace?

        //properties
        // {[Uri, https://s181d01-as-fh-sd-api-dev.azurewebsites.net/api/services?serviceType=Family%20Experience&districtCode=E08000006&latitude=53.508884&longtitude=-2.294605&proximity=32186&pageNumber=1&pageSize=10&maxFamilyHubs=1]}

        // {[Scope, ["HTTP GET https://s181d01-as-fh-sd-api-dev.azurewebsites.net/api/services?serviceType=Family%20Experience&districtCode=E08000006&latitude=53.508884&longtitude=-2.294605&proximity=32186&pageNumber=1&pageSize=10&maxFamilyHubs=1"]]}

        //postcodes.io
        // message: "Start processing HTTP request GET https://api.postcodes.io/postcodes/M27%208SS"
        // {[Scope, ["HTTP GET https://api.postcodes.io/postcodes/M27%208SS"]]}
        // {[Uri, https://api.postcodes.io/postcodes/M27%208SS]}

        // there's also RequestPath, but that seems to be set when there's no pii to sanitize, so Path looks a better bet

        //todo: check properties on exception telemetry (on filter page)

        // order by least common for efficiency
        if (item is TraceTelemetry traceTelemetry
            && traceTelemetry.Properties.TryGetValue("Path", out string? path)
            && path is "/ServiceFilter"
            && traceTelemetry.Properties.TryGetValue("Method", out string? method)
            && method is "GET")
        {
            traceTelemetry.Message = Sanitize(traceTelemetry.Message);
            foreach (string propertyKey in PropertiesToRedact)
            {
                SanitizeProperty(traceTelemetry.Properties, propertyKey);
            }
        }

        //if (!OKtoSend(item))
        //{
        //    return;
        //}

        Next.Process(item);
    }

    private void SanitizeProperty(IDictionary<string,string> properties, string key)
    {
        if (properties.TryGetValue(key, out string? value))
        {
            properties[key] = Sanitize(value);
        }
    }

    // regex to handle all, or different methods for each?
    // Request starting HTTP/2 GET https://localhost:7199/ServiceFilter?postcode=M27%208SS&adminarea=E08000006&latitude=53.508884&longitude=-2.294605&frompostcodesearch=True - -
    // ?postcode=M27%208SS&adminarea=E08000006&latitude=53.508884&longitude=-2.294605&frompostcodesearch=True
    private string Sanitize(string value)
    {
        return PiiRegex.Replace(value, "REDACTED");
        //return $"Test-{value}";
    }

//#pragma warning disable
//    private bool OKtoSend(ITelemetry item)
//    {
//        //var dependency = item as DependencyTelemetry;
//        //if (dependency == null) return true;

//        //return dependency.Success != true;
//        return true;
//    }
}
#endif

public class RedactPiiInitializer : ITelemetryInitializer
{
    //todo: do we handle the user changing the case in the url??

    private static readonly Regex PiiRegex = new(@"(?<=(postcode|latitude|longitude)=)[^&\s]+", RegexOptions.Compiled);

    private static readonly string[] PropertiesToRedact = { "Uri", "Scope", "QueryString", "HostingRequestStartingLog", "Dependency" };

    public void Initialize(ITelemetry telemetry)
    {
        //todo: https://learn.microsoft.com/en-us/azure/azure-monitor/app/api-filtering-sampling
        // RequestTelemetry??

        //{[RequestPath, /ServiceFilter]}

        // order by least common for efficiency
        if (telemetry is TraceTelemetry traceTelemetry
            && traceTelemetry.Properties.TryGetValue("RequestPath", out string? path)
            && path is "/ServiceFilter")
        // when calling the API, we need to redact on GET
        // when the request is for the web, we only need to redact on POST
        //todo: try some different ways of doing this and see which is fastest
        //&& traceTelemetry.Properties.TryGetValue("Method", out string? method)
        //&& method is "GET")
        {
            traceTelemetry.Message = Sanitize(traceTelemetry.Message);
            foreach (string propertyKey in PropertiesToRedact)
            {
                SanitizeProperty(traceTelemetry.Properties, propertyKey);
            }
        }

        DebugCheckForUnredactedData(telemetry);
    }

    private void DebugCheckForUnredactedData(ITelemetry telemetry)
    {
        if (telemetry is TraceTelemetry traceTelemetry)
        {
            if (traceTelemetry.Message.Contains("postcode=")
                && !traceTelemetry.Message.Contains("postcode=REDACTED"))
            {
                Debugger.Break();
            }

            foreach (var value in traceTelemetry.Properties.Values)
            {
                if (value.Contains("postcode=")
                    && !value.Contains("postcode=REDACTED"))
                {
                    Debugger.Break();
                }
            }
        }
    }

    private void SanitizeProperty(IDictionary<string, string> properties, string key)
    {
        if (properties.TryGetValue(key, out string? value))
        {
            properties[key] = Sanitize(value);
        }
    }

    private string Sanitize(string value)
    {
        return PiiRegex.Replace(value, "REDACTED");
    }
}