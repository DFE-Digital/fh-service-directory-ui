using FamilyHubs.ServiceDirectory.Core.ServiceDirectory.Interfaces;
using FamilyHubs.SharedKernel;
using System.Globalization;
using FamilyHubs.ServiceDirectory.Core.ServiceDirectory.Models;
using FamilyHubs.ServiceDirectory.Core.UrlHelpers;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using FamilyHubs.ServiceDirectory.Core.Exceptions;
using FamilyHubs.ServiceDirectory.Core.HealthCheck;
using FamilyHubs.ServiceDirectory.Shared.Dto;

namespace FamilyHubs.ServiceDirectory.Infrastructure.Services.ServiceDirectory;

public class ServiceDirectoryClient : IServiceDirectoryClient, IHealthCheckUrlGroup
{
    private static readonly Guid TaxonomyCacheId = Guid.NewGuid();
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IMemoryCache _memoryCache;
    private static string? _endpoint;
    internal const string HttpClientName = "servicedirectory";
    private static readonly string GetServicesBaseUri = "api/services?serviceType=FamilyExperience";

    public ServiceDirectoryClient(IHttpClientFactory httpClientFactory, IMemoryCache memoryCache)
    {
        _httpClientFactory = httpClientFactory;
        _memoryCache = memoryCache;
    }

    public async Task<PaginatedList<ServiceWithOrganisation>> GetServicesWithOrganisation(ServicesParams servicesParams, CancellationToken cancellationToken = default)
    {
        var services = await GetServices(servicesParams, cancellationToken);

        IEnumerable<ServiceWithOrganisation> servicesWithOrganisations = await Task.WhenAll(
            services.Items.Select(async s =>
                new ServiceWithOrganisation(s, await GetOrganisation(s.OrganisationId, cancellationToken))));

        return new PaginatedList<ServiceWithOrganisation>(
            servicesWithOrganisations.ToList(),
            services.TotalCount,
            services.PageNumber,
            //todo: not nice to hard-code default from api
            servicesParams.PageSize ?? 10);
    }

    public Task<PaginatedList<TaxonomyDto>> GetTaxonomies(CancellationToken cancellationToken = default)
    {
        return GetTaxonomiesTryCache(cancellationToken);
    }

    private async Task<PaginatedList<TaxonomyDto>> GetTaxonomiesTryCache(CancellationToken cancellationToken = default)
    {
        var semaphore = new SemaphoreSlim(1, 1);

        if (_memoryCache.TryGetValue(TaxonomyCacheId, out PaginatedList<TaxonomyDto>? taxonomies))
            return taxonomies!;

        try
        {
            await semaphore.WaitAsync(cancellationToken);

            // recheck to make sure it didn't populate before entering semaphore
            if (_memoryCache.TryGetValue(TaxonomyCacheId, out taxonomies))
                return taxonomies!;

            taxonomies = await GetTaxonomiesFromApi(cancellationToken);
            _memoryCache.Set(TaxonomyCacheId, taxonomies, TimeSpan.FromHours(1));
        }
        finally
        {
            semaphore.Release();
        }
        return taxonomies;
    }

    public async Task<PaginatedList<TaxonomyDto>> GetTaxonomiesFromApi(CancellationToken cancellationToken = default)
    {
        var httpClient = _httpClientFactory.CreateClient(HttpClientName);

        var response = await httpClient.GetAsync("api/taxonomies?taxonomyType=ServiceCategory&pageSize=99999", cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            throw new ServiceDirectoryClientException(response, await response.Content.ReadAsStringAsync(cancellationToken));
        }

        var taxonomies = await JsonSerializer.DeserializeAsync<PaginatedList<TaxonomyDto>>(
            await response.Content.ReadAsStreamAsync(cancellationToken),
            new JsonSerializerOptions { PropertyNameCaseInsensitive = true },
            cancellationToken);

        if (taxonomies is null)
        {
            throw new ServiceDirectoryClientException(response, "null");
        }

        return taxonomies;
    }

    public async Task<PaginatedList<ServiceDto>> GetServices(ServicesParams servicesParams, CancellationToken cancellationToken = default)
    {
        var httpClient = _httpClientFactory.CreateClient(HttpClientName);

        // mandatory params
        var queryParams = new Dictionary<string, string?>
        {
            {"districtCode", servicesParams.AdminArea},
            {"latitude", servicesParams.Latitude.ToString(CultureInfo.InvariantCulture)},
            {"longitude", servicesParams.Longitude.ToString(CultureInfo.InvariantCulture)}
        };

        // optional params
        queryParams
            .AddOptionalQueryParams("proximity", servicesParams.MaximumProximityMeters)
            .AddOptionalQueryParams("givenAge", servicesParams.GivenAge)
            .AddOptionalQueryParams("isPaidFor", servicesParams.IsPaidFor)
            .AddOptionalQueryParams("pageNumber", servicesParams.PageNumber)
            .AddOptionalQueryParams("pageSize", servicesParams.PageSize)
            .AddOptionalQueryParams("isFamilyHub", servicesParams.FamilyHub)
            .AddOptionalQueryParams("maxFamilyHubs", servicesParams.MaxFamilyHubs)
            .AddOptionalQueryParams("taxonomyIds", servicesParams.TaxonomyIds);

        var getServicesUri = queryParams.CreateUriWithQueryString(GetServicesBaseUri);

        var response = await httpClient.GetAsync(getServicesUri, cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            throw new ServiceDirectoryClientException(response, await response.Content.ReadAsStringAsync(cancellationToken));
        }

        var services = await JsonSerializer.DeserializeAsync<PaginatedList<ServiceDto>>(
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

    public Task<OrganisationDto> GetOrganisation(long id, CancellationToken cancellationToken = default)
    {
        if (id == 0) throw new ArgumentOutOfRangeException(nameof(id), "Organisation Id must not be zero");
        

        return GetOrganisationTryCache(id, cancellationToken);
    }

    // based on code from https://sahansera.dev/in-memory-caching-aspcore-dotnet/
    private async Task<OrganisationDto> GetOrganisationTryCache(long id, CancellationToken cancellationToken = default)
    {
        var semaphore = new SemaphoreSlim(1, 1);

        if (_memoryCache.TryGetValue(id, out OrganisationDto? organisation))
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

    private async Task<OrganisationDto> GetOrganisationFromApi(long id, CancellationToken cancellationToken)
    {
        var httpClient = _httpClientFactory.CreateClient(HttpClientName);

        var response = await httpClient.GetAsync($"api/organisations/{id}", cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            throw new ServiceDirectoryClientException(response, await response.Content.ReadAsStringAsync(cancellationToken));
        }

        var organisation = await JsonSerializer.DeserializeAsync<OrganisationDto>(
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