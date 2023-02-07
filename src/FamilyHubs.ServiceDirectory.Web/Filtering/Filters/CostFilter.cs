using FamilyHubs.ServiceDirectory.Core.ServiceDirectory.Models;
using FamilyHubs.ServiceDirectory.Web.Filtering.Interfaces;

namespace FamilyHubs.ServiceDirectory.Web.Filtering.Filters;

public class CostFilter : Filter
{
    private const string PayToUseId = "pay-to-use";
    
    public CostFilter() : base("cost", "Cost", CheckboxesPartialName, new IFilterAspect[]
    {
        new FilterAspect("free", "Free"),
        new FilterAspect(PayToUseId, "Pay to ue")
    })
    {
    }

    public override void AddFilterCriteria(IEnumerable<IFilterAspect> selectedAspects, ServicesParams servicesParams)
    {
        if (selectedAspects.Count() == 1)
        {
            servicesParams.IsPaidFor = selectedAspects.First().Id == PayToUseId;
        }
    }
}