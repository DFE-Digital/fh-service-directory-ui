using FamilyHubs.ServiceDirectory.Core.ServiceDirectory.Interfaces;
using FamilyHubs.ServiceDirectory.Shared.Models.Api.OpenReferralServices;
using FamilyHubs.SharedKernel;
using System.Globalization;
using FamilyHubs.ServiceDirectory.Core.ServiceDirectory.Models;
using FamilyHubs.ServiceDirectory.Core.UrlHelpers;
using FamilyHubs.ServiceDirectory.Shared.Models.Api.OpenReferralOrganisations;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using FamilyHubs.ServiceDirectory.Core.Exceptions;
using FamilyHubs.ServiceDirectory.Core.HealthCheck;

namespace FamilyHubs.ServiceDirectory.Infrastructure.Services.ServiceDirectory;

public class ServiceDirectoryClient : IServiceDirectoryClient, IHealthCheckUrlGroup
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IMemoryCache _memoryCache;
    private static string? _endpoint;
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
        ServicesWithOrganisationParams servicesWithOrganisationParams,
        CancellationToken cancellationToken = default)
    {
        var services = await GetServices(servicesWithOrganisationParams, cancellationToken);

        IEnumerable<ServiceWithOrganisation> servicesWithOrganisations = await Task.WhenAll(
            services.Items.Select(async s =>
                new ServiceWithOrganisation(s, await GetOrganisation(s.OpenReferralOrganisationId, cancellationToken))));

        return new PaginatedList<ServiceWithOrganisation>(
            servicesWithOrganisations.ToList(),
            services.TotalCount,
            services.PageNumber,
            //todo: not nice to hard-code default from api
            servicesWithOrganisationParams.PageSize ?? 10);
    }

    public async Task<PaginatedList<OpenReferralServiceDto>> GetServices(
        ServicesWithOrganisationParams servicesWithOrganisationParams,
        CancellationToken cancellationToken = default)
    {
        var httpClient = _httpClientFactory.CreateClient(HttpClientName);

        // mandatory params
        var queryParams = new Dictionary<string, string?>
        {
            {"districtCode", servicesWithOrganisationParams.AdminArea},
            {"latitude", servicesWithOrganisationParams.Latitude.ToString(CultureInfo.InvariantCulture)},
            {"longtitude", servicesWithOrganisationParams.Longitude.ToString(CultureInfo.InvariantCulture)}
        };

        // optional params
        queryParams
            .AddOptionalQueryParams("proximity", servicesWithOrganisationParams.MaximumProximityMeters)
            .AddOptionalQueryParams("given_age", servicesWithOrganisationParams.GivenAge)
            .AddOptionalQueryParams("isPaidFor", servicesWithOrganisationParams.IsPaidFor)
            .AddOptionalQueryParams("pageNumber", servicesWithOrganisationParams.PageNumber)
            .AddOptionalQueryParams("pageSize", servicesWithOrganisationParams.PageSize)
            .AddOptionalQueryParams("isFamilyHub", servicesWithOrganisationParams.FamilyHub)
            .AddOptionalQueryParams("maxFamilyHubs", servicesWithOrganisationParams.MaxFamilyHubs)
            .AddOptionalQueryParams("taxonmyIds", servicesWithOrganisationParams.TaxonomyIds);

        var getServicesUri = queryParams.CreateUriWithQueryString(GetServicesBaseUri);

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

    //todo: priority for a (multi-threaded) unit test
    // based on code from https://sahansera.dev/in-memory-caching-aspcore-dotnet/
    private async Task<OpenReferralOrganisationDto> GetOrganisationTryCache(string id, CancellationToken cancellationToken = default)
    {
        var semaphore = new SemaphoreSlim(1, 1);

        if (_memoryCache.TryGetValue(id, out OpenReferralOrganisationDto? organisation))
            return organisation!;

        try
        {
            await semaphore.WaitAsync(cancellationToken);

            // recheck to make sure it didn't populate before entering semaphore
            if (_memoryCache.TryGetValue(id, out organisation))
                return organisation!;

            organisation = await GetOrganisationFromApi(id, cancellationToken);
            _memoryCache.Set(id, organisation, TimeSpan.FromHours(1));
        }
        finally
        {
            semaphore.Release();
        }
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

    internal static string GetEndpoint(IConfiguration configuration)
    {
        const string endpointConfigKey = "ServiceDirectoryAPI:Endpoint";

        // as long as the config isn't changed, the worst that can happen is we fetch more than once
        return _endpoint ??= ConfigurationException.ThrowIfNotUrl(
            endpointConfigKey,
            configuration[endpointConfigKey],
            "The service directory URL");
    }

    public static Uri HealthUrl(IConfiguration configuration)
    {
        //todo: add health check to API with DbContext probe
        return new Uri(new Uri(GetEndpoint(configuration)), "api/info");
    }
}