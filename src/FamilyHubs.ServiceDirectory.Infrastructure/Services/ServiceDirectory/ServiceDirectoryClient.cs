using FamilyHubs.ServiceDirectory.Core.ServiceDirectory.Interfaces;
using FamilyHubs.ServiceDirectory.Shared.Models.Api.OpenReferralServices;
using FamilyHubs.SharedKernel;
using Microsoft.AspNetCore.WebUtilities;
using System.Globalization;

namespace FamilyHubs.ServiceDirectory.Infrastructure.Services.ServiceDirectory;

public class ServiceDirectoryClient : IServiceDirectoryClient
{
    private readonly IHttpClientFactory _httpClientFactory;
    internal const string HttpClientName = "servicedirectory";
    //todo: is status for soft delete??
    private static readonly string GetServicesBaseUri = "api/services?serviceType=Family Experience";

    public ServiceDirectoryClient(IHttpClientFactory httpClientFactory)
    {
        _httpClientFactory = httpClientFactory;
    }

    //todo: categories are passed as comma separated taxonmyIds
    public async Task<PaginatedList<OpenReferralServiceDto>> GetServices(
        string districtCode,
        float latitude,
        float longitude,
        int? maximumProximityMeters = null,
        int? minimumAge = null,
        int? maximumAge = null,
        bool? isPaidFor = null,
        CancellationToken cancellationToken = default)
    {
        var httpClient = _httpClientFactory.CreateClient(HttpClientName);

        var queryParams = new Dictionary<string, string?>
        {
            {"districtCode", districtCode},
            {"latitude", latitude.ToString(CultureInfo.InvariantCulture)},
            {"longtitude", longitude.ToString(CultureInfo.InvariantCulture)}
        };

        if (maximumProximityMeters != null)
        {
            queryParams.Add("proximity", maximumProximityMeters.ToString());
        }

        //todo: map from the front end (where's best?) ranges for these
        if (minimumAge != null)
        {
            queryParams.Add("minimum_age", minimumAge.ToString());
        }

        if (maximumAge != null)
        {
            queryParams.Add("maximum_age", minimumAge.ToString());
        }

        if (isPaidFor != null)
        {
            queryParams.Add("isPaidFor", isPaidFor.ToString());
        }

        //todo: search category by taxonomy
        //todo: search show family hubs/services and groups by taxonomy
        //todo: age range doesn't match ranges in api's : api to be updated to combine ranges
        //todo: SEND as a param in api? needs investigation

        string getServicesUri = QueryHelpers.AddQueryString(GetServicesBaseUri, queryParams);

        var response = await httpClient.GetAsync(getServicesUri, cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            throw new ServiceDirectoryClientException(response, await response.Content.ReadAsStringAsync(cancellationToken));
        }

        var services = await JsonSerializer.DeserializeAsync<PaginatedList<OpenReferralServiceDto>>(
            await response.Content.ReadAsStreamAsync(cancellationToken),
            //todo: needed?
            new JsonSerializerOptions { PropertyNameCaseInsensitive = true },
            cancellationToken);

        if (services is null)
        {
            // the only time it'll be null, is if the API returns "null"
            // (see https://stackoverflow.com/questions/71162382/why-are-the-return-types-of-nets-system-text-json-jsonserializer-deserialize-m)
            // unlikely, but possibly (pass new MemoryStream(Encoding.UTF8.GetBytes("null")) to see it actually return null)
            // note we hard-code passing "null", rather than messing about trying to rewind the stream, as this is such a corner case and we want to let the deserializer take advantage of the async stream (in the happy case)
            throw new ServiceDirectoryClientException(response, "null");
        }

        return services;
    }
}