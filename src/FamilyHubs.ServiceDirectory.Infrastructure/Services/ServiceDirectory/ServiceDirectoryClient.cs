using FamilyHubs.ServiceDirectory.Shared.Models.Api.OpenReferralServices;
using FamilyHubs.SharedKernel;
using Microsoft.AspNetCore.WebUtilities;

namespace FamilyHubs.ServiceDirectory.Infrastructure.Services.ServiceDirectory
{
    public class ServiceDirectoryClient
    {
        private readonly IHttpClientFactory _httpClientFactory;
        internal const string HttpClientName = "servicedirectory";
        //private static readonly Uri GetServicesUri = new("services", UriKind.Relative);
        private static readonly string GetServicesBaseUri = "services";

        public ServiceDirectoryClient(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
        }

        public async Task<PaginatedList<OpenReferralServiceDto>> GetServices(CancellationToken cancellationToken = default)
        {
            var httpClient = _httpClientFactory.CreateClient(HttpClientName);

            var queryParams = new Dictionary<string, string?>
            {
                {"serviceType", "Family Experience"}
            };

            string getServicesUri = QueryHelpers.AddQueryString(GetServicesBaseUri, queryParams);

            var servicesResponse = await httpClient.GetAsync(getServicesUri, cancellationToken);

            var services = await JsonSerializer.DeserializeAsync<PaginatedList<OpenReferralServiceDto>>(
                await servicesResponse.Content.ReadAsStreamAsync(cancellationToken),
                //todo: needed?
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true },
                cancellationToken);

            if (services is null)
            {
                // the only time it'll be null, is if the API returns "null"
                // (see https://stackoverflow.com/questions/71162382/why-are-the-return-types-of-nets-system-text-json-jsonserializer-deserialize-m)
                // unlikely, but possibly (pass new MemoryStream(Encoding.UTF8.GetBytes("null")) to see it actually return null)
                // note we hard-code passing "null", rather than messing about trying to rewind the stream, as this is such a corner case and we want to let the deserializer take advantage of the async stream (in the happy case)
                //throw new PostcodesIoClientException(servicesResponse, "null");
                //todo:
                throw new NotImplementedException();
            }

            return services;
        }
    }
}
