using FamilyHubs.ServiceDirectory.Web.Models;
using System.Diagnostics;
using System.Globalization;
using FamilyHubs.ServiceDirectory.Core.Distance;
using FamilyHubs.ServiceDirectory.Core.ServiceDirectory.Models;
using FamilyHubs.ServiceDirectory.Shared.Models.Api.OpenReferralServiceAtLocations;
using FamilyHubs.ServiceDirectory.Shared.Models.Api.OpenReferralServices;
using FamilyHubs.ServiceDirectory.Infrastructure.Services.ServiceDirectory.Constants;
using FamilyHubs.ServiceDirectory.Shared.Models.Api.OpenReferralEligibilitys;

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

        var serviceAtLocation = service.Service_at_locations?.FirstOrDefault();
        var eligibility = service.Eligibilities?.FirstOrDefault();

        string name = service.Name;

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
            GetPhone(service),
            service.Email,
            name,
            GetWebsiteUrl(service.Url));
    }

    private static string? GetAgeRange(OpenReferralEligibilityDto? eligibility)
    {
        return eligibility == null ? null : $"{AgeToString(eligibility.Minimum_age)} to {AgeToString(eligibility.Maximum_age)}";
    }

    private static string? GetPhone(OpenReferralServiceDto service)
    {
        return service.Contacts?.FirstOrDefault(c => !string.Equals(c.Name, "Textphone", StringComparison.OrdinalIgnoreCase))?
            .Phones?.FirstOrDefault()?.Number;
    }

    private static bool IsFamilyHub(OpenReferralServiceAtLocationDto? serviceAtLocation)
    {
        return serviceAtLocation?.Location.LinkTaxonomies
            ?.Any(lt => string.Equals(lt.Taxonomy?.Id, OpenReferralTaxonomyDtoIds.FamilyHub, StringComparison.OrdinalIgnoreCase)) == true;
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

    private static IEnumerable<string> GetCategories(OpenReferralServiceDto service)
    {
        var serviceTaxonomies = service.Service_taxonomys;
        if (serviceTaxonomies == null)
        {
            return Enumerable.Empty<string>();
        }

        return serviceTaxonomies.Where(st => st.Taxonomy != null)
            .Select(st => st.Taxonomy!.Name);
    }

    private static IEnumerable<string> GetAddress(OpenReferralServiceAtLocationDto? serviceAtLocation)
    {
        var address = serviceAtLocation?.Location.Physical_addresses?.FirstOrDefault();

        var splitAddress1 = address?.Address_1.Split('|');

        return RemoveEmpty(serviceAtLocation?.Location.Name)
            .Concat(RemoveEmpty(splitAddress1 ?? Array.Empty<string>()))
            .Concat(RemoveEmpty(address?.City, address?.State_province, address?.Postal_code));
    }

    private static IEnumerable<string> GetWhen(OpenReferralServiceAtLocationDto? serviceAtLocation)
    {
        var when =
            serviceAtLocation?.Regular_schedule?.FirstOrDefault()?.Description.Split('\n').Select(l => l.Trim())
            ?? Enumerable.Empty<string>();
        return when;
    }

    private static IEnumerable<string> GetCost(OpenReferralServiceDto service)
    {
        const string free = "Free";

        if (service.Cost_options?.Any() == false)
        {
            return new[] { free };
        }

        var cost = new List<string>();
        var firstCost = service.Cost_options!.First();

        if (firstCost.Amount != decimal.Zero)
        {
            string amount = firstCost.Amount.ToString(firstCost.Amount == (int)firstCost.Amount ? "C0" : "C", UkNumberFormat);
            cost.Add($"{amount} every {firstCost.Amount_description.ToLowerInvariant()}");
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