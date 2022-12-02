
namespace FamilyHubs.ServiceDirectory.Web.Models
{
    //todo: work directly with DTO in page / or map to core dtc and use in page / or map to core, then to viewmodel in page? / or dto to viewmodel
    public enum ServiceType
    {
        FamilyHub,
        Service
    }

    //todo: where should this live?
    public enum LinkType
    {
        Normal,
        Phone,
        Email
    }

    //todo: type hierarchy, rather than type? or just null what we don't have?
    //todo: we don't get supplied a WebsiteName, so we'll have to use Name (or the url itself) for now
    // 'When/opening hours' will be the same thing, in which case, we can use type to determine the title
    // when / opening hours will show regular schedule only. holiday schedule will be ignored for mvp (probably just show the description field)
    public sealed record Service(
        ServiceType Type,
        string Name,
        //todo: what's actually mandatory?
        double? Distance,
        IEnumerable<string> Cost,
        string? RunBy = null,
        string? AgeRange = null,
        string? When = null,
        IEnumerable<string>? Where = null,
        string? Phone = null,
        string? Email = null,
        string? WebsiteName = null,
        string? WebsiteUrl = null
        // Availability has been taken out of MVP
        //string? Availability = null,
        );
}
