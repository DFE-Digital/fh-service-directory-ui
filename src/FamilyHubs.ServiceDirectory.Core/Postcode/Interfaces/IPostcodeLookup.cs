using FamilyHubs.ServiceDirectory.Core.Postcode.Model;

namespace FamilyHubs.ServiceDirectory.Core.Postcode.Interfaces;

public interface IPostcodeLookup
{
    /// <returns>
    /// PostcodeError 
    /// IPostcodeInfo or null if there was an error.
    /// </returns>
    Task<(PostcodeError, IPostcodeInfo?)> Get(string? postcode, CancellationToken cancellationToken = default);
}