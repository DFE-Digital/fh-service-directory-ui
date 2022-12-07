namespace FamilyHubs.ServiceDirectory.Web.Models.Interfaces;

public interface IFilter
{
    public string Name { get; }
    public string Description { get; }
    public FilterType FilterType { get; }
    public IEnumerable<IFilterAspect> Aspects { get; }
    IEnumerable<IFilterAspect> SelectedAspects();
    bool IsSelected(IFilterAspect aspect);
}