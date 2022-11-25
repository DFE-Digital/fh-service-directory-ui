using FamilyHubs.ServiceDirectory.Core.Postcode.Model;

namespace FamilyHubs.ServiceDirectory.Core.Postcode.Interfaces;

public interface IPostcodeLookup
{
    /// <returns>
    /// PostcodeError 
    /// PostCodeInfo or null if there was an error.
    /// </returns>
    Task<(PostcodeError, PostcodeInfo?)> Get(string? postcode, CancellationToken cancellationToken = default);
}