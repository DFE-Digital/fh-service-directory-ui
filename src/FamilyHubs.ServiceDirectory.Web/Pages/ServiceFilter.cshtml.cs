using Microsoft.AspNetCore.Mvc.RazorPages;

namespace FamilyHubs.ServiceDirectory.Web.Pages
{
    public class ServiceFilterModel : PageModel
    {
        public string? Postcode { get; set; }

        public void OnGet(string? postcode)
        {
            Postcode = postcode;
        }
    }
}
