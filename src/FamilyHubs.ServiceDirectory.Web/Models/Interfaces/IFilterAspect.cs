namespace FamilyHubs.ServiceDirectory.Web.Models.Interfaces;

public interface IFilterAspect
{
    public string Id { get; }
    public string Description { get; }
    public bool Selected { get; }
}