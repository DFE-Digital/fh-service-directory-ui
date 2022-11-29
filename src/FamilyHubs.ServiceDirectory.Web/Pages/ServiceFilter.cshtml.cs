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
            new Filter("cost", "Cost", FilterType.Checkboxes, new IFilterAspect[]
            {
                new FilterAspect("cost--free", "Free"),
                new FilterAspect("cost--pay-to-use", "Pay to use")
            }),
            new Filter("show", "Show", FilterType.Checkboxes, new IFilterAspect[]
            {
                new FilterAspect("show--family-hubs", "Family hubs"),
                new FilterAspect("show--services-and-groups", "Services and groups")
            }),
            new Filter("search-within", "Search within", FilterType.Radios, new IFilterAspect[]
            {
                new FilterAspect("search-within--1-mile", "1 mile"),
                new FilterAspect("search-within--2-miles", "2 miles"),
                new FilterAspect("search-within--5-miles", "5 miles"),
                new FilterAspect("search-within--10-miles", "10 miles"),
                new FilterAspect("search-within--20-miles", "20 miles")
            }),
            new Filter("age-range", "Age range", FilterType.Checkboxes, new IFilterAspect[]
            {
                new FilterAspect("age-range--all-age-groups", "All age groups"),
                new FilterAspect("age-range--0-to-5", "0 to 5"),
                new FilterAspect("age-range--6-to-11", "6 to 11"),
                new FilterAspect("age-range--12-to-15", "12 to 15"),
                new FilterAspect("age-range--16-to-18", "16 to 18"),
                new FilterAspect("age-range--19-to-25-with-send", "19 to 25 with SEND"),
                new FilterAspect("age-range--parents-and-carers", "Parents and carers")
            })
        };

        public string? Postcode { get; set; }

        public void OnGet(string? postcode)
        {
            Postcode = postcode;
        }
    }
}
