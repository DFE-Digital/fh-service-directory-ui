using FamilyHubs.ServiceDirectory.Core.Exceptions;
using FamilyHubs.ServiceDirectory.Core.Postcode.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Polly;
using Polly.Contrib.WaitAndRetry;
using Polly.Extensions.Http;

namespace FamilyHubs.ServiceDirectory.Infrastructure.Services.PostcodesIo.Extensions;

public static class PostcodesIoServiceCollectionExtension
{
    /// <summary>
    /// Adds the IPostcodeLookup service to enable fetching postcode information from postcodes.io
    /// </summary>
    /// <remarks>
    /// Policy notes:
    /// We don't add a circuit-breaker (but we might later).
    /// We might want to change the Handler lifetime from the default of 2 minutes, using
    /// .SetHandlerLifetime(TimeSpan.FromMinutes(3));
    /// it's a balance between keeping sockets open and latency in handling dns updates.
    /// </remarks>
    public static void AddPostcodesIoClient(this IServiceCollection services, IConfiguration configuration)
    {
        const string endpointConfigKey = "PostcodesIo:Endpoint";

        var timeoutPolicy = Policy.TimeoutAsync<HttpResponseMessage>(10);

        //todo: do we really want to retry talking to postcodes.io???
        var delay = Backoff.DecorrelatedJitterBackoffV2(
            medianFirstRetryDelay: TimeSpan.FromSeconds(1),
            retryCount: 2);

        services.AddHttpClient(PostcodesIoLookup.HttpClientName, client =>
            {
                string endpoint = ConfigurationException.ThrowIfNotUrl(endpointConfigKey, configuration[endpointConfigKey], "The postcodesio URL", "https://api.postcodes.io/postcodes/");
                client.BaseAddress = new Uri(endpoint);
            })
            .AddPolicyHandler((callbackServices, request) => HttpPolicyExtensions
                .HandleTransientHttpError()
                .WaitAndRetryAsync(delay, (result, timespan, retryAttempt, context) =>
                {
                    callbackServices.GetService<ILogger<PostcodesIoLookup>>()?
                        .LogWarning("Delaying for {Timespan}, then making retry {RetryAttempt}.",
                            timespan, retryAttempt);
                }))
            .AddPolicyHandler(timeoutPolicy);

        services.AddTransient<IPostcodeLookup, PostcodesIoLookup>();
    }
}