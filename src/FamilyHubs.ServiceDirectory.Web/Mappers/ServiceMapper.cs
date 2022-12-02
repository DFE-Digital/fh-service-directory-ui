using FamilyHubs.ServiceDirectory.Shared.Models.Api.OpenReferralServices;
using FamilyHubs.ServiceDirectory.Web.Models;
using System.Diagnostics;
using System.Globalization;

namespace FamilyHubs.ServiceDirectory.Web.Mappers
{
    //todo: use extension methods?
    public static class ServiceMapper
    {
        private static readonly NumberFormatInfo UkNumberFormat = new CultureInfo("en-GB", false).NumberFormat;

        public static IEnumerable<Service> ToViewModel(IEnumerable<OpenReferralServiceDto> serviceDto)
        {
            // service / family hub display open questions
            // --------------
            // general: is valid from/valid to going to be populated? should we filter by it? => NO
            // Run by: do we display it? if so, where do we get it from? (line in description?)
            // opening hours / when: how to build up description from multiple rows with data and/or descriptions
            // age range: how to handle SEND, e.g. from prototype "0 to 19 (0 to 25 with SEND)"
            // assumptions
            // -----------
            // General:
            // if data missing for a field, we don't show the row at all (as opposed to displaying the key with a blank value)
            // show it blank
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
            // Filter out textphone -> use telephone
            // Website:
            // there is no description field for the link, so have used the name of the service (prototype shows unique website names, e.g. CAMHS for Child and Adolescent Mental Health Services (CAMHS)
            // Cost:
            // if no cost options present, we assume is 'Free'
            // if more than one cost, we display them all on separate lines (only single cost shown on the prototype)
            // construct as £{amount} every {amount_description} - assumes format will always work, amount in pounds
            // we ignore valid from/valid to

            return serviceDto.Select(ToViewModel);
        }

        private static Service ToViewModel(OpenReferralServiceDto dto)
        {
            Debug.Assert(dto.ServiceType.Name == "Family Experience");

            //todo: check got one. always the first??
            var serviceAtLocation = dto.Service_at_locations?.FirstOrDefault();
            var address = serviceAtLocation?.Location.Physical_addresses?.FirstOrDefault();
            var eligibility = dto.Eligibilities?.FirstOrDefault();

            // or check id == d242700a-b2ad-42fe-8848-61534002156c instead??
            //todo: just double check null Taxonomy
            bool isFamilyHub = dto.Service_taxonomys?.Any(t => t.Taxonomy?.Name == "FamilyHub") ?? false;

            IEnumerable<string> cost;
            if (dto.Cost_options?.Any() == false)
            {
                cost = new[] { "Free" };
            }
            else
            {
                //todo: don't show decimal places if whole pounds
                cost = dto.Cost_options!.Select(co => $"{co.Amount:C} every {co.Amount_description.ToLowerInvariant()}");
            }

            return new Service(
                isFamilyHub ? ServiceType.FamilyHub : ServiceType.Service,
                dto.Name,
                dto.Distance != null ? MetersToMiles(dto.Distance.Value) : null,
                cost,
                null,
                $"{eligibility?.Minimum_age} to {eligibility?.Maximum_age}",
                serviceAtLocation?.Regular_schedule?.FirstOrDefault()?.Description,
                RemoveEmpty(address?.Address_1, address?.City, address?.State_province, address?.Postal_code),
                dto.Contacts?.FirstOrDefault()?.Phones?.FirstOrDefault()?.Number,
                dto.Email,
                dto.Name,
                dto.Url);
        }

        private static IEnumerable<string> RemoveEmpty(params string?[] list)
        {
            return list.Where(x => !string.IsNullOrWhiteSpace(x))!;
        }

        private static double MetersToMiles(double meters)
        {
            return meters / 1609.34;
        }
    }
}
