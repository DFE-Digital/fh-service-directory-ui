using FamilyHubs.ServiceDirectory.Web.Models;
using System.Diagnostics;
using System.Globalization;
using FamilyHubs.ServiceDirectory.Core.Distance;
using FamilyHubs.ServiceDirectory.Shared.Dto;
using FamilyHubs.ServiceDirectory.Shared.Enums;
using FamilyHubs.ServiceDirectory.Shared.Extensions;
using ServiceType = FamilyHubs.ServiceDirectory.Web.Models.ServiceType;

namespace FamilyHubs.ServiceDirectory.Web.Mappers;

//todo: use extension methods?
public static class ServiceMapper
{
    public static IEnumerable<Service> ToViewModel(IEnumerable<ServiceDto> services)
    {
        return services.Select(ToViewModel);
    }

    private static Service ToViewModel(ServiceDto service)
    {
        Debug.Assert(service.ServiceType == Shared.Enums.ServiceType.FamilyExperience);

        var serviceAtLocation = service.Locations.First();
        var eligibility = service.Eligibilities.FirstOrDefault();

        var name = service.Name;
        var contact = service.GetContact();

        return new Service(
            IsFamilyHub(serviceAtLocation) ? ServiceType.FamilyHub : ServiceType.Service,
            name,
            service.Distance != null ? DistanceConverter.MetersToMiles(service.Distance.Value) : null,
            GetCost(service),
            GetAddress(serviceAtLocation),
            GetWhen(serviceAtLocation),
            GetCategories(service),
            GetAgeRange(eligibility),
            contact?.Telephone,
            contact?.Email,
            name,
            GetWebsiteUrl(contact?.Url));
    }

    private static string? GetAgeRange(EligibilityDto? eligibility)
    {
        return eligibility == null ? null : $"{AgeToString(eligibility.MinimumAge)} to {AgeToString(eligibility.MaximumAge)}";
    }

    private static bool IsFamilyHub(LocationDto location)
    {
        return location.LocationType == LocationType.FamilyHub;
    }

    private static string? GetWebsiteUrl(string? url)
    {
        if (string.IsNullOrWhiteSpace(url))
            return default;

        if (Uri.IsWellFormedUriString(url, UriKind.Absolute))
            return url;

        // assume http! (UriBuilder interprets a single string as a host and insists on adding a '/' on the end, which doesn't work if the url contains query params)
        return $"http://{url}";
    }

    private static IEnumerable<string> GetCategories(ServiceDto service)
    {
        return  service.Taxonomies.Select(st => st.Name);
    }

    private static IEnumerable<string> GetAddress(LocationDto location)
    {
        var splitAddress1 = location.Address1.Split('|');

        return RemoveEmpty(location.Name)
            .Concat(RemoveEmpty(splitAddress1))
            .Concat(RemoveEmpty(location.City, location.StateProvince, location.PostCode));
    }

    private static IEnumerable<string> GetWhen(LocationDto location)
    {
        var when =
            location.RegularSchedules.FirstOrDefault()?.Description?.Split('\n').Select(l => l.Trim())
            ?? Enumerable.Empty<string>();
        return when;
    }

    private static IEnumerable<string> GetCost(ServiceDto service)
    {
        const string free = "Free";

        if (!service.CostOptions.Any())
        {
            return new[] { free };
        }

        var cost = new List<string>();
        var firstCost = service.CostOptions.First();

        if (firstCost.Amount is not null && firstCost.Amount != decimal.Zero)
        {
            var ukNumberFormat = new CultureInfo("en-GB", false).NumberFormat;
            var amount = firstCost.Amount.Value.ToString("C0", ukNumberFormat);
            cost.Add($"{amount} every {firstCost.AmountDescription?.ToLowerInvariant()}");
        }

        if (!string.IsNullOrWhiteSpace(firstCost.Option))
        {
            var splitCostOptions = firstCost.Option.Split("\n");
            cost.AddRange(splitCostOptions);
        }

        return cost;
    }

    private static string AgeToString(int age)
    {
        return age == 127 ? "25+" : age.ToString();
    }

    private static IEnumerable<string> RemoveEmpty(params string?[] list)
    {
        return list.Where(x => !string.IsNullOrWhiteSpace(x))!;
    }
}