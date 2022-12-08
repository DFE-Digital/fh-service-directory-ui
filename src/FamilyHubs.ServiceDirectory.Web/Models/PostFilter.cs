using FamilyHubs.ServiceDirectory.Web.Models.Interfaces;
using System.Diagnostics;

namespace FamilyHubs.ServiceDirectory.Web.Models;
#pragma warning disable

public class PostFilter : IFilter
{
    public IEnumerable<string> Values { get; }

    private readonly Filter _filter;
    private readonly IFilterAspect[] _selectedFilterAspects;

    public PostFilter(Filter filter, IFormCollection form, string? remove)
    {
        _filter = filter;

        Values = Enumerable.Empty<string>();
        _selectedFilterAspects = Array.Empty<IFilterAspect>();

        if (remove?.StartsWith(filter.Name) == true)
        {
#if fall_back_to_default_selection
            // user wants to remove the current radio selection, so we fall back to the initial default selection
            Values = filter.Aspects.Where(a => a.Selected).Select(Id[(filter.Name.Length + 2)..]);
#endif
            // user wants to remove the current radio selection, so we don't select any radio option
            //Values = Enumerable.Empty<string>();
            //_selectedFilterAspects = Array.Empty<IFilterAspect>();
        }
        else
        {
            string? fullValuesCsv = form[filter.Name];
            if (fullValuesCsv != null)
            {
                //todo: const on filter? 2 is for "--"
                //todo: helper for this?
                string[] fullValues = fullValuesCsv.Split(',');
                Values = fullValues.Select(v => v[(filter.Name.Length + 2)..]);
                _selectedFilterAspects = _filter.Aspects.Where(a => fullValues.Contains(a.Id)).ToArray();
            }
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