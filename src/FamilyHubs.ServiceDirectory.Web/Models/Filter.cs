using FamilyHubs.ServiceDirectory.Web.Models.Interfaces;

namespace FamilyHubs.ServiceDirectory.Web.Models;

public record Filter(string Name, string Description, IEnumerable<IFilterAspect> Aspects);
