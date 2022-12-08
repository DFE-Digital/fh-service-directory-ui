namespace FamilyHubs.ServiceDirectory.Web.Models.Interfaces;

public interface IFilterSubGroups
{
    string Name { get; }
    string Description { get; }
    IEnumerable<IFilter> SubFilters { get; }
}