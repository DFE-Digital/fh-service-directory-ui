using System.Text.Json.Serialization;

namespace FamilyHubs.ServiceDirectory.Infrastructure.Services;

//todo: can we flatten the result during deserialization
//todo: belongs in core??
public sealed record PostcodeInfo(
    //todo: do we need status from the body - should always match the http code?
    [property: JsonPropertyName("status")] int Status,
    [property: JsonPropertyName("result")] Result Result);

/// <param name="Latitude">The WGS84 latitude given the postcode's national grid reference. May be null if geolocation not available.</param>
/// <param name="Longitude">The WGS84 longitude given the postcode's national grid reference. May be null if geolocation not available.</param>
/// <param name="Outcode">The outward code is the part of the postcode before the single space in the middle. It is between two and four characters long. A few outward codes are non-geographic, not divulging where mail is to be sent. Examples of outward codes include "L1", "W1A", "RH1", "RH10" or "SE1P".</param>
/// <param name="Codes"></param>
public sealed record Result(
    [property: JsonPropertyName("latitude")] float? Latitude,
    [property: JsonPropertyName("longitude")] float? Longitude,
    [property: JsonPropertyName("outcode")] string Outcode,
    [property: JsonPropertyName("codes")] Codes Codes);

//todo: docs say codes.admin_district is nullable. when do we get a null?
/// <param name="Admin_district">The current district/unitary authority to which the postcode has been assigned. (ID version)</param>
public sealed record Codes([property: JsonPropertyName("admin_district")] string? AdminDistrict);
