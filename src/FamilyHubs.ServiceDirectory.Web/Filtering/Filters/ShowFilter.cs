using FamilyHubs.ServiceDirectory.Core.ServiceDirectory.Models;
using FamilyHubs.ServiceDirectory.Web.Filtering.Interfaces;

namespace FamilyHubs.ServiceDirectory.Web.Filtering.Filters;

public class ShowFilter : Filter
{
    public ShowFilter() : base("show", "Show", CheckboxesPartialName, new IFilterAspect[]
    {
        //todo: true.ToString()
        new FilterAspect("true", "Family hubs", "family-hubs"),
        new FilterAspect("false", "Services and groups", "services")
    })
    {
    }

    public override void AddFilterCriteria(IEnumerable<IFilterAspect> selectedAspects, ServicesParams servicesParams)
    {
        switch (selectedAspects.Count())
        {
            case 0:
                servicesParams.MaxFamilyHubs = 1;
                break;
            case 1:
                servicesParams.FamilyHub = bool.Parse(selectedAspects.First().Id);
                break;
            //case 2: there are only 2 options, so if both are selected, there's no need to filter
        }
    }
}