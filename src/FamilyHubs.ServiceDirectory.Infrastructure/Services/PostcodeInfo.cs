namespace FamilyHubs.ServiceDirectory.Infrastructure.Services;

//todo: belongs in core??
public sealed record PostcodeInfo(int Status, Result Result);

/// <param name="Latitude">The WGS84 latitude given the postcode's national grid reference. May be null if geolocation not available.</param>
/// <param name="Longitude">The WGS84 longitude given the postcode's national grid reference. May be null if geolocation not available.</param>
/// <param name="Outcode">The outward code is the part of the postcode before the single space in the middle. It is between two and four characters long. A few outward codes are non-geographic, not divulging where mail is to be sent. Examples of outward codes include "L1", "W1A", "RH1", "RH10" or "SE1P".</param>
/// <param name="Codes"></param>
public sealed record Result(float? Latitude, float? Longitude, string Outcode, Codes Codes);

//todo: docs say codes.admin_district is nullable. when do we get a null?
//todo: can we use an attribute to have a more normal name?
/// <param name="Admin_district">The current district/unitary authority to which the postcode has been assigned. (ID version)</param>
public sealed record Codes(string? Admin_district);
