﻿using System.Diagnostics;
using Microsoft.ApplicationInsights.Channel;
using Microsoft.ApplicationInsights.Extensibility;
using Microsoft.ApplicationInsights.DataContracts;
using System.Text.RegularExpressions;

namespace FamilyHubs.ServiceDirectory.Web.Security;

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

/// <remarks>
/// See https://learn.microsoft.com/en-us/azure/azure-monitor/app/api-filtering-sampling
/// </remarks>>
public class RedactPiiInitializer : ITelemetryInitializer
{
    //todo: do we handle the user changing the case in the url??

    // longtit... is due to the spelling error in the API. at some point, should fix that (and all the consumers)
    //private static readonly Regex QueryStringRegex = new(@"(?<=(postcode|latitude|longitude|longtitude)=)[^&\s]+", RegexOptions.Compiled);
    // having a single more complex regex might be faster, as its more likely to be in caches
    private static readonly Regex SiteQueryStringRegex = new(@"(?<=(postcode|latitude|longitude|longtitude)=)[^&\s]+", RegexOptions.Compiled);
    private static readonly Regex ApiQueryStringRegex = new(@"(?<=(latitude|longtitude)=)[^&\s]+", RegexOptions.Compiled);
    private static readonly Regex PathRegex = new(@"(?<=postcodes\/)[\w% ]+", RegexOptions.Compiled);

    // is this going to slow things down too much, just exclude the logs instead (not nice!)
    private static readonly string[] TracePropertiesToRedact = { "Uri", "Scope", "QueryString", "HostingRequestStartingLog", "HostingRequestFinishedLog" };

    public void Initialize(ITelemetry telemetry)
    {
        switch (telemetry)
        {
            //todo: shared const with client
            //todo: is longtitude in trace, as well as dependency, or can we just check for it in dependency?
            case DependencyTelemetry dependencyTelemetry:
                if (dependencyTelemetry.Name is "GET /api/services")
                {
                    // command name is obsolete and has been replaced by Data, but should contain the same as Data
#pragma warning disable CS0618
                    dependencyTelemetry.CommandName = dependencyTelemetry.Data = Sanitize(ApiQueryStringRegex, dependencyTelemetry.Data);
#pragma warning restore CS0618
                }
                else if (dependencyTelemetry.Name.StartsWith("GET /postcodes/"))
                {
                    //todo: hardcode replacement at index - faster than a regex
#pragma warning disable CS0618
                    dependencyTelemetry.CommandName = dependencyTelemetry.Data = Sanitize(PathRegex, dependencyTelemetry.Data);
#pragma warning restore CS0618
                    dependencyTelemetry.Name = Sanitize(PathRegex, dependencyTelemetry.Name);
                }
                break;
            case TraceTelemetry traceTelemetry:
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
                break;

        }

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
            DebugCheckForUnredactedData(requestTelemetry.Properties, requestTelemetry.Name);
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

    private void DebugCheckForUnredactedData(string value)
    {
        if ((value.Contains("postcode=")||value.Contains("postcodes/"))
            && !(value.Contains("postcode=REDACTED")||value.Contains("postcodes/REDACTED")))
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

// do we also need to redact from serilog??

/*
 *Yes, if you redact sensitive information from what gets sent to Application Insights, you should also remove the sensitive data from Serilog logs as well. This is because Serilog can also send logs to Application Insights, and if the sensitive data is included in the Serilog logs, it can still end up in Application Insights.

To ensure that sensitive data is not included in your logs, you can use Serilog's filtering capabilities to remove or replace sensitive data before it is logged. For example, you can use the WithSensitiveData() method to specify properties that should be treated as sensitive, and then use the Destructure.ByTransforming() method to redact those properties:

csharp
Copy code
Log.Logger = new LoggerConfiguration()
    .Destructure.ByTransforming<MySensitiveData>(x => new MySensitiveData { Password = "****" }) // replace password with "****"
    .WriteTo.ApplicationInsights(...)
    .CreateLogger();
In this example, MySensitiveData is a custom class that contains sensitive information (in this case, a Password property). The Destructure.ByTransforming() method is used to transform instances of MySensitiveData by creating a new instance with the sensitive information redacted (replaced with "****"). This ensures that the redacted data is not included in the logs that are sent to Application Insights.
 *
 */