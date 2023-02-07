using FamilyHubs.ServiceDirectory.Shared.Dto;

namespace FamilyHubs.ServiceDirectory.Core.ServiceDirectory.Models;

public sealed record ServiceWithOrganisation(ServiceDto Service, OrganisationDto Organisation);