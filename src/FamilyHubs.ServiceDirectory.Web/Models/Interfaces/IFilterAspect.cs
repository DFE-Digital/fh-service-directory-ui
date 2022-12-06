namespace FamilyHubs.ServiceDirectory.Web.Models.Interfaces;

public interface IFilterAspect
{
    public string Id { get; }
    public string Description { get; }
    //todo: rename to SelectedByDefault
    public bool Selected { get; }
}