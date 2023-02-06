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

    private readonly FilterSubGroups _filterSubGroups;

    public PostFilterSubGroups(FilterSubGroups filterSubGroups, IQueryCollection query)
    {
        _filterSubGroups = filterSubGroups;

        SubFilters = filterSubGroups.SubFilters.Select(f => new PostFilter(f, query)).ToArray();
        SelectedAspects = SubFilters.SelectMany(f => f.SelectedAspects);
    }

    public IFilterSubGroups ToPostFilter(IQueryCollection query)
    {
        Debug.Assert(false, "Calling ToPostFilter() on a PostFilter");
        return this;
    }
}