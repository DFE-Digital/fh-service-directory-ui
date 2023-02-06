using FamilyHubs.ServiceDirectory.Core.Distance;
using FamilyHubs.ServiceDirectory.Core.ServiceDirectory.Models;
using FamilyHubs.ServiceDirectory.Web.Filtering.Interfaces;

namespace FamilyHubs.ServiceDirectory.Web.Filtering.Filters;

public class SearchWithinFilter : Filter
{
    public SearchWithinFilter() : base("search_within", "Search within", FilterType.Radios, new IFilterAspect[]
    {
        new FilterAspect("1", "1 mile"),
        new FilterAspect("2", "2 miles"),
        new FilterAspect("5", "5 miles"),
        new FilterAspect("10", "10 miles"),
        new FilterAspect("20", "20 miles", SelectedByDefault: true)
    })
    {
    }

    public override void AddFilterCriteria(IEnumerable<IFilterAspect> selectedAspects, ServicesParams servicesParams)
    {
        var filterAspect = selectedAspects.FirstOrDefault();
        if (filterAspect != null)
        {
            servicesParams.MaximumProximityMeters = DistanceConverter.MilesToMeters(int.Parse(filterAspect.Id));
        }
    }
}