
namespace FamilyHubs.ServiceDirectory.Core.ServiceDirectory.Models;

public class ServicesParams
{
    public ServicesParams(string adminArea, float latitude, float longitude)
    {
        AdminArea = adminArea;
        Latitude = latitude;
        Longitude = longitude;
    }

    public string AdminArea { get; set; }
    public float Latitude { get; set; }
    public float Longitude { get; set; }
    public int? MaximumProximityMeters { get; set; }
    public int? GivenAge { get; set; }
    public bool? IsPaidFor { get; set; }
    public int? MaxFamilyHubs { get; set; }
    public bool? FamilyHub { get; set; }
    public IEnumerable<string>? TaxonomyIds { get; set; }
    public int? PageNumber { get; set; }
    public int? PageSize { get; set; }
}