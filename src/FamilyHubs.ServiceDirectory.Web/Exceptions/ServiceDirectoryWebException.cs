#if need_it
namespace FamilyHubs.ServiceDirectory.Web.Exceptions;
#pragma warning disable S3925

/// <summary>
/// An exception for random web issues
/// </summary>
public class ServiceDirectoryWebException : Exception
{
    public ServiceDirectoryWebException(string? message) : base(message)
    {
    }

    public ServiceDirectoryWebException(string? message, Exception? innerException) : base(message, innerException)
    {
    }
}
#endif