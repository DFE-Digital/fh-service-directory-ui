namespace FamilyHubs.ServiceDirectory.Infrastructure.Services;

//todo: belongs in core??
//todo: upper case
public sealed record PostcodeInfo(int status, Result result);

//public record PostcodeInfo
//{
//    public int status { get; set; }
//    public Result result { get; set; }
//}

public sealed record Result(float? latitude, float? longitude, string outcode, Codes codes);

//todo: docs say codes.admin_district is nullable. when do we get a null?
public sealed record Codes(string? admin_district);

//public class Result
//{
//    public string postcode { get; set; }
//    public int quality { get; set; }
//    public int eastings { get; set; }
//    public int northings { get; set; }
//    public string country { get; set; }
//    public string nhs_ha { get; set; }
//    /// <summary>
//    /// The WGS84 longitude given the Postcode's national grid reference. May be null if geolocation not available.
//    /// </summary>
//    public float? longitude { get; set; }
//    /// <summary>
//    /// Latitude. The WGS84 latitude given the Postcode's national grid reference. May be null if geolocation not available.
//    /// </summary>
//    public float? latitude { get; set; }
//    public string european_electoral_region { get; set; }
//    public string primary_care_trust { get; set; }
//    public string region { get; set; }
//    public string lsoa { get; set; }
//    public string msoa { get; set; }
//    public string incode { get; set; }
//    /// <summary>
//    /// The outward code is the part of the postcode before the single space in the middle. It is between two and four characters long. A few outward codes are non-geographic, not divulging where mail is to be sent. Examples of outward codes include "L1", "W1A", "RH1", "RH10" or "SE1P".
//    /// </summary>
//    public string outcode { get; set; }
//    public string parliamentary_constituency { get; set; }
//    public string admin_district { get; set; }
//    public string parish { get; set; }
//    public string admin_county { get; set; }
//    public string admin_ward { get; set; }
//    public string ced { get; set; }
//    public string ccg { get; set; }
//    public string nuts { get; set; }
//    /// <summary>
//    /// Returns an ID or Code associated with the postcode. Typically, these are a 9 character code known as an ONS Code or GSS Code. This is currently only available for districts, parishes, counties, CCGs, NUTS and wards.
//    /// </summary>
//    public Codes codes { get; set; }
//}

//public class Codes
//{
//    /// <summary>
//    /// The current district/unitary authority to which the postcode has been assigned. (ID version)
//    /// </summary>
//    public string admin_district { get; set; }
//    public string admin_county { get; set; }
//    public string admin_ward { get; set; }
//    public string parish { get; set; }
//    public string parliamentary_constituency { get; set; }
//    public string ccg { get; set; }
//    public string ccg_id { get; set; }
//    public string ced { get; set; }
//    public string nuts { get; set; }
//    public string lsoa { get; set; }
//    public string msoa { get; set; }
//    public string lau2 { get; set; }
//}