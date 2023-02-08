using FamilyHubs.ServiceDirectory.Core.ServiceDirectory.Models;
using FamilyHubs.ServiceDirectory.Web.Filtering.Interfaces;

namespace FamilyHubs.ServiceDirectory.Web.Filtering;

public abstract class FilterSubGroups : IFilterSubGroups
{
    public string Name { get; }
    public string Description { get; }
    public string PartialName => "_SubGroups";
    public IEnumerable<IFilter> SubFilters { get; }
    public IEnumerable<IFilterAspect> Aspects { get; }
    public IEnumerable<IFilterAspect> SelectedAspects { get; }

    protected FilterSubGroups(string name, string description, IEnumerable<IFilter> subFilters)
    {
        Name = name;
        Description = description;
        SubFilters = subFilters as IFilter[] ?? subFilters.ToArray();
        Aspects = SubFilters.SelectMany(f => f.Aspects);
        SelectedAspects = SubFilters.SelectMany(f => f.SelectedAspects);
    }

    //todo: covariance
    //    public IFilterSubGroups Apply(IQueryCollection query)
    public IFilter Apply(IQueryCollection query)
    {
        return new AppliedFilterSubGroups(this, query);
    }

    public void AddFilterCriteria(ServicesParams servicesParams)
    {
        AddFilterCriteria(SelectedAspects, servicesParams);
    }

    public abstract void AddFilterCriteria(IEnumerable<IFilterAspect> selectedAspects, ServicesParams servicesParams);

    // makes sense, but no current consumers
    public bool IsSelected(IFilterAspect aspect)
    {
        throw new NotImplementedException();
    }
}