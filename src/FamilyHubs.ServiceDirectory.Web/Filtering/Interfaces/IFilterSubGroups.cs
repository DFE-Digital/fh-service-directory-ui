
namespace FamilyHubs.ServiceDirectory.Web.Filtering.Interfaces;

public interface IFilterSubGroups : IFilter
{
    IEnumerable<IFilter> SubFilters { get; }
}