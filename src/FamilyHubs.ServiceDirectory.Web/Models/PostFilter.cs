using FamilyHubs.ServiceDirectory.Web.Models.Interfaces;
using System.Diagnostics;

namespace FamilyHubs.ServiceDirectory.Web.Models;

//todo: check for invalid chars in postcode search before sending to api
//todo: when both services and family hubs are selected, don't show box

public class PostFilter : IFilter
{
    public const string RemoveAll = "all";
    public string Name => _filter.Name;
    public string Description => _filter.Description;
    public FilterType FilterType => _filter.FilterType;
    public IEnumerable<IFilterAspect> Aspects => _filter.Aspects;
    public IEnumerable<IFilterAspect> SelectedAspects { get; }
    public IEnumerable<string> Values { get; }

    private readonly IFilter _filter;

    public PostFilter(IFilter filter, IFormCollection form, string? remove)
    {
        _filter = filter;

        Values = Enumerable.Empty<string>();
        SelectedAspects = Array.Empty<IFilterAspect>();

        if (remove != null && remove == RemoveAll)
            return;

        string? fullValuesCsv = form[filter.Name];
        if (fullValuesCsv != null)
        {
            //todo: const on filter? 2 is for "--", or just store full values?
            //todo: helper for this?
            string[] fullValues = fullValuesCsv.Split(',');

            if (remove?.StartsWith(filter.Name) == true)
            {
                fullValues = fullValues
                    .Where(v => v != remove)
                    .ToArray();
            }
            Values = fullValues.Select(v => v[(filter.Name.Length + 2)..]);
            SelectedAspects = _filter.Aspects.Where(a => fullValues.Contains(a.Id)).ToArray();
        }
    }

    public bool IsSelected(IFilterAspect aspect)
    {
        Debug.Assert(aspect.Id.StartsWith(Name));

        return SelectedAspects.Any(a => a.Id == aspect.Id);
    }
}