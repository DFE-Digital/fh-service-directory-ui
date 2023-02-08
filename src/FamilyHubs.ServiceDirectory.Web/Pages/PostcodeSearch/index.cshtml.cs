using FamilyHubs.ServiceDirectory.Core.Postcode.Model;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace FamilyHubs.ServiceDirectory.Web.Pages.PostcodeSearch;

public class PostcodeSearchModel : PageModel
{
    public PostcodeError PostcodeError { get; set; }

    public void OnGet(PostcodeError postcodeError)
    {
        PostcodeError = postcodeError;
    }
}