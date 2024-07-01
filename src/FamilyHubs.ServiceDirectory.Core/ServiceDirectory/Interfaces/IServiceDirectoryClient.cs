using System.Net;
using FamilyHubs.ServiceDirectory.Core.ServiceDirectory.Models;
using FamilyHubs.ServiceDirectory.Shared.Dto;
using FamilyHubs.ServiceDirectory.Shared.Enums;
using FamilyHubs.ServiceDirectory.Shared.Models;
using Microsoft.AspNetCore.Http;

namespace FamilyHubs.ServiceDirectory.Core.ServiceDirectory.Interfaces;

public interface IServiceDirectoryClient
{
    // leaky, not clean, but this is our service, as opposed to a generic service that we might want to swap
    Task<PaginatedList<TaxonomyDto>> GetTaxonomies(CancellationToken cancellationToken = default);
    Task<(PaginatedList<ServiceDto> services, HttpResponseMessage? response)> GetServices(ServicesParams servicesParams, CancellationToken cancellationToken = default);

    /// <summary>
    /// Fetches an organisation from the service directory
    /// </summary>
    /// <param name="id">The ID of the organisation to fetch.</param>
    /// <param name="cancellationToken"></param>
    /// <returns>The organisation</returns>
    /// <remarks>
    /// Organisations are cached for 1 hour.
    /// </remarks>
    Task<OrganisationDto> GetOrganisation(long id, CancellationToken cancellationToken = default);

    Task<PaginatedList<ServiceWithOrganisation>> GetServicesWithOrganisation(ServicesParams servicesParams, CancellationToken cancellationToken = default);
    Task RecordServiceSearch(
        ServiceDirectorySearchEventType eventType,
        string postcode,
        string districtCode,
        byte? searchWithin,
        IEnumerable<ServiceDto> services,
        DateTime requestTimestamp,
        DateTime? responseTimestamp,
        HttpStatusCode? responseStatusCode,
        Guid correlationId
    );
}
