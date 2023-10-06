using Serilog;

namespace FamilyHubs.ServiceDirectory.Web;

public static class Program
{
    public static IServiceProvider ServiceProvider { get; private set; } = default!;

    public static void Main(string[] args)
    {
#if USE_SERILOGINAPP
        Log.Logger = new LoggerConfiguration()
            .WriteTo.Console()
            .CreateBootstrapLogger();

        Log.Information("Starting up");
#else
        WebApplication? app = null;
#endif

        try
        {
            var builder = WebApplication.CreateBuilder(args);
#if USE_SERILOGINAPP
            builder.ConfigureHost();
#endif

            builder.Services.ConfigureServices(builder.Configuration);
#if USE_SERILOGINAPP
            var app = builder.Build();
#else
            builder.Logging.ClearProviders();
            builder.Logging.AddConsole();
            builder.Logging.AddAzureWebAppDiagnostics();
            app = builder.Build();
            app.Logger.LogInformation("Starting Find Web App");
#endif

            ServiceProvider = app.ConfigureWebApplication();

            app.Run();
        }
        catch (Exception e)
        {
#if USE_SERILOGINAPP
            Log.Fatal(e, "An unhandled exception occurred during bootstrapping");
#else
            if (app != null)
            {
                app.Logger.LogError(e, "Starting Test Web App");
            }          
#endif
        }
        finally
        {
#if USE_SERILOGINAPP
            Log.CloseAndFlush();
#endif
        }
    }
}