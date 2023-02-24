using FamilyHubs.ServiceDirectory.Core.Postcode.Interfaces;
using System.Text.Json.Serialization;

namespace FamilyHubs.ServiceDirectory.Core.Postcode.Model;

public sealed record PostcodeInfo(
    [property: JsonPropertyName("postcode")] string Postcode,
    [property: JsonPropertyName("latitude")] float? Latitude,
    [property: JsonPropertyName("longitude")] float? Longitude,
    [property: JsonPropertyName("codes")] Codes Codes) : IPostcodeInfo
{
    public string? AdminArea => string.Equals(Codes.AdminCounty, "E99999999", StringComparison.InvariantCultureIgnoreCase)
        ? Codes.AdminDistrict : Codes.AdminCounty;
}

//todo: docs say admin_district & admin_county are nullable. when do we get a null?

/// <param name="AdminDistrict">The current district/unitary authority to which the postcode has been assigned. (ID version)</param>
/// <param name="AdminCounty">The current county to which the postcode has been assigned. (ID version)</param>
public sealed record Codes(
    [property: JsonPropertyName("admin_district")] string? AdminDistrict,
    [property: JsonPropertyName("admin_county")] string? AdminCounty);