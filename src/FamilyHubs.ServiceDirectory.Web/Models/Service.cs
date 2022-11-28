using Azure.Identity;

namespace FamilyHubs.ServiceDirectory.Web.Models
{
    //todo: work directly with DTO in page / or map to core dtc and use in page / or map to core, then to viewmodel in page? / or dto to viewmodel
    public enum ServiceType
    {
        FamilyHub,
        Service
    }

    //todo: type hierarchy, rather than type? or just null what we don't have?

    public record Service(
        ServiceType Type,
        string Name,
        //todo: number instead?
        string? Distance,
        string? RunBy,
        string? AgeRange,
        string? When,
        IEnumerable<string>? Where,
        string? Phone,
        string? Email,
        string? WebsiteName,
        string? WebsiteUrl,
        string? Availability,
        string? Cost);
}
