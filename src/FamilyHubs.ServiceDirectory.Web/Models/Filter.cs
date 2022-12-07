using System.Diagnostics;
using FamilyHubs.ServiceDirectory.Web.Models.Interfaces;

namespace FamilyHubs.ServiceDirectory.Web.Models;

public enum FilterType
{
    Checkboxes,
    Radios
}

public class Filter : IFilter
{
    public string Name { get; }
    public string Description { get; }
    public FilterType FilterType { get; }
    public IEnumerable<IFilterAspect> Aspects { get; }

    public Filter(string name, string description, FilterType filterType, IEnumerable<IFilterAspect> aspects)
    {
        Name = name;
        Description = description;
        FilterType = filterType;
        Aspects = aspects;
    }

    public PostFilter ToPostFilter(IFormCollection form, string? remove)
    {
        return new PostFilter(this, form, remove);
    }

    public IEnumerable<IFilterAspect> SelectedAspects => Aspects.Where(a => a.SelectedByDefault);

    public bool IsSelected(IFilterAspect aspect)
    {
        Debug.Assert(aspect.Id.StartsWith(Name));

        return aspect.SelectedByDefault;
    }
}