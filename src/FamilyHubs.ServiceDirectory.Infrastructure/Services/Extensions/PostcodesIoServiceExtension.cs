using FamilyHubs.ServiceDirectory.Infrastructure.Services.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Polly;
using Polly.Contrib.WaitAndRetry;
using Polly.Extensions.Http;

//todo: only temporary
#pragma warning disable S1075

namespace FamilyHubs.ServiceDirectory.Infrastructure.Services.Extensions
{
    public static class PostcodesIoServiceCollectionExtension //ServiceCollectionExtensions
    {
        /// <summary>
        /// Adds the IPostcodesIoClient service to enable fetching postcode information from postcodes.io
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
            var timeoutPolicy = Policy.TimeoutAsync<HttpResponseMessage>(10);

            //todo: do we really want to retry talking to postcodes.io???
            var delay = Backoff.DecorrelatedJitterBackoffV2(
                medianFirstRetryDelay: TimeSpan.FromSeconds(1),
                retryCount: 2);

            services.AddHttpClient("postcodesio", client =>
                {
                    //todo: need to throw config exception if config is missing, rather than forgive null
                    //client.BaseAddress = new Uri(configuration["PostcodesIoEndpoint"]!);
                    client.BaseAddress = new Uri("https://api.postcodes.io/postcodes/");
                })
                .AddPolicyHandler((callbackServices, request) => HttpPolicyExtensions
                    .HandleTransientHttpError()
                    .WaitAndRetryAsync(delay, (result, timespan, retryAttempt, context) =>
                    {
                        callbackServices.GetService<ILogger<PostcodesIoClient>>()?
                            .LogWarning("Delaying for {Timespan}, then making retry {RetryAttempt}.",
                                timespan, retryAttempt);
                    }))
                .AddPolicyHandler(timeoutPolicy);

            services.AddTransient<IPostcodesIoClient, PostcodesIoClient>();
        }
    }
}
