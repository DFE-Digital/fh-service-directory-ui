namespace FamilyHubs.ServiceDirectory.Web.Models.Interfaces;

public interface IPostFilter : IFilter
{
    public string? Value { get; }
}