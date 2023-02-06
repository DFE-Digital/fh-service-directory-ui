using FamilyHubs.ServiceDirectory.Core.ServiceDirectory.Models;

namespace FamilyHubs.ServiceDirectory.Web.Filtering.Interfaces;

public interface IFilterSubGroups
{
    string Name { get; }
    string Description { get; }
    IEnumerable<IFilter> SubFilters { get; }
    public IEnumerable<IFilterAspect> SelectedAspects { get; }
    IFilterSubGroups ToPostFilter(IQueryCollection query);
    void AddFilterCriteria(ServicesParams servicesParams);
    void AddFilterCriteria(IEnumerable<IFilterAspect> selectedAspects, ServicesParams servicesParams);
}