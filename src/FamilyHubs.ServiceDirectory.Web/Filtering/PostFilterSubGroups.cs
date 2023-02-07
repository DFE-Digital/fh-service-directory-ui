using FamilyHubs.ServiceDirectory.Core.ServiceDirectory.Models;
using FamilyHubs.ServiceDirectory.Web.Filtering.Interfaces;
using System.Diagnostics;

namespace FamilyHubs.ServiceDirectory.Web.Filtering;

public class PostFilterSubGroups : IFilterSubGroups
{
    public string Name => _filterSubGroups.Name;
    public string Description => _filterSubGroups.Description;
    public string PartialName => _filterSubGroups.PartialName;
    public IEnumerable<IFilter> SubFilters { get; }
    //todo: not used remove from filter, or throw not implemented, or implement
    public IEnumerable<IFilterAspect> Aspects => throw new NotImplementedException();
    public IEnumerable<IFilterAspect> SelectedAspects { get; }
    //todo: going
    public FilterType FilterType => FilterType.SubGroups;

    private readonly FilterSubGroups _filterSubGroups;

    public PostFilterSubGroups(FilterSubGroups filterSubGroups, IQueryCollection query)
    {
        _filterSubGroups = filterSubGroups;

        SubFilters = filterSubGroups.SubFilters.Select(f => new PostFilter(f, query)).ToArray();
        SelectedAspects = SubFilters.SelectMany(f => f.SelectedAspects);
    }

    //todo: covariance
    //    public IFilterSubGroups ToPostFilter(IQueryCollection query)
    public IFilter ToPostFilter(IQueryCollection query)
    {
        Debug.Assert(false, "Calling ToPostFilter() on a PostFilter");
        return this;
    }

    public virtual void AddFilterCriteria(ServicesParams servicesParams)
    {
        _filterSubGroups.AddFilterCriteria(SelectedAspects, servicesParams);
    }

    public void AddFilterCriteria(IEnumerable<IFilterAspect> selectedAspects, ServicesParams servicesParams)
    {
        // or this?
        //throw new NotImplementedException();
        _filterSubGroups.AddFilterCriteria(selectedAspects, servicesParams);
    }

    //todo: throw not implemented, or implement
    public bool IsSelected(IFilterAspect aspect)
    {
        throw new NotImplementedException();
    }
}