
namespace FamilyHubs.ServiceDirectory.Infrastructure.Services.Interfaces
{
    //todo: move to core
    public enum PostcodeError
    {
        /// <summary>
        /// Postcode was found
        /// </summary>
        None,
        /// <summary>
        /// No postcode supplied
        /// </summary>
        NoPostcode,
        /// <summary>
        /// Postcode in an invalid format
        /// </summary>
        InvalidPostcode,
        /// <summary>
        /// Postcode is in a valid format, but not found
        /// </summary>
        PostcodeNotFound
    }

    public interface IPostcodesIoClient
    {
        /// <returns>
        /// PostcodeError 
        /// PostCodeInfo or null if there was an error.
        /// </returns>
        Task<(PostcodeError, PostcodeInfo?)> Get(string? postcode, CancellationToken cancellationToken = default);
    }
}
