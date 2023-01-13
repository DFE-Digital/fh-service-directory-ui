using Microsoft.Extensions.Configuration;

namespace FamilyHubs.ServiceDirectory.Infrastructure.HealthCheck;

public interface IHealthCheckUrlGroup
{
    static abstract Uri HealthUrl(IConfiguration configuration);
}