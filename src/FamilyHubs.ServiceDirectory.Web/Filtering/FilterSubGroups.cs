using FamilyHubs.ServiceDirectory.Core.ServiceDirectory.Models;
using FamilyHubs.ServiceDirectory.Web.Filtering.Interfaces;

namespace FamilyHubs.ServiceDirectory.Web.Filtering;

public abstract class FilterSubGroups : IFilterSubGroups
{
    public string Name { get; }
    public string Description { get; }
    public IEnumerable<IFilter> SubFilters { get; }
    //todo: not used remove from filter, or throw not implemented, or implement
    public IEnumerable<IFilterAspect> Aspects => throw new NotImplementedException();
    public IEnumerable<IFilterAspect> SelectedAspects { get; }
    //todo: going
    public FilterType FilterType => FilterType.SubGroups;

    protected FilterSubGroups(string name, string description, IEnumerable<IFilter> subFilters)
    {
        Name = name;
        Description = description;
        SubFilters = subFilters as IFilter[] ?? subFilters.ToArray();
        SelectedAspects = SubFilters.SelectMany(f => f.SelectedAspects);
    }

    //todo: covariance
    //    public IFilterSubGroups ToPostFilter(IQueryCollection query)
    public IFilter ToPostFilter(IQueryCollection query)
    {
        return new PostFilterSubGroups(this, query);
    }

    public void AddFilterCriteria(ServicesParams servicesParams)
    {
        AddFilterCriteria(SelectedAspects, servicesParams);
    }

    public abstract void AddFilterCriteria(IEnumerable<IFilterAspect> selectedAspects, ServicesParams servicesParams);

    //todo: throw not implemented, or implement
    public bool IsSelected(IFilterAspect aspect)
    {
        throw new NotImplementedException();
    }
}