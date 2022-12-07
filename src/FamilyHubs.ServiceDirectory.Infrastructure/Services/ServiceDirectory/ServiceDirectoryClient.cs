using FamilyHubs.ServiceDirectory.Core.ServiceDirectory.Interfaces;
using FamilyHubs.ServiceDirectory.Shared.Models.Api.OpenReferralServices;
using FamilyHubs.SharedKernel;
using Microsoft.AspNetCore.WebUtilities;
using System.Globalization;
using FamilyHubs.ServiceDirectory.Core.ServiceDirectory.Models;
using FamilyHubs.ServiceDirectory.Shared.Models.Api.OpenReferralOrganisations;
using Microsoft.Extensions.Caching.Memory;

namespace FamilyHubs.ServiceDirectory.Infrastructure.Services.ServiceDirectory;

public class ServiceDirectoryClient : IServiceDirectoryClient
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IMemoryCache _memoryCache;
    internal const string HttpClientName = "servicedirectory";
    private static readonly string GetServicesBaseUri = "api/services?serviceType=Family Experience";

    public ServiceDirectoryClient(
        IHttpClientFactory httpClientFactory,
        IMemoryCache memoryCache)
    {
        _httpClientFactory = httpClientFactory;
        _memoryCache = memoryCache;
    }

    public async Task<PaginatedList<ServiceWithOrganisation>> GetServicesWithOrganisation(
        string districtCode,
        float latitude,
        float longitude,
        int? maximumProximityMeters = null,
        int? minimumAge = null,
        int? maximumAge = null,
        bool? isPaidFor = null,
        CancellationToken cancellationToken = default)
    {
        var services = await GetServices(
            districtCode, latitude, longitude, maximumProximityMeters, minimumAge, maximumAge, isPaidFor, cancellationToken);

        //todo: probably need locking
        var servicesWithOrganisations = await Task.WhenAll(
            services.Items.Select(async s =>
                new ServiceWithOrganisation(s, await GetOrganisation(s.OpenReferralOrganisationId, cancellationToken))));

        return new PaginatedList<ServiceWithOrganisation>(
            servicesWithOrganisations.ToList(),
            services.TotalCount,
            services.PageNumber,
            //todo: calc if we need & can
            //this.TotalPages = (int) Math.Ceiling((double) count / (double) pageSize);
            0);
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

        // mandatory params
        var queryParams = new Dictionary<string, string?>
        {
            {"districtCode", districtCode},
            {"latitude", latitude.ToString(CultureInfo.InvariantCulture)},
            {"longtitude", longitude.ToString(CultureInfo.InvariantCulture)}
        };

        // optional params
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

    public Task<OpenReferralOrganisationDto> GetOrganisation(string id, CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrEmpty(id);

        return GetOrganisationTryCache(id, cancellationToken);
    }

    private async Task<OpenReferralOrganisationDto> GetOrganisationTryCache(string id, CancellationToken cancellationToken = default)
    {
        if (_memoryCache.TryGetValue(id, out OpenReferralOrganisationDto? organisation))
            return organisation!;

        // doesn't really matter if multiple threads fetch organisations at the same time
        // not optimal, but they should all get and set the same result, so let's KISS
        organisation = await GetOrganisationFromApi(id, cancellationToken);
        _memoryCache.Set(id, organisation, TimeSpan.FromHours(1));
        return organisation;
    }

    private async Task<OpenReferralOrganisationDto> GetOrganisationFromApi(string id, CancellationToken cancellationToken)
    {
        var httpClient = _httpClientFactory.CreateClient(HttpClientName);

        var response = await httpClient.GetAsync($"api/organizations/{id}", cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            throw new ServiceDirectoryClientException(response, await response.Content.ReadAsStringAsync(cancellationToken));
        }

        var organisation = await JsonSerializer.DeserializeAsync<OpenReferralOrganisationDto>(
            await response.Content.ReadAsStreamAsync(cancellationToken),
            new JsonSerializerOptions { PropertyNameCaseInsensitive = true },
            cancellationToken);

        if (organisation is null)
        {
            // the only time it'll be null, is if the API returns "null"
            // (see https://stackoverflow.com/questions/71162382/why-are-the-return-types-of-nets-system-text-json-jsonserializer-deserialize-m)
            // unlikely, but possibly (pass new MemoryStream(Encoding.UTF8.GetBytes("null")) to see it actually return null)
            // note we hard-code passing "null", rather than messing about trying to rewind the stream, as this is such a corner case and we want to let the deserializer take advantage of the async stream (in the happy case)
            throw new ServiceDirectoryClientException(response, "null");
        }

        return organisation;
    }
}