using FamilyHubs.ServiceDirectory.Shared.Models.Api.OpenReferralOrganisations;
using FamilyHubs.ServiceDirectory.Shared.Models.Api.OpenReferralServices;

namespace FamilyHubs.ServiceDirectory.Core.ServiceDirectory.Models;

public sealed record ServiceWithOrganisation(OpenReferralServiceDto Service, OpenReferralOrganisationDto Organisation);