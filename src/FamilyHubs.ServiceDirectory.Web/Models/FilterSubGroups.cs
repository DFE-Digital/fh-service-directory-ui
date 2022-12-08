using FamilyHubs.ServiceDirectory.Web.Models.Interfaces;

namespace FamilyHubs.ServiceDirectory.Web.Models;

public sealed class FilterSubGroups : IFilterSubGroups
{
    public string Name { get; }
    public string Description { get; }
    public IEnumerable<IFilter> SubFilters { get; }
    public IEnumerable<string> Values { get; }

    public FilterSubGroups(string name, string description, IEnumerable<IFilter> subFilters)
    {
        Name = name;
        Description = description;
        SubFilters = subFilters;
        Values = SubFilters.SelectMany(f => f.Values);
    }
}