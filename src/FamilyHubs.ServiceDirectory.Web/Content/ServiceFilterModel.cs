using FamilyHubs.ServiceDirectory.Web.Filtering;
using FamilyHubs.ServiceDirectory.Web.Filtering.Filters;
using FamilyHubs.ServiceDirectory.Web.Filtering.Interfaces;

namespace FamilyHubs.ServiceDirectory.Web.Content;

public static class FilterDefinitions
{
    public static readonly FilterSubGroups CategoryFilter = new CategoryFilter();

    //todo: move to index cshtml once done
    public static readonly IEnumerable<IFilter> Filters = new IFilter[]
    {
        new CostFilter(),
        new ShowFilter(),
        new SearchWithinFilter(),
        new ChildrenAndYoungPeopleFilter()
    };
}
