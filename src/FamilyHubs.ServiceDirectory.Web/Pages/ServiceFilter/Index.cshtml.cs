using System.Diagnostics.CodeAnalysis;
using FamilyHubs.ServiceDirectory.Core.Distance;
using FamilyHubs.ServiceDirectory.Core.ServiceDirectory.Interfaces;
using FamilyHubs.ServiceDirectory.Web.Content;
using FamilyHubs.ServiceDirectory.Web.Filtering.Interfaces;
using FamilyHubs.ServiceDirectory.Web.Mappers;
using FamilyHubs.ServiceDirectory.Web.Models;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace FamilyHubs.ServiceDirectory.Web.Pages.ServiceFilter;

public class ServiceFilterModel : PageModel
{
    public IEnumerable<IFilter> Filters { get; set; }
    //todo: into Filters (above)
    public IFilterSubGroups TypeOfSupportFilter { get; set; }
    public string? Postcode { get; set; }
    public IEnumerable<Service> Services { get; set; }
    public bool OnlyShowOneFamilyHubAndHighlightIt { get; set; }
    public bool IsGet { get; set; }
    public int CurrentPage { get; set; }
    public int MaxPages { get; set; }

    private readonly IServiceDirectoryClient _serviceDirectoryClient;
    private const int PageSize = 10;

    public ServiceFilterModel(IServiceDirectoryClient serviceDirectoryClient)
    {
        _serviceDirectoryClient = serviceDirectoryClient;
        Filters = FilterDefinitions.Filters;
        TypeOfSupportFilter = FilterDefinitions.CategoryFilter;
        Services = Enumerable.Empty<Service>();
        OnlyShowOneFamilyHubAndHighlightIt = false;
        CurrentPage = 1;
    }

    public Task OnGet(string? postcode, string? adminDistrict, float? latitude, float? longitude)
    {
        CheckParameters(postcode, adminDistrict, latitude, longitude);

        return HandleGet(postcode, adminDistrict, latitude.Value, longitude.Value);
    }

    private static void CheckParameters([NotNull] string? postcode, [NotNull] string? adminDistrict, [NotNull] float? latitude, [NotNull] float? longitude)
    {
        // we _could_ degrade gracefully if postcode or lat/long is missing,
        // as we can handle that by not showing the postcode or distances
        // but instead let's fail fast if someone is monkeying with the url (or there's a bug)
        ArgumentException.ThrowIfNullOrEmpty(postcode);
        ArgumentException.ThrowIfNullOrEmpty(adminDistrict);
        ArgumentNullException.ThrowIfNull(latitude);
        ArgumentNullException.ThrowIfNull(longitude);
    }

    private async Task HandleGet(string postcode, string adminDistrict, float latitude, float longitude)
    {
        IsGet = true;
        Postcode = postcode;

        (Services, MaxPages) = await GetServicesAndMaxPages(adminDistrict, latitude, longitude);
    }

    public Task OnPost(string? postcode, string? adminDistrict, float? latitude, float? longitude, string? remove, string? pageNum)
    {
        CheckParameters(postcode, adminDistrict, latitude, longitude);

        return HandlePost(postcode, adminDistrict, latitude.Value, longitude.Value, remove, pageNum);
    }

    private async Task HandlePost(string postcode, string adminDistrict, float latitude, float longitude, string? remove, string? pageNum)
    {
        IsGet = false;

        Postcode = postcode;

        Filters = FilterDefinitions.Filters.Select(fd => fd.ToPostFilter(Request.Form, remove));
        TypeOfSupportFilter = FilterDefinitions.CategoryFilter.ToPostFilter(Request.Form, remove);

        //todo: have page in querystring for bookmarking?
        if (!string.IsNullOrWhiteSpace(pageNum))
            CurrentPage = int.Parse(pageNum);

        (Services, MaxPages) = await GetServicesAndMaxPages(adminDistrict, latitude, longitude);
    }

    private async Task<(IEnumerable<Service>, int)> GetServicesAndMaxPages(string adminDistrict, float latitude, float longitude)
    {
        //todo: add method to filter to add its filter criteria to a request object sent to getservices.., then call in a foreach loop
        int? searchWithinMeters = null;
        var searchWithinFilter = Filters.First(f => f.Name == FilterDefinitions.SearchWithinFilterName);
        var searchWithFilterValue = searchWithinFilter.Values.FirstOrDefault();
        if (searchWithFilterValue != null)
        {
            searchWithinMeters = DistanceConverter.MilesToMeters(int.Parse(searchWithFilterValue));
        }

        bool? isPaidFor = null;
        var costFilter = Filters.First(f => f.Name == FilterDefinitions.CostFilterName);
        if (costFilter.Values.Count() == 1)
        {
            isPaidFor = costFilter.Values.First() == "pay-to-use";
        }

        IEnumerable<string>? showOrganisationType = null;
        var showFilter = Filters.First(f => f.Name == FilterDefinitions.ShowFilterName);
        switch (showFilter.Values.Count())
        {
            case 0:
                OnlyShowOneFamilyHubAndHighlightIt = true;
                break;
            case 1:
                showOrganisationType = showFilter.Values;
                break;
            //case 2: there are only 2 options, so if both are selected, there's no need to filter
        }

        int? givenAge = null;
        var childrenFilter = Filters.First(f => f.Name == FilterDefinitions.ChildrenAndYoungPeopleFilterName);
        var childFilterValue = childrenFilter.Values.FirstOrDefault();
        if (childFilterValue != null && childFilterValue != FilterDefinitions.ChildrenAndYoungPeopleAllId)
        {
            givenAge = int.Parse(childFilterValue);
        }

        // whilst we limit results to a single local authority, we don't actually need to get the organisation for each service
        // we could assume that they all share the same organisation
        // leave it as-is for now though (as we handle the more generic case)

        var services = await _serviceDirectoryClient.GetServicesWithOrganisation(
            adminDistrict,
            latitude,
            longitude,
            searchWithinMeters,
            givenAge,
            isPaidFor,
            OnlyShowOneFamilyHubAndHighlightIt ? 1 : null,
            showOrganisationType,
            TypeOfSupportFilter.Values,
            CurrentPage,
            PageSize);

        return (ServiceMapper.ToViewModel(services.Items), services.TotalPages);
    }
}

public class PaginationItem<T>
{
    public T? Item { get; }

    public PaginationItem(T? item)
    {
        Item = item;
    }

    public bool SkippedPages => Item != null;

    public static IEnumerable<PaginationItem<T>> GetPaginationItemsForLargeSet(IEnumerable<T> items, int currentItem)
    {
        var itemArray = items as T[] ?? items.ToArray();
        return GetPaginationItems(itemArray, 1, currentItem - 1, currentItem, currentItem + 1, itemArray.Length);
    }

    public static IEnumerable<PaginationItem<T>> GetPaginationItems(T[] items, params int[] pages)
    {
        var uniquePageNumbers = new HashSet<int>();
        foreach (int page in pages)
        {
            if (page > 0 && page <= items.Length)
            {
                uniquePageNumbers.Add(page);
            }
        }

        int lastPageNumber = 1;
        foreach (var uniquePage in uniquePageNumbers)
        {
            if (uniquePage > lastPageNumber + 1)
            {
                yield return new PaginationItem<T>(default);
            }
            lastPageNumber = uniquePage;
            yield return new PaginationItem<T>(items[uniquePage]);
        }
    }
}
