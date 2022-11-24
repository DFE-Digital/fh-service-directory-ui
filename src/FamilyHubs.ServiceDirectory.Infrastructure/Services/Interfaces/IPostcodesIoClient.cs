
namespace FamilyHubs.ServiceDirectory.Infrastructure.Services.Interfaces
{
    public interface IPostcodesIoClient
    {
        /// <returns>PostCodeInfo, or null if postcode not found.</returns>
        Task<PostcodeInfo?> Get(string postcode, CancellationToken cancellationToken = default);
    }
}
