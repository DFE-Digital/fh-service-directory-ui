using FamilyHubs.ServiceDirectory.Infrastructure.Services.PostcodesIo.Extensions;
using FamilyHubs.ServiceDirectory.Infrastructure.Services.ServiceDirectory.Extensions;
using FamilyHubs.ServiceDirectory.Web.Security;
using HealthChecks.UI.Client;
using Microsoft.ApplicationInsights.Extensibility;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
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
        services.AddApplicationInsightsTelemetry();

        // Add services to the container.
        services.AddRazorPages();
#pragma warning disable 
        //todo: get uri's from clients
        //todo: move into extension
        services.AddHealthChecks()
            .AddUrlGroup(new Uri("https://api.postcodes.io/postcodes/SW1A2AA"), "PostcodesIo",
                tags: new[] {"ExternalAPI"})
            //todo: add health check to API with DbContext probe
            .AddUrlGroup(new Uri("https://s181d01-as-fh-sd-api-dev.azurewebsites.net/api/info"), "ServiceDirectoryAPI",
                tags: new[] { "InternalAPI" });

        // enable strict-transport-security header on localhost
#if hsts_localhost
        services.AddHsts(o => o.ExcludedHosts.Clear());
#endif

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
