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

        public async Task OnGet()
        {
            //todo: this will live in post
#pragma warning disable S1481
            var postcodeInfo = await _postcodesIoClient.Get("b77 4nu");
        }
    }
}
