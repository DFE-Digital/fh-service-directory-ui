using FamilyHubs.ServiceDirectory.Web.Models.Interfaces;
using System.Diagnostics;

namespace FamilyHubs.ServiceDirectory.Web.Models;

public class PostFilter : IPostFilter
{
    private readonly Filter _filter;
    private readonly IFilterAspect[] _selectedFilterAspects;

    public string? Value { get; }

    public PostFilter(Filter filter, IFormCollection form, string? remove)
    {
        _filter = filter;

        //todo: this is radio specific : have PostRadioFilter and PostCheckboxFilter (or check type)
        if (remove?.StartsWith(filter.Name) == true)
        {
#if fall_back_to_default_selection
            // user wants to remove the current radio selection, so we fall back to the initial default selection
            _fullValue = filter.Aspects.FirstOrDefault(a => a.Selected)?.Id;
#endif
            // user wants to remove the current radio selection, so we don't select any radio option
            Value = null;
            _selectedFilterAspects = Array.Empty<IFilterAspect>();
        }
        else
        {
            string? fullValue = form[filter.Name];
            if (fullValue != null)
            {
                //todo: const on filter? 2 is for "--"
                Value = fullValue[(filter.Name.Length + 2)..];
            }
            _selectedFilterAspects = _filter.Aspects.Where(a => a.Id == fullValue).ToArray();
        }
    }

    public string Name => _filter.Name;
    public string Description => _filter.Description;
    public FilterType FilterType => _filter.FilterType;
    public IEnumerable<IFilterAspect> Aspects => _filter.Aspects;
    public IEnumerable<IFilterAspect> SelectedAspects => _selectedFilterAspects;

    public bool IsSelected(IFilterAspect aspect)
    {
        Debug.Assert(aspect.Id.StartsWith(Name));

        return _selectedFilterAspects.Any(a => a.Id == aspect.Id);
    }
}