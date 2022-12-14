using FamilyHubs.ServiceDirectory.Web.Filtering.Interfaces;
using System.Diagnostics;

namespace FamilyHubs.ServiceDirectory.Web.Filtering;

//todo: can it also implement IFilter?
public class PostFilterSubGroups : IFilterSubGroups
{
    public string Name => _filterSubGroups.Name;
    public string Description => _filterSubGroups.Description;
    public IEnumerable<IFilter> SubFilters { get; }
    public IEnumerable<IFilterAspect> SelectedAspects { get; }
    public IEnumerable<string> Values { get; }

    private readonly FilterSubGroups _filterSubGroups;

    public PostFilterSubGroups(FilterSubGroups filterSubGroups, IFormCollection form, string? remove)
    {
        _filterSubGroups = filterSubGroups;

        SubFilters = filterSubGroups.SubFilters.Select(f => new PostFilter(f, form, remove)).ToArray();
        Values = SubFilters.SelectMany(f => f.Values);
        SelectedAspects = SubFilters.SelectMany(f => f.SelectedAspects);
    }

    public IFilterSubGroups ToPostFilter(IFormCollection form, string? remove)
    {
        Debug.Assert(false, "Calling ToPostFilter() on a PostFilter");
        return this;
    }
}