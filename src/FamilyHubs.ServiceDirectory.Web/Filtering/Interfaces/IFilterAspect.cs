namespace FamilyHubs.ServiceDirectory.Web.Filtering.Interfaces;

public interface IFilterAspect
{
    string Id { get; }
    string Name { get; }
    string Description { get; }
    bool SelectedByDefault { get; }
}