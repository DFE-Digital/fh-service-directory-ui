using FamilyHubs.ServiceDirectory.Core.ServiceDirectory.Models;
using FamilyHubs.ServiceDirectory.Web.Filtering.Interfaces;

namespace FamilyHubs.ServiceDirectory.Web.Filtering;

public class SubFilter : Filter
{
    public SubFilter(string name, string description, IEnumerable<IFilterAspect> aspects)
        : base(name, description, CheckboxesPartialName, aspects)
    {
    }

    public override void AddFilterCriteria(IEnumerable<IFilterAspect> selectedAspects, ServicesParams servicesParams)
    {
        // handled by FilterSubGroups
        throw new NotImplementedException();
    }
}