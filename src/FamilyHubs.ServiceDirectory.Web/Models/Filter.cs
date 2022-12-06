using System.Diagnostics;
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
    bool IsSelected(IFilterAspect aspect);
}

#pragma warning disable
//public record Filter(string Name, string Description, FilterType FilterType, IEnumerable<IFilterAspect> Aspects) : IFilter;

// composition or inheritance?
//todo: starting to look like inheritance would be better (despite prefer composition)
public class PostFilter : IFilter
{
    private readonly Filter _filter;
    private static string? _fullValue;
    private IFilterAspect[] _selectedFilterAspects;

    public string? Value { get; }

    public PostFilter(Filter filter, IFormCollection form, string? remove)
    {
        _filter = filter;

        //todo: this is radio specific : have PostRadioFilter and PostCheckboxFilter (or check type)
        if (remove?.StartsWith(filter.Name) == true)
        {
            // user wants to remove the current radio selection, so we fall back to the initial default selection
            //_fullValue = filter.Aspects.FirstOrDefault(a => a.Selected)?.Id;
            // user wants to remove the current radio selection, so we don't select any radio option
            _fullValue = null;
            Value = null;
            _selectedFilterAspects = Array.Empty<IFilterAspect>();
        }
        else
        {
            _fullValue = form[filter.Name];
            if (_fullValue != null)
            {
                //todo: const on filter? 2 is for "--"
                Value = _fullValue[(filter.Name.Length + 2)..];
            }
            _selectedFilterAspects = _filter.Aspects.Where(a => a.Id == _fullValue).ToArray();
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

    //todo: to get only property
    public IEnumerable<IFilterAspect> SelectedAspects()
    {
        return _selectedFilterAspects;
    }

    public bool IsSelected(IFilterAspect aspect)
    {
        return _selectedFilterAspects.Any(a => a.Id == aspect.Id);
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

    public bool IsSelected(IFilterAspect aspect)
    {
        //todo: or exception?
        Debug.Assert(aspect.Id.StartsWith(Name));

        return aspect.Selected;
    }
}