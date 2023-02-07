using FamilyHubs.ServiceDirectory.Web.Filtering.Interfaces;
using System.Diagnostics;
using FamilyHubs.ServiceDirectory.Core.ServiceDirectory.Models;

namespace FamilyHubs.ServiceDirectory.Web.Filtering;

public class PostFilter : IFilter
{
    public string Name => Filter.Name;
    public string Description => Filter.Description;
    public string PartialName => Filter.PartialName;
    public FilterType FilterType => Filter.FilterType;
    public IEnumerable<IFilterAspect> Aspects => Filter.Aspects;
    public IEnumerable<IFilterAspect> SelectedAspects { get; protected set; }

    protected readonly IFilter Filter;

    public PostFilter(IFilter filter, IQueryCollection query)
    {
        Filter = filter;

        SelectedAspects = Array.Empty<IFilterAspect>();

        //todo: work directly with StringValues
        string? fullValuesCsv = query[filter.Name];
        if (fullValuesCsv != null)
        {
            string[] fullValues = fullValuesCsv.Split(',');

            SelectedAspects = Filter.Aspects.Where(a => fullValues.Contains(a.Value)).ToArray();
        }
    }

    public bool IsSelected(IFilterAspect aspect)
    {
        return SelectedAspects.Any(a => a.Id == aspect.Id);
    }

    public IFilter ToPostFilter(IQueryCollection query)
    {
        Debug.Assert(false, "Calling ToPostFilter() on a PostFilter");
        return this;
    }

    public void AddFilterCriteria(ServicesParams servicesParams)
    {
        Filter.AddFilterCriteria(SelectedAspects, servicesParams);
    }

    public void AddFilterCriteria(IEnumerable<IFilterAspect> selectedAspects, ServicesParams servicesParams)
    {
        Filter.AddFilterCriteria(selectedAspects, servicesParams);
    }
}