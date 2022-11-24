
namespace FamilyHubs.ServiceDirectory.Infrastructure.Services.Interfaces
{
    public interface IPostcodesIoClient
    {
        Task<PostcodeInfo> Get(string postcode, CancellationToken cancellationToken = default);
    }
}
