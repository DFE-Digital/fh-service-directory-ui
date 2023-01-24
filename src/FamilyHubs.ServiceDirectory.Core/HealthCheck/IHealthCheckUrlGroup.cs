using Microsoft.Extensions.Configuration;

namespace FamilyHubs.ServiceDirectory.Core.HealthCheck;

public interface IHealthCheckUrlGroup
{
    static abstract Uri HealthUrl(IConfiguration configuration);
}