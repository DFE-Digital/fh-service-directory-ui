using FamilyHubs.ServiceDirectory.Web.Models;
using System.Diagnostics;
using System.Globalization;
using FamilyHubs.ServiceDirectory.Core.Distance;
using FamilyHubs.ServiceDirectory.Core.ServiceDirectory.Models;
using FamilyHubs.ServiceDirectory.Infrastructure.Services.ServiceDirectory;
using FamilyHubs.ServiceDirectory.Shared.Models.Api.OpenReferralServiceAtLocations;
using FamilyHubs.ServiceDirectory.Shared.Models.Api.OpenReferralServices;

namespace FamilyHubs.ServiceDirectory.Web.Mappers;

//todo: use extension methods?
public static class ServiceMapper
{
    private static readonly NumberFormatInfo UkNumberFormat = new CultureInfo("en-GB", false).NumberFormat;

    public static IEnumerable<Service> ToViewModel(IEnumerable<ServiceWithOrganisation> servicesWithOrganisation)
    {
        // service / family hub display open questions
        // --------------
        // opening hours / when: how to build up description from multiple rows with data and/or descriptions
        // age range: how to handle SEND, e.g. from prototype "0 to 19 (0 to 25 with SEND)"
        // assumptions
        // -----------
        // General:
        // if data missing for a field, we show the key with a blank space for the value (as opposed to removing the row)
        // valid from/valid is not populated, so we ignore it (and don't filter by it)
        // Run by:
        // We show the name of the service's organisation
        // Age range:
        // show "{Minimum_age} to {Maximum_age}" from first eligibility (ignore others) - there will be only one
        // Opening Hours (family hub) / When (service):
        // show description of first regular schedule off service at location
        // (regular schedule in open referral doc is off service at location and location, but not seeing it come from api off service)
        // we ignore holiday schedule
        // Address:
        // show first location's first address only
        // omit empty address lines
        // Phone:
        // show first phone number of first contact, if there is one (ignore >1 contact or contact with >1 number)
        // we might have to filter out textphone, but data has id and number (and id seems different every time??) https://github.com/DFE-Digital/fh-service-directory-admin-ui/blob/11c4d11ccf1341e998af02b875b2674bdc61517b/src/FamilyHubs.ServiceDirectoryAdminUi.Ui/Services/ViewModelToApiModelHelper.cs
        // Website:
        // there is no description field for the link, so have used the name of the service (prototype shows unique website names, e.g. CAMHS for Child and Adolescent Mental Health Services (CAMHS)
        // Cost:
        // if no cost options present, we assume is 'Free'
        // if more than one cost, we display them all on separate lines (only single cost shown on the prototype)
        // construct as £{amount} every {amount_description} - assumes format will always work, amount in pounds
        // unless amount is 0, in which case we show 'Free'

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

        bool isFamilyHub = serviceWithOrganisation.Organisation.OrganisationType.Id == ServiceDirectoryConstants.OrganisationTypeIdFamilyHub;

        string? category = service.Service_taxonomys?.FirstOrDefault()?.Taxonomy?.Name;

        return new Service(
            isFamilyHub ? ServiceType.FamilyHub : ServiceType.Service,
            service.Name,
            service.Distance != null ? DistanceConverter.MetersToMiles(service.Distance.Value) : null,
            GetCost(service),
            GetAddress(serviceAtLocation),
            GetWhen(serviceAtLocation),
            category,
            serviceWithOrganisation.Organisation.Name,
            ageRange,
            service.Contacts?.FirstOrDefault()?.Phones?.FirstOrDefault()?.Number,
            service.Email,
            service.Name,
            service.Url);
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