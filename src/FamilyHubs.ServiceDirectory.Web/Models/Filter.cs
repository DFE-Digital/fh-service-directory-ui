using System.Diagnostics;
using FamilyHubs.ServiceDirectory.Web.Models.Interfaces;

namespace FamilyHubs.ServiceDirectory.Web.Models;

public enum FilterType
{
    Checkboxes,
    Radios
}

#pragma warning disable
//public record Filter(string Name, string Description, FilterType FilterType, IEnumerable<IFilterAspect> Aspects) : IFilter;

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

    //todo: property
    //todo: can we use this instead of PostFilter aspect implementation?
    public IEnumerable<IFilterAspect> SelectedAspects()
    {
        return Aspects.Where(a => a.SelectedByDefault);
    }

    public bool IsSelected(IFilterAspect aspect)
    {
        //todo: or exception?
        Debug.Assert(aspect.Id.StartsWith(Name));

        return aspect.SelectedByDefault;
    }
}