using FamilyHubs.ServiceDirectory.Web.Models;
using System.Diagnostics;
using System.Globalization;
using FamilyHubs.ServiceDirectory.Core.Distance;
using FamilyHubs.ServiceDirectory.Core.ServiceDirectory.Models;
using FamilyHubs.ServiceDirectory.Shared.Models.Api.OpenReferralServiceAtLocations;
using FamilyHubs.ServiceDirectory.Shared.Models.Api.OpenReferralServices;
using FamilyHubs.ServiceDirectory.Infrastructure.Services.ServiceDirectory.Constants;

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

        //todo: check got one. always the first??
        var serviceAtLocation = service.Service_at_locations?.FirstOrDefault();
        var eligibility = service.Eligibilities?.FirstOrDefault();
        string? ageRange = eligibility == null ? null : $"{AgeToString(eligibility.Minimum_age)} to {AgeToString(eligibility.Maximum_age)}";

        bool isFamilyHub = IsFamilyHub(serviceAtLocation);

        string name = service.Name;

        string? websiteUrl = GetWebsiteUrl(service.Url);

        return new Service(
            isFamilyHub ? ServiceType.FamilyHub : ServiceType.Service,
            name,
            service.Distance != null ? DistanceConverter.MetersToMiles(service.Distance.Value) : null,
            GetCost(service),
            GetAddress(serviceAtLocation),
            GetWhen(serviceAtLocation),
            GetCategories(service),
            serviceWithOrganisation.Organisation.Name,
            ageRange,
            //todo: do we have to filter out textphone? but data has id and number (and id seems different every time??) https://github.com/DFE-Digital/fh-service-directory-admin-ui/blob/11c4d11ccf1341e998af02b875b2674bdc61517b/src/FamilyHubs.ServiceDirectoryAdminUi.Ui/Services/ViewModelToApiModelHelper.cs
            service.Contacts?.FirstOrDefault()?.Phones?.FirstOrDefault()?.Number,
            service.Email,
            name,
            websiteUrl);
    }

    private static bool IsFamilyHub(OpenReferralServiceAtLocationDto? serviceAtLocation)
    {
        return serviceAtLocation?.Location.LinkTaxonomies
                   ?.Any(lt => lt.Taxonomy is { Id: OpenReferralTaxonomyDtoIds.FamilyHub }) == true;
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

        return RemoveEmpty(
            serviceAtLocation?.Location.Name,
            address?.Address_1,
            address?.City,
            address?.State_province,
            address?.Postal_code);
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
            cost.Add(firstCost.Option);
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