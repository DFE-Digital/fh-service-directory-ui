using Microsoft.ApplicationInsights.Channel;
using Microsoft.ApplicationInsights.Extensibility;
using Microsoft.ApplicationInsights.DataContracts;

namespace FamilyHubs.ServiceDirectory.Web.Security;

public class AppInsightsPiiCleanser : ITelemetryProcessor
{
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

        // order by least common for efficiency
        if (item is TraceTelemetry traceTelemetry
            && traceTelemetry.Properties.TryGetValue("Path", out string? path)
            && path is "/ServiceFilter"
            && traceTelemetry.Properties.TryGetValue("Method", out string? method)
            && method is "GET")
        {
            // make pii safe
#pragma warning disable
            if (traceTelemetry.Properties.TryGetValue("QueryString", out string? queryString))
            {
                traceTelemetry.Properties["QueryString"] = Sanitize(queryString);
            }

            if (traceTelemetry.Properties.TryGetValue("HostingRequestStartingLog", out string? hostingRequestStartingLog))
            {
                traceTelemetry.Properties["HostingRequestStartingLog"] = Sanitize(hostingRequestStartingLog);
            }
        }

        //if (!OKtoSend(item))
        //{
        //    return;
        //}

        Next.Process(item);
    }

    // regex to handle all, or different methods for each?
    // Request starting HTTP/2 GET https://localhost:7199/ServiceFilter?postcode=M27%208SS&adminarea=E08000006&latitude=53.508884&longitude=-2.294605&frompostcodesearch=True - -
    // ?postcode=M27%208SS&adminarea=E08000006&latitude=53.508884&longitude=-2.294605&frompostcodesearch=True
    private string Sanitize(string value)
    {
        return $"Test-{value}";
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