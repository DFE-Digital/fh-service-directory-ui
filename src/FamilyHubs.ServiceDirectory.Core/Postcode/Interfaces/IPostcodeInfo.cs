
namespace FamilyHubs.ServiceDirectory.Core.Postcode.Interfaces;

public interface IPostcodeInfo
{
    string Postcode { get; }

    float? Latitude { get; }

    float? Longitude { get; }

    string? AdminArea { get; }
}