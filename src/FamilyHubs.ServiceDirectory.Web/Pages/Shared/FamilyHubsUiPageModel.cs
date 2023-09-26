using FamilyHubs.SharedKernel.Razor.FamilyHubsUi.Options;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Options;

namespace FamilyHubs.ServiceDirectory.Web.Pages.Shared;

public class FamilyHubsUiPageModel : PageModel
{
    public IFamilyHubsUiOptions FamilyHubsUiOptions { get; }

    public FamilyHubsUiPageModel(IOptions<FamilyHubsUiOptions> familyHubsUiOptions)
    {
        FamilyHubsUiOptions = familyHubsUiOptions.Value;
    }
}