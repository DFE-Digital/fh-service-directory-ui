using FamilyHubs.ServiceDirectory.Infrastructure.Services.PostcodesIo;
using FamilyHubs.ServiceDirectory.Infrastructure.Services.PostcodesIo.Extensions;
using FamilyHubs.ServiceDirectory.Infrastructure.Services.ServiceDirectory;
using FamilyHubs.ServiceDirectory.Infrastructure.Services.ServiceDirectory.Extensions;
using FamilyHubs.ServiceDirectory.Web.Pages.ServiceFilter;
using FamilyHubs.ServiceDirectory.Web.Security;
using FamilyHubs.SharedKernel.Telemetry;
using HealthChecks.UI.Client;
using Microsoft.ApplicationInsights.Extensibility;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Serilog;
using Serilog.Events;

namespace FamilyHubs.ServiceDirectory.Web;

public static class StartupExtensions
{
    public static void ConfigureHost(this WebApplicationBuilder builder)
    {
        // ApplicationInsights
        builder.Host.UseSerilog((_, services, loggerConfiguration) =>
        {
            var logLevelString = builder.Configuration["LogLevel"];

            var parsed = Enum.TryParse<LogEventLevel>(logLevelString, out var logLevel);

            loggerConfiguration.WriteTo.ApplicationInsights(
                services.GetRequiredService<TelemetryConfiguration>(),
                TelemetryConverter.Traces,
                parsed ? logLevel : LogEventLevel.Warning);

            loggerConfiguration.WriteTo.Console(
                parsed ? logLevel : LogEventLevel.Warning);
        });
    }

    public static void ConfigureServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddSingleton<ITelemetryInitializer, TelemetryPiiRedactor>();
        services.AddApplicationInsightsTelemetry();

        // Add services to the container.
        services.AddRazorPages();

        // we handle API failures as Degraded, so that App Services doesn't remove or replace the instance (all instances!) due to an API being down
        services.AddHealthChecks()
            .AddUrlGroup(PostcodesIoLookup.HealthUrl(configuration), "PostcodesIo", HealthStatus.Degraded, new[] {"ExternalAPI"})
            .AddUrlGroup(ServiceDirectoryClient.HealthUrl(configuration), "ServiceDirectoryAPI", HealthStatus.Degraded, new[] { "InternalAPI" });

        // enable strict-transport-security header on localhost
#if hsts_localhost
        services.AddHsts(o => o.ExcludedHosts.Clear());
#endif
        services.AddSingleton<IPageFilterFactory, PageFilterFactory>();
        services.AddPostcodesIoClient(configuration);
        services.AddServiceDirectoryClient(configuration);
    }

    public static IServiceProvider ConfigureWebApplication(this WebApplication app)
    {
        app.UseSerilogRequestLogging();

        app.UseAppSecurityHeaders();

        // Configure the HTTP request pipeline.
        if (!app.Environment.IsDevelopment())
        {
            app.UseExceptionHandler("/Error");
            // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
            app.UseHsts();
        }
        app.UseStatusCodePagesWithReExecute("/Error/{0}");

#if use_https
        app.UseHttpsRedirection();
#endif
        app.UseStaticFiles();

        app.UseRouting();

        app.UseAuthorization();

        app.MapRazorPages();

        app.MapHealthChecks("/health", new HealthCheckOptions
        {
            Predicate = _ => true,
            ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
        });

        return app.Services;
    }
}
