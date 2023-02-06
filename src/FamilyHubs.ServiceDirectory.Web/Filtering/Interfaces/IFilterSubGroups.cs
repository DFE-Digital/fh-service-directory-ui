namespace FamilyHubs.ServiceDirectory.Web.Filtering.Interfaces;

public interface IFilterSubGroups
{
    string Name { get; }
    string Description { get; }
    IEnumerable<IFilter> SubFilters { get; }
    public IEnumerable<IFilterAspect> SelectedAspects { get; }
    IFilterSubGroups ToPostFilter(IQueryCollection query);
}