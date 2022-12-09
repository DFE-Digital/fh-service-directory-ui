using FamilyHubs.ServiceDirectory.Web.Filtering.Interfaces;

namespace FamilyHubs.ServiceDirectory.Web.Filtering
{
    //todo: FilterSelect with optional flag as to whether needs checkbox
    public class FilterOptionalSelect : Filter
    {
        public FilterOptionalSelect(string name, string description, IEnumerable<IFilterAspect> aspects)
            : base(name, description, FilterType.Select, aspects)
        {
        }
    }
}
