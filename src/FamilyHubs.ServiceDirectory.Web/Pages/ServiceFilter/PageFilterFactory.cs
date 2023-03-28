using FamilyHubs.ServiceDirectory.Core.ServiceDirectory.Interfaces;
using FamilyHubs.ServiceDirectory.Web.Filtering.Filters;
using FamilyHubs.ServiceDirectory.Web.Filtering.Interfaces;

namespace FamilyHubs.ServiceDirectory.Web.Pages.ServiceFilter;

public interface IPageFilterFactory
{
    Task<IEnumerable<IFilter>> GetDefaultFilters();
}

public class PageFilterFactory : IPageFilterFactory
{
    private readonly IServiceDirectoryClient _client;
    private IEnumerable<IFilter>? _filters;

    public PageFilterFactory(IServiceDirectoryClient client)
    {
        _client = client;
    }

    public async Task<IEnumerable<IFilter>> GetDefaultFilters()
    {
        return _filters ??= new IFilter[]
        {
            new CategoryFilter((await _client.GetTaxonomies()).Items),
            new CostFilter(),
            new ShowFilter(),
            new SearchWithinFilter(),
            new ChildrenAndYoungPeopleFilter(),
        };
    }
}