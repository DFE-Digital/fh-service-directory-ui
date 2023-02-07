using FamilyHubs.ServiceDirectory.Core.ServiceDirectory.Models;

namespace FamilyHubs.ServiceDirectory.Web.Filtering.Interfaces;

public interface IFilter
{
    public const string RemoveKey = "remove";
    public const string RemoveAllValue = "all";

    string Name { get; }
    string Description { get; }
    string PartialName => "";
    //todo: remove and have real types
    FilterType FilterType { get; }
    IEnumerable<IFilterAspect> Aspects { get; }
    IEnumerable<IFilterAspect> SelectedAspects { get; }
    bool IsSelected(IFilterAspect aspect);
    IFilter ToPostFilter(IQueryCollection query);

    void AddFilterCriteria(ServicesParams servicesParams);
    void AddFilterCriteria(IEnumerable<IFilterAspect> selectedAspects, ServicesParams servicesParams);
}