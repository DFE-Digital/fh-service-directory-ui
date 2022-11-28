using FamilyHubs.ServiceDirectory.Web.Models;
using FamilyHubs.ServiceDirectory.Web.Models.Interfaces;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace FamilyHubs.ServiceDirectory.Web.Pages
{
    public class ServiceFilterModel : PageModel
    {
        //todo: partial?
        public static readonly IEnumerable<Filter> Filters = new[]
        {
            new Filter("cost", "Cost", new IFilterAspect[]
            {
                new FilterAspect("cost--free", "Free"),
                new FilterAspect("cost--pay-to-use", "Pay to use")
            })
        };

        public string? Postcode { get; set; }

        public void OnGet(string? postcode)
        {
            Postcode = postcode;
        }
    }
}
