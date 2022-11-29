using FamilyHubs.ServiceDirectory.Web.Models.Interfaces;

namespace FamilyHubs.ServiceDirectory.Web.Models;

public enum FilterType
{
    Checkboxes,
    Radios
}

public record Filter(string Name, string Description, FilterType FilterType, IEnumerable<IFilterAspect> Aspects);
