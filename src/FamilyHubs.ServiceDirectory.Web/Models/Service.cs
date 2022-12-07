
namespace FamilyHubs.ServiceDirectory.Web.Models
{
    public enum ServiceType
    {
        FamilyHub,
        Service
    }

    //todo: type hierarchy, rather than type? or just null what we don't have?
    // 'When/opening hours' will be the same thing, in which case, we can use type to determine the title
    // when / opening hours will show regular schedule only. holiday schedule will be ignored for mvp (probably just show the description field)
    public sealed record Service(
        ServiceType Type,
        string Name,
        //todo: what's actually mandatory?
        double? Distance,
        IEnumerable<string> Cost,
        IEnumerable<string> Where,
        IEnumerable<string> When,
        string? RunBy = null,
        string? AgeRange = null,
        string? Phone = null,
        string? Email = null,
        string? WebsiteName = null,
        string? WebsiteUrl = null);
}
