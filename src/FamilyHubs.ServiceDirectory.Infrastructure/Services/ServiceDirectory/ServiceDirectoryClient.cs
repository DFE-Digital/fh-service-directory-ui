﻿using FamilyHubs.ServiceDirectory.Core.ServiceDirectory.Interfaces;
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
        int? givenAge = null,
        bool? isPaidFor = null,
        int? maxFamilyHubs = null,
        IEnumerable<string>? showOrganisationTypeIds = null,
        IEnumerable<string>? taxonomyIds = null,
        int? pageNumber = null,
        int? pageSize = null,
        CancellationToken cancellationToken = default)
    {
        var services = await GetServices(
            districtCode, latitude, longitude, maximumProximityMeters, givenAge, isPaidFor, maxFamilyHubs, showOrganisationTypeIds, taxonomyIds, pageNumber, pageSize, cancellationToken);

        IEnumerable<ServiceWithOrganisation> servicesWithOrganisations = await Task.WhenAll(
            services.Items.Select(async s =>
                new ServiceWithOrganisation(s, await GetOrganisation(s.OpenReferralOrganisationId, cancellationToken))));

        //todo: filtering by service/family hub really belongs in the api, but to minimise any possible disruption to the is side before mvp, we'll do it in the front-end for now
        // we'd pass down a csv param for filtering by organisationtypeid in the same manner as it currently handles filtering by taxonomy
        // we could then pass the organisation data back too (the api currently doesn't fetch the associated org entity when fetching the services)
        // searching by family hub in api pr .. https://github.com/DFE-Digital/fh-service-directory-api/pull/85
        //if (showOrganisationTypeIds != null)
        //{
        //    servicesWithOrganisations =
        //        servicesWithOrganisations.Where(s => s.Organisation.OrganisationType.Id == showOrganisationTypeIds);
        //}

        return new PaginatedList<ServiceWithOrganisation>(
            servicesWithOrganisations.ToList(),
            services.TotalCount,
            services.PageNumber,
            //todo: not nice to hard-code default from api
            pageSize ?? 1);
    }

    public async Task<PaginatedList<OpenReferralServiceDto>> GetServices(
        string districtCode,
        float latitude,
        float longitude,
        int? maximumProximityMeters = null,
        int? givenAge = null,
        bool? isPaidFor = null,
        int? maxFamilyHubs = null,
        IEnumerable<string>? showOrganisationTypeIds = null,
        IEnumerable<string>? taxonomyIds = null,
        int? pageNumber = null,
        int? pageSize = null,
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

#if min_max_age
        // todo: to my eye, min and max age handling in the api looks broken
        // (we'll switch to using given_age instead)
        // perhaps nothing is using min & max age??
        if (minimumAge != null)
        {
            queryParams.Add("minimum_age", minimumAge.ToString());
        }

        if (maximumAge != null)
        {
            queryParams.Add("maximum_age", minimumAge.ToString());
        }
#endif
        if (givenAge != null)
        {
            queryParams.Add("given_age", givenAge.ToString());
        }

        if (isPaidFor != null)
        {
            queryParams.Add("isPaidFor", isPaidFor.ToString());
        }

        if (pageNumber != null)
        {
            queryParams.Add("pageNumber", pageNumber.ToString());
        }

        if (pageSize != null)
        {
            queryParams.Add("pageSize", pageSize.ToString());
        }

        if (showOrganisationTypeIds != null)
        {
            switch (showOrganisationTypeIds.Count())
            {
                case 0:
                    break;
                case 1:
                    var showOrgTypeId = showOrganisationTypeIds.First();
                    queryParams.Add("isFamilyHub", (showOrgTypeId == ServiceDirectoryConstants.OrganisationTypeIdFamilyHub).ToString());
                    break;
                default:
                    throw new NotImplementedException();
            }
        }

        if (taxonomyIds != null && taxonomyIds.Any())
        {
            queryParams.Add("taxonmyIds", string.Join(',', taxonomyIds));
        }

        //todo: instead of fetching the org per service and caching, we could query the api at startup to get all the organisations (but if we go with the option above, we'd remove that anyway, so we'll leave for now)
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
}