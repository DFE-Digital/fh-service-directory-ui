using FamilyHubs.ServiceDirectory.Web.Filtering.Interfaces;
using System.Diagnostics;

namespace FamilyHubs.ServiceDirectory.Web.Filtering;

public class PostFilter : IFilter
{
    public string Name => Filter.Name;
    public string Description => Filter.Description;
    public FilterType FilterType => Filter.FilterType;
    public IEnumerable<IFilterAspect> Aspects => Filter.Aspects;
    public IEnumerable<IFilterAspect> SelectedAspects { get; }
    public IEnumerable<string> Values { get; }

    protected readonly IFilter Filter;

    public PostFilter(IFilter filter, IFormCollection form, string? remove)
    {
        Filter = filter;

        Values = Enumerable.Empty<string>();
        SelectedAspects = Array.Empty<IFilterAspect>();

        if (remove != null && remove == IFilter.RemoveAll)
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
            SelectedAspects = Filter.Aspects.Where(a => fullValues.Contains(a.Id)).ToArray();
        }
    }

    public bool IsSelected(IFilterAspect aspect)
    {
        Debug.Assert(aspect.Id.StartsWith(Name));

        return SelectedAspects.Any(a => a.Id == aspect.Id);
    }

    public IFilter ToPostFilter(IFormCollection form, string? remove)
    {
        Debug.Assert(false, "Calling ToPostFilter() on a PostFilter");
        return this;
    }
}