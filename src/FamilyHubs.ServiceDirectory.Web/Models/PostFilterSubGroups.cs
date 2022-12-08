using FamilyHubs.ServiceDirectory.Web.Models.Interfaces;

namespace FamilyHubs.ServiceDirectory.Web.Models;

//todo: can it also implement IFilter? (would have to rename subgroup's name & description)
public class PostFilterSubGroups : IFilterSubGroups
{
    public string Name => _filterSubGroups.Name;
    public string Description => _filterSubGroups.Description;
    public IEnumerable<IFilter> SubFilters { get; }

    private readonly FilterSubGroups _filterSubGroups;
    public IEnumerable<string> Values { get; }

    public PostFilterSubGroups(FilterSubGroups filterSubGroups, IFormCollection form, string? remove)
    {
        _filterSubGroups = filterSubGroups;

        SubFilters = filterSubGroups.SubFilters.Select(f => new PostFilter(f, form, remove));
        Values = SubFilters.SelectMany(f => f.Values);
    }
}