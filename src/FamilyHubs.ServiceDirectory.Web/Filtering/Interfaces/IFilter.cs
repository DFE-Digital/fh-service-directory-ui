namespace FamilyHubs.ServiceDirectory.Web.Filtering.Interfaces;

public interface IFilter
{
    public const string RemoveAll = "all";

    string Name { get; }
    string Description { get; }
    FilterType FilterType { get; }
    IEnumerable<IFilterAspect> Aspects { get; }
    IEnumerable<IFilterAspect> SelectedAspects { get; }
    bool IsSelected(IFilterAspect aspect);
    IEnumerable<string> Values { get; }
    IFilter ToPostFilter(IQueryCollection query);
}