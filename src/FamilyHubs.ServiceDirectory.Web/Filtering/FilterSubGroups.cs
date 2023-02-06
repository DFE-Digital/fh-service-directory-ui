using FamilyHubs.ServiceDirectory.Core.ServiceDirectory.Models;
using FamilyHubs.ServiceDirectory.Web.Filtering.Interfaces;

namespace FamilyHubs.ServiceDirectory.Web.Filtering;

public abstract class FilterSubGroups : IFilterSubGroups
{
    public string Name { get; }
    public string Description { get; }
    public IEnumerable<IFilter> SubFilters { get; }
    public IEnumerable<IFilterAspect> SelectedAspects { get; }

    protected FilterSubGroups(string name, string description, IEnumerable<IFilter> subFilters)
    {
        Name = name;
        Description = description;
        SubFilters = subFilters as IFilter[] ?? subFilters.ToArray();
        SelectedAspects = SubFilters.SelectMany(f => f.SelectedAspects);
    }

    public IFilterSubGroups ToPostFilter(IQueryCollection query)
    {
        return new PostFilterSubGroups(this, query);
    }

    public void AddFilterCriteria(ServicesParams servicesParams)
    {
        AddFilterCriteria(SelectedAspects, servicesParams);
    }

    public abstract void AddFilterCriteria(IEnumerable<IFilterAspect> selectedAspects, ServicesParams servicesParams);
}