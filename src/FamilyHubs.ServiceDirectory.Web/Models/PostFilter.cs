using FamilyHubs.ServiceDirectory.Web.Models.Interfaces;
using System.Diagnostics;

namespace FamilyHubs.ServiceDirectory.Web.Models;

public class PostFilter : IFilter
{
    public string Name => _filter.Name;
    public string Description => _filter.Description;
    public FilterType FilterType => _filter.FilterType;
    public IEnumerable<IFilterAspect> Aspects => _filter.Aspects;
    public IEnumerable<IFilterAspect> SelectedAspects => _selectedFilterAspects;
    public IEnumerable<string> Values { get; }

    private readonly IFilter _filter;
    private readonly IFilterAspect[] _selectedFilterAspects;

    public PostFilter(IFilter filter, IFormCollection form, string? remove)
    {
        _filter = filter;

        Values = Enumerable.Empty<string>();
        _selectedFilterAspects = Array.Empty<IFilterAspect>();

        if (remove?.StartsWith(filter.Name) != false)
            return;

        string? fullValuesCsv = form[filter.Name];
        if (fullValuesCsv != null)
        {
            //todo: const on filter? 2 is for "--", or just store full values?
            //todo: helper for this?
            string[] fullValues = fullValuesCsv.Split(',');
            Values = fullValues.Select(v => v[(filter.Name.Length + 2)..]);
            _selectedFilterAspects = _filter.Aspects.Where(a => fullValues.Contains(a.Id)).ToArray();
        }
    }

    public bool IsSelected(IFilterAspect aspect)
    {
        Debug.Assert(aspect.Id.StartsWith(Name));

        return _selectedFilterAspects.Any(a => a.Id == aspect.Id);
    }
}