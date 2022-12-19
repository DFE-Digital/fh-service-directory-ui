using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace FamilyHubs.ServiceDirectory.Web.Pages.Error
{
    public class TestModel : PageModel
    {
        public void OnGet()
        {
#pragma warning disable
            throw new Exception("Test exception");
        }
    }
}
