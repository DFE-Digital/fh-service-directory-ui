using FamilyHubs.ServiceDirectory.Web.Filtering.Interfaces;
using System.Diagnostics;
using FamilyHubs.ServiceDirectory.Core.ServiceDirectory.Models;

namespace FamilyHubs.ServiceDirectory.Web.Filtering;

public class AppliedFilter : IFilter
{
    public string Name => Filter.Name;
    public string Description => Filter.Description;
    public string PartialName => Filter.PartialName;
    public IEnumerable<IFilterAspect> Aspects => Filter.Aspects;
    public IEnumerable<IFilterAspect> SelectedAspects { get; protected set; }

    protected readonly IFilter Filter;

    public AppliedFilter(IFilter filter, IQueryCollection query)
    {
        Filter = filter;

        string? fullValuesCsv = query[filter.Name];
        if (fullValuesCsv != null)
        {
            string[] fullValues = fullValuesCsv.Split(',');

            SelectedAspects = Filter.Aspects.Where(a => fullValues.Contains(a.Value)).ToArray();
        }
        else
        {
            SelectedAspects = Array.Empty<IFilterAspect>();
        }
    }

    public bool IsSelected(IFilterAspect aspect)
    {
        return SelectedAspects.Any(a => a.Id == aspect.Id);
    }

    public IFilter Apply(IQueryCollection query)
    {
        Debug.Assert(false, "Calling Apply() on an AppliedFilter");
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