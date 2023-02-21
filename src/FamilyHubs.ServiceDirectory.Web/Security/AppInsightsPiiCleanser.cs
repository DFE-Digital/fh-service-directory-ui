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

        if (item is TraceTelemetry traceTelemetry
            && traceTelemetry.Properties.TryGetValue("path", out string? path)
            && path is "/ServiceFilter")
        {
            // make pii safe
#pragma warning disable
            traceTelemetry.Properties["message"] = traceTelemetry.Properties["message"];
        }

        //if (!OKtoSend(item))
        //{
        //    return;
        //}

        Next.Process(item);
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