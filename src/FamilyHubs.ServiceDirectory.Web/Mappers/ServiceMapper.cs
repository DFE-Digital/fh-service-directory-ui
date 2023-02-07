using FamilyHubs.ServiceDirectory.Web.Models;
using System.Diagnostics;
using System.Globalization;
using FamilyHubs.ServiceDirectory.Core.Distance;
using FamilyHubs.ServiceDirectory.Core.ServiceDirectory.Models;
using FamilyHubs.ServiceDirectory.Infrastructure.Services.ServiceDirectory.Constants;
using FamilyHubs.ServiceDirectory.Shared.Dto;
using FamilyHubs.ServiceDirectory.Shared.Extensions;

namespace FamilyHubs.ServiceDirectory.Web.Mappers;

//todo: use extension methods?
public static class ServiceMapper
{
    private static readonly NumberFormatInfo UkNumberFormat = new CultureInfo("en-GB", false).NumberFormat;

    public static IEnumerable<Service> ToViewModel(IEnumerable<ServiceWithOrganisation> servicesWithOrganisation)
    {
        return servicesWithOrganisation.Select(ToViewModel);
    }

    private static Service ToViewModel(ServiceWithOrganisation serviceWithOrganisation)
    {
        var service = serviceWithOrganisation.Service;

        Debug.Assert(service.ServiceType.Name == "Family Experience");

        var serviceAtLocation = service.ServiceAtLocations?.FirstOrDefault();
        var eligibility = service.Eligibilities?.FirstOrDefault();

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
            serviceWithOrganisation.Organisation.Name,
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

    private static bool IsFamilyHub(ServiceAtLocationDto? serviceAtLocation)
    {
        return serviceAtLocation?.Location.LinkTaxonomies
            ?.Any(lt => string.Equals(lt.Taxonomy?.Id, TaxonomyDtoIds.FamilyHub, StringComparison.OrdinalIgnoreCase)) == true;
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
        var serviceTaxonomies = service.ServiceTaxonomies;
        if (serviceTaxonomies == null)
        {
            return Enumerable.Empty<string>();
        }

        return serviceTaxonomies.Where(st => st.Taxonomy != null)
            .Select(st => st.Taxonomy!.Name);
    }

    private static IEnumerable<string> GetAddress(ServiceAtLocationDto? serviceAtLocation)
    {
        var address = serviceAtLocation?.Location.PhysicalAddresses?.FirstOrDefault();

        var splitAddress1 = address?.Address1.Split('|');

        return RemoveEmpty(serviceAtLocation?.Location.Name)
            .Concat(RemoveEmpty(splitAddress1 ?? Array.Empty<string>()))
            .Concat(RemoveEmpty(address?.City, address?.StateProvince, address?.PostCode));
    }

    private static IEnumerable<string> GetWhen(ServiceAtLocationDto? serviceAtLocation)
    {
        var when =
            serviceAtLocation?.RegularSchedules?.FirstOrDefault()?.Description.Split('\n').Select(l => l.Trim())
            ?? Enumerable.Empty<string>();
        return when;
    }

    private static IEnumerable<string> GetCost(ServiceDto service)
    {
        const string free = "Free";

        if (service.CostOptions?.Any() == false)
        {
            return new[] { free };
        }

        var cost = new List<string>();
        var firstCost = service.CostOptions!.First();

        if (firstCost.Amount != decimal.Zero)
        {
            string amount = firstCost.Amount.ToString(firstCost.Amount == (int)firstCost.Amount ? "C0" : "C", UkNumberFormat);
            cost.Add($"{amount} every {firstCost.AmountDescription.ToLowerInvariant()}");
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