using FamilyHubs.ServiceDirectory.Infrastructure.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using FamilyHubs.ServiceDirectory.Infrastructure.Services.Interfaces;

namespace FamilyHubs.ServiceDirectory.Web.Pages
{
    public class PostcodeSearchModel : PageModel
    {
        //todo: clean architecture says don't access infrastructure code in web (apart from program/startup)
        // so create a wrapper in core project
        private readonly IPostcodesIoClient _postcodesIoClient;

        public PostcodeSearchModel(IPostcodesIoClient postcodesIoClient)
        {
            _postcodesIoClient = postcodesIoClient;
        }

        public void OnGet()
        {
            // functionality not implemented yet
        }
    }
}
