using FamilyHubs.ServiceDirectory.Web.Filtering.Interfaces;

namespace FamilyHubs.ServiceDirectory.Web.Filtering;

public class Filter : IFilter
{
    public string Name { get; }
    public string Description { get; }
    public FilterType FilterType { get; }
    public IEnumerable<IFilterAspect> Aspects { get; }
    public IEnumerable<string> Values { get; }

    private readonly IFilterAspect[] _selectedFilterAspects;

    public Filter(string name, string description, FilterType filterType, IEnumerable<IFilterAspect> aspects)
    {
        Name = name;
        Description = description;
        FilterType = filterType;
        Aspects = aspects;

        _selectedFilterAspects = Aspects.Where(a => a.SelectedByDefault).ToArray();

        Values = _selectedFilterAspects.Select(a => a.Id);
    }

    public virtual IFilter ToPostFilter(IQueryCollection query)
    {
        return new PostFilter(this, query);
    }

    public IEnumerable<IFilterAspect> SelectedAspects => _selectedFilterAspects;

    public bool IsSelected(IFilterAspect aspect)
    {
        return aspect.SelectedByDefault;
    }
}