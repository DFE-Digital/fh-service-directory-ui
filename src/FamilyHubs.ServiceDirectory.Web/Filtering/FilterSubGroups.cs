using FamilyHubs.ServiceDirectory.Web.Filtering.Interfaces;

namespace FamilyHubs.ServiceDirectory.Web.Filtering;

public sealed class FilterSubGroups : IFilterSubGroups
{
    public string Name { get; }
    public string Description { get; }
    public IEnumerable<IFilter> SubFilters { get; }
    public IEnumerable<IFilterAspect> SelectedAspects { get; }
    public IEnumerable<string> Values { get; }

    public FilterSubGroups(string name, string description, IEnumerable<IFilter> subFilters)
    {
        Name = name;
        Description = description;
        SubFilters = subFilters as IFilter[] ?? subFilters.ToArray();
        Values = SubFilters.SelectMany(f => f.Values);
        SelectedAspects = SubFilters.SelectMany(f => f.SelectedAspects);
    }

    public IFilterSubGroups ToPostFilter(IQueryCollection query)
    {
        return new PostFilterSubGroups(this, query);
    }
}