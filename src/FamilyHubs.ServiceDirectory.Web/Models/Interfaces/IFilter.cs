namespace FamilyHubs.ServiceDirectory.Web.Models.Interfaces;

public interface IFilter
{
    string Name { get; }
    string Description { get; }
    FilterType FilterType { get; }
    IEnumerable<IFilterAspect> Aspects { get; }
    IEnumerable<IFilterAspect> SelectedAspects { get; }
    bool IsSelected(IFilterAspect aspect);
    public IEnumerable<string> Values { get; }
}