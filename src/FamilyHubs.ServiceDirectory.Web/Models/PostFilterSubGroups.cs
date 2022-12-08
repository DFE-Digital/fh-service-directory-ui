using FamilyHubs.ServiceDirectory.Web.Models.Interfaces;

namespace FamilyHubs.ServiceDirectory.Web.Models;

public interface IFilterSubGroups
{
    string Name { get; }
    string Description { get; }
    IEnumerable<IFilter> SubFilters { get; }
}

public class PostFilterSubGroups : IFilterSubGroups
{
    private readonly FilterSubGroups _filterSubGroups;

    public PostFilterSubGroups(FilterSubGroups filterSubGroups)
    {
        _filterSubGroups = filterSubGroups;
    }

    public string Name => _filterSubGroups.Name;
    public string Description => _filterSubGroups.Description;
    public IEnumerable<IFilter> SubFilters => _filterSubGroups.SubFilters;
}