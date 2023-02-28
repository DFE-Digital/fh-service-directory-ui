#define DEBUG_REDACTOR

using System.Diagnostics;
using Microsoft.ApplicationInsights.Channel;
using Microsoft.ApplicationInsights.Extensibility;
using Microsoft.ApplicationInsights.DataContracts;
using System.Text.RegularExpressions;

namespace FamilyHubs.ServiceDirectory.Web.Telemetry;

// note we don't redact the console log output as that doesn't get persisted anywhere

//todo: doesn't belong in security
// how much will this slow things down?
// remove values/properties or the whole trace instead if it's too slow
//properties
// {[Uri, https://s181d01-as-fh-sd-api-dev.azurewebsites.net/api/services?serviceType=Family%20Experience&districtCode=E08000006&latitude=53.508884&longtitude=-2.294605&proximity=32186&pageNumber=1&pageSize=10&maxFamilyHubs=1]}

// {[Scope, ["HTTP GET https://s181d01-as-fh-sd-api-dev.azurewebsites.net/api/services?serviceType=Family%20Experience&districtCode=E08000006&latitude=53.508884&longtitude=-2.294605&proximity=32186&pageNumber=1&pageSize=10&maxFamilyHubs=1"]]}

//postcodes.io
// message: "Start processing HTTP request GET https://api.postcodes.io/postcodes/M27%208SS"
// {[Scope, ["HTTP GET https://api.postcodes.io/postcodes/M27%208SS"]]}
// {[Uri, https://api.postcodes.io/postcodes/M27%208SS]}

//todo: check properties on exception telemetry (on filter page)


// regex to handle all, or different methods for each?
// Request starting HTTP/2 GET https://localhost:7199/ServiceFilter?postcode=M27%208SS&adminarea=E08000006&latitude=53.508884&longitude=-2.294605&frompostcodesearch=True - -
// ?postcode=M27%208SS&adminarea=E08000006&latitude=53.508884&longitude=-2.294605&frompostcodesearch=True

/// <summary>
/// Redacts Personally Identifiable Information (PII) from telemetry data we send to App Insights.
/// What's redacted:
///     postcode: a postcode can map to a single residential address, so can be used to identify an individual
///     latitude & longitude: can be used to map to the postcode
/// </summary>
/// <remarks>
/// See
/// https://learn.microsoft.com/en-us/azure/azure-monitor/app/api-filtering-sampling
/// https://ico.org.uk/for-organisations/guide-to-data-protection/guide-to-the-general-data-protection-regulation-gdpr/key-definitions/what-is-personal-data/
/// </remarks>>
public class TelemetryPiiRedactor : ITelemetryInitializer
{
    //todo: do we handle the user changing the case in the url??

    // longtitude is due to the spelling error in the API. at some point, we should fix that (and all the consumers)
    // having a single more complex regex might be faster, as its more likely to be in caches
    private static readonly Regex SiteQueryStringRegex = new(@"(?<=(postcode|latitude|longitude|longtitude)=)[^&\s]+", RegexOptions.Compiled);
    private static readonly Regex ApiQueryStringRegex = new(@"(?<=(latitude|longtitude)=)[^&\s]+", RegexOptions.Compiled);
    private static readonly Regex PathRegex = new(@"(?<=postcodes\/)[\w% ]+", RegexOptions.Compiled);

    // is this going to slow things down too much, just exclude the logs instead (not nice!)
    private static readonly string[] TracePropertiesToRedact = { "Uri", "Scope", "QueryString", "HostingRequestStartingLog", "HostingRequestFinishedLog" };

    public void Initialize(ITelemetry telemetry)
    {
        var watch = new Stopwatch();
        watch.Start();
        IDictionary<string, string>? properties = null;

        switch (telemetry)
        {
            //todo: shared const with client
            //todo: is longtitude in trace, as well as dependency, or can we just check for it in dependency?
            case DependencyTelemetry dependencyTelemetry:
                if (!dependencyTelemetry.Properties.ContainsKey("dependencyTelemetry"))
                {
                    if (dependencyTelemetry.Name is "GET /api/services")
                    {
                        // command name is obsolete and has been replaced by Data, but should contain the same as Data
#pragma warning disable CS0618
                        dependencyTelemetry.CommandName = dependencyTelemetry.Data =
                            Sanitize(ApiQueryStringRegex, dependencyTelemetry.Data);
#pragma warning restore CS0618
                    }
                    else if (dependencyTelemetry.Name.StartsWith("GET /postcodes/"))
                    {
                        //todo: hardcode replacement at index - faster than a regex
#pragma warning disable CS0618
                        dependencyTelemetry.CommandName =
                            dependencyTelemetry.Data = Sanitize(PathRegex, dependencyTelemetry.Data);
#pragma warning restore CS0618
                        dependencyTelemetry.Name = Sanitize(PathRegex, dependencyTelemetry.Name);
                    }

                    properties = dependencyTelemetry.Properties;
                }
                else Debugger.Break();
                break;
            case TraceTelemetry traceTelemetry:
                if (!traceTelemetry.Properties.ContainsKey("dependencyTelemetry"))
                {
                    //todo: {[RequestPath, /ServiceFilter]}
                    // Message: "Start processing HTTP request GET https://api.postcodes.io/postcodes/M27%208SS"
                    // {[Scope, ["HTTP GET https://api.postcodes.io/postcodes/M27%208SS"]]}
                    // {[Uri, https://api.postcodes.io/postcodes/M27%208SS]}

                    // order by least common for efficiency
                    if (traceTelemetry.Properties.TryGetValue("RequestPath", out string? path)
                        && path is "/ServiceFilter")
                        // when calling the API, we need to redact on GET
                        // when the request is for the web, we only need to redact on POST
                        //todo: try some different ways of doing this and see which is fastest
                        //&& traceTelemetry.Properties.TryGetValue("Method", out string? method)
                        //&& method is "GET")
                    {
                        traceTelemetry.Message = Sanitize(SiteQueryStringRegex, traceTelemetry.Message);
                        traceTelemetry.Message = Sanitize(PathRegex, traceTelemetry.Message);
                        foreach (string propertyKey in TracePropertiesToRedact)
                        {
                            SanitizeProperty(SiteQueryStringRegex, traceTelemetry.Properties, propertyKey);
                            SanitizeProperty(PathRegex, traceTelemetry.Properties, propertyKey);
                        }
                    }

                    properties = traceTelemetry.Properties;
                }
                else Debugger.Break();
                break;
            case RequestTelemetry requestTelemetry:
                if (!requestTelemetry.Properties.ContainsKey("dependencyTelemetry"))
                {
                    if (requestTelemetry.Name == "GET /ServiceFilter/Index")
                    {
                        //todo: cut down regex??
                        requestTelemetry.Url = Sanitize(SiteQueryStringRegex, requestTelemetry.Url);
                    }

                    properties = requestTelemetry.Properties;
                }
                else Debugger.Break();
                break;
        }

        watch.Stop();
        properties?.Add("TelemetryPiiRedactor", watch.ElapsedMilliseconds.ToString());

        DebugCheckForUnredactedData(telemetry);
    }

    private void SanitizeProperty(Regex regex, IDictionary<string, string> properties, string key)
    {
        if (properties.TryGetValue(key, out string? value))
        {
            properties[key] = Sanitize(regex, value);
        }
    }

    private string Sanitize(Regex regex, string value)
    {
        return regex.Replace(value, "REDACTED");
    }

    private Uri Sanitize(Regex regex, Uri uri)
    {
        //todo: better to use equals or contains and only create a uri if necessary (might be slower, but should stop memory churn)
        string unredactedUri = uri.ToString();
        string redactedUri = regex.Replace(unredactedUri, "REDACTED");
        return redactedUri != unredactedUri ? new Uri(redactedUri) : uri;
    }

    [Conditional("DEBUG_REDACTOR")]
    private void DebugCheckForUnredactedData(ITelemetry telemetry)
    {
        if (telemetry is AvailabilityTelemetry availabilityTelemetry)
        {
            DebugCheckForUnredactedData(availabilityTelemetry.Properties, availabilityTelemetry.Message);
        }
        if (telemetry is DependencyTelemetry dependencyTelemetry)
        {
#pragma warning disable CS0618
            DebugCheckForUnredactedData(dependencyTelemetry.Properties, dependencyTelemetry.Name, dependencyTelemetry.CommandName, dependencyTelemetry.Data);
#pragma warning restore CS0618
        }
        if (telemetry is EventTelemetry eventTelemetry)
        {
            DebugCheckForUnredactedData(eventTelemetry.Properties, eventTelemetry.Name);
        }
        //todo: inject exceptions around filtering page
        if (telemetry is ExceptionTelemetry exceptionTelemetry)
        {
            DebugCheckForUnredactedData(exceptionTelemetry.Properties, exceptionTelemetry.Message, exceptionTelemetry.Exception?.Message);
        }
        // don't think so, so remove soon
        if (telemetry is MetricTelemetry metricTelemetry)
        {
            DebugCheckForUnredactedData(metricTelemetry.Properties);
        }
        if (telemetry is PageViewPerformanceTelemetry pageViewPerformanceTelemetry)
        {
            DebugCheckForUnredactedData(pageViewPerformanceTelemetry.Properties);
        }
        if (telemetry is PageViewTelemetry pageViewTelemetry)
        {
            DebugCheckForUnredactedData(pageViewTelemetry.Properties);
        }
        if (telemetry is RequestTelemetry requestTelemetry)
        {
            DebugCheckForUnredactedData(requestTelemetry.Properties, requestTelemetry.Name, requestTelemetry.Url.ToString());
        }
        if (telemetry is TraceTelemetry traceTelemetry)
        {
            //todo: {[RequestPath, /ServiceFilter]}
            // Message: "Start processing HTTP request GET https://api.postcodes.io/postcodes/M27%208SS"
            // {[Scope, ["HTTP GET https://api.postcodes.io/postcodes/M27%208SS"]]}
            // {[Uri, https://api.postcodes.io/postcodes/M27%208SS]}
            DebugCheckForUnredactedData(traceTelemetry.Properties, traceTelemetry.Message);
        }
    }

    [Conditional("DEBUG_REDACTOR")]
    private void DebugCheckForUnredactedData(IDictionary<string, string> properties, params string?[] rootPropertyValues)
    {
        foreach (string? rootProperty in rootPropertyValues.Where(v => v != null))
        {
            DebugCheckForUnredactedData(rootProperty!);
        }

        foreach (var property in properties)
        {
            DebugCheckForUnredactedData(property.Value);
        }
    }

    [Conditional("DEBUG_REDACTOR")]
    private void DebugCheckForUnredactedData(string value)
    {
        if ((value.Contains("postcode=") || value.Contains("postcodes/"))
            && !(value.Contains("postcode=REDACTED") || value.Contains("postcodes/REDACTED")))
        {
            Debugger.Break();
        }

        if (value.Contains("latitude=")
            && !value.Contains("latitude=REDACTED"))
        {
            Debugger.Break();
        }

        if (value.Contains("longitude=")
            && !value.Contains("longitude=REDACTED"))
        {
            Debugger.Break();
        }

        if (value.Contains("longtitude=")
            && !value.Contains("longtitude=REDACTED"))
        {
            Debugger.Break();
        }
    }
}
