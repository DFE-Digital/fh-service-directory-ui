
namespace FamilyHubs.ServiceDirectory.Web.Models
{
    //todo: work directly with DTO in page / or map to core dtc and use in page / or map to core, then to viewmodel in page? / or dto to viewmodel
    public enum ServiceType
    {
        FamilyHub,
        Service
    }

    //todo: type hierarchy, rather than type? or just null what we don't have?
    //todo: we don't get supplied a WebsiteName, so we'll have to use Name for now
    // Availability has been taken out of MVP
    // 'When/opening hours' may be the same thing, in which case, we can use type to determine the title
    //todo: when / opening hours => how to display normal/holiday hours
    public sealed record Service(
        ServiceType Type,
        string Name,
        //todo: number instead?
        //todo: what's actually mandatory?
        string? Distance = null,
        string? RunBy = null,
        string? AgeRange = null,
        string? When = null,
        IEnumerable<string>? Where = null,
        string? Phone = null,
        string? Email = null,
        string? WebsiteName = null,
        string? WebsiteUrl = null,
        string? Availability = null,
        string? Cost = null);
}
