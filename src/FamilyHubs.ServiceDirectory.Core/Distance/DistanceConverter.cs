
namespace FamilyHubs.ServiceDirectory.Core.Distance;

public static class DistanceConverter
{
    private const double MetersInMiles = 1609.34;

    public static int MilesToMeters(int miles)
    {
        return (int) (miles * MetersInMiles);
    }

    public static double MetersToMiles(double meters)
    {
        return meters / MetersInMiles;
    }
}