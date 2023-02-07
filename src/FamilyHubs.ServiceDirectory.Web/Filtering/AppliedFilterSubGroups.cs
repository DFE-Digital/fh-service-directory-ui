using FamilyHubs.ServiceDirectory.Core.ServiceDirectory.Models;
using FamilyHubs.ServiceDirectory.Web.Filtering.Interfaces;
using System.Diagnostics;

namespace FamilyHubs.ServiceDirectory.Web.Filtering;

public class AppliedFilterSubGroups : IFilterSubGroups
{
    public string Name => _filterSubGroups.Name;
    public string Description => _filterSubGroups.Description;
    public string PartialName => _filterSubGroups.PartialName;
    public IEnumerable<IFilter> SubFilters { get; }
    // makes sense, but no current consumers
    public IEnumerable<IFilterAspect> Aspects => throw new NotImplementedException();
    public IEnumerable<IFilterAspect> SelectedAspects { get; }

    private readonly FilterSubGroups _filterSubGroups;

    public AppliedFilterSubGroups(FilterSubGroups filterSubGroups, IQueryCollection query)
    {
        _filterSubGroups = filterSubGroups;

        SubFilters = filterSubGroups.SubFilters.Select(f => new AppliedFilter(f, query)).ToArray();
        SelectedAspects = SubFilters.SelectMany(f => f.SelectedAspects);
    }

    //todo: covariance
    //    public IFilterSubGroups Apply(IQueryCollection query)
    public IFilter Apply(IQueryCollection query)
    {
        Debug.Assert(false, "Calling Apply() on a AppliedFilter");
        return this;
    }

    public virtual void AddFilterCriteria(ServicesParams servicesParams)
    {
        _filterSubGroups.AddFilterCriteria(SelectedAspects, servicesParams);
    }

    public void AddFilterCriteria(IEnumerable<IFilterAspect> selectedAspects, ServicesParams servicesParams)
    {
        _filterSubGroups.AddFilterCriteria(selectedAspects, servicesParams);
    }

    // makes sense, but no current consumers
    public bool IsSelected(IFilterAspect aspect)
    {
        throw new NotImplementedException();
    }
}