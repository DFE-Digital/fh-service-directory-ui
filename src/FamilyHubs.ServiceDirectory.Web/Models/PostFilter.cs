using FamilyHubs.ServiceDirectory.Web.Models.Interfaces;

namespace FamilyHubs.ServiceDirectory.Web.Models;

// composition or inheritance?
//todo: starting to look like inheritance would be better (despite prefer composition)
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
            // user wants to remove the current radio selection, so we fall back to the initial default selection
#if fall_back_to_default_selection
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