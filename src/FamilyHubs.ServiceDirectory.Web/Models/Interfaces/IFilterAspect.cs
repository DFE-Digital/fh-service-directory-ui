namespace FamilyHubs.ServiceDirectory.Web.Models.Interfaces;

public interface IFilterAspect
{
    string Id { get; }
    string Description { get; }
    bool SelectedByDefault { get; }
}