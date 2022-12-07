namespace FamilyHubs.ServiceDirectory.Web.Models.Interfaces;

public interface IPostFilter : IFilter
{
    string? Value { get; }
}