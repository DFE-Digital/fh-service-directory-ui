
namespace FamilyHubs.ServiceDirectory.Core.Postcode.Interfaces;

public interface IPostcodeInfo
{
    /// <summary>
    /// Searched postcode in canonical format. 2, 3 or 4-character outward code, single space and 3-character inward code.
    /// </summary>
    string Postcode { get; }

    /// <summary>
    /// The WGS84 latitude given the postcode's national grid reference. May be null if geolocation not available.
    /// </summary>
    float? Latitude { get; }

    /// <summary>
    /// The WGS84 longitude given the postcode's national grid reference. May be null if geolocation not available.
    /// </summary>
    float? Longitude { get; }

    /// <summary>
    /// The LA administrative area, which can be at the county or district/unitary authority level, to which the postcode has been assigned.
    /// </summary>
    string? AdminArea { get; }
}