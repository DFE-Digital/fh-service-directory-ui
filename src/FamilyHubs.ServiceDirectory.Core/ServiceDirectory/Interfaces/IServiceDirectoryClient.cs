using FamilyHubs.ServiceDirectory.Shared.Models.Api.OpenReferralServices;
using FamilyHubs.SharedKernel;

namespace FamilyHubs.ServiceDirectory.Core.ServiceDirectory.Interfaces
{
    public interface IServiceDirectoryClient
    {
        // leaky, not clean, but this is our service, as opposed to a generic service that we might want to swap
        public Task<PaginatedList<OpenReferralServiceDto>> GetServices(
            string districtCode,
            float? latitude = null,
            float? longitude = null,
            int? maximumProximityMeters = null,
            int? minimumAge = null,
            int? maximumAge = null,
            //todo: enum
            bool? isPaidFor = null,
            CancellationToken cancellationToken = default);
    }
}
