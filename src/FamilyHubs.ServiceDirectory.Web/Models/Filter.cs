using FamilyHubs.ServiceDirectory.Web.Models.Interfaces;

namespace FamilyHubs.ServiceDirectory.Web.Models;

public enum FilterType
{
    Checkboxes,
    Radios
}
public interface IFilter
{
    public string Name { get; }
    public string Description { get; }
    public FilterType FilterType { get; }
    public IEnumerable<IFilterAspect> Aspects { get; }
    IEnumerable<IFilterAspect> SelectedAspects();
}

#pragma warning disable
//public record Filter(string Name, string Description, FilterType FilterType, IEnumerable<IFilterAspect> Aspects) : IFilter;

// composition or inheritance?
public class PostFilter : IFilter
{
    private readonly Filter _filter;
    private static string? _fullValue;

    public string? Value { get; }

    public PostFilter(Filter filter, IFormCollection form, string? remove)
    {
        _filter = filter;

        _fullValue = form[filter.Name];
        if (_fullValue != null)
        {
            //todo: const on filter? 2 is for "--"
            Value = _fullValue.Substring(filter.Name.Length + 2);
        }
    }

    public string Name => _filter.Name;
    public string Description => _filter.Description;
    public FilterType FilterType => _filter.FilterType;
    public IEnumerable<IFilterAspect> Aspects
    {
        get
        {
            //return _filter.Aspects.Select(a => new FilterAspect(a.Id, a.Description, a.Id == _fullValue)).ToArray();
            return _filter.Aspects;
        }
    }

    public IEnumerable<IFilterAspect> SelectedAspects()
    {
        return _filter.Aspects.Where(a => a.Id == _fullValue).ToArray();
    }
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

    //todo: property
    //todo: can we use this instead of PostFilter aspect implementation?
    public IEnumerable<IFilterAspect> SelectedAspects()
    {
        return Aspects.Where(a => a.Selected);
    }
}