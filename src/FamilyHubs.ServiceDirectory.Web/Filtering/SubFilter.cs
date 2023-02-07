using FamilyHubs.ServiceDirectory.Core.ServiceDirectory.Models;
using FamilyHubs.ServiceDirectory.Web.Filtering.Interfaces;

namespace FamilyHubs.ServiceDirectory.Web.Filtering;

//todo: best way. individual filters for sub filters, rather than this, or something else?
public class SubFilter : Filter
{
    public SubFilter(string name, string description, FilterType filterType, IEnumerable<IFilterAspect> aspects)
        : base(name, description, "_Checkboxes", filterType, aspects)
    {
    }

    public override void AddFilterCriteria(IEnumerable<IFilterAspect> selectedAspects, ServicesParams servicesParams)
    {
        // handled by FilterSubGroups
        throw new NotImplementedException();
    }
}