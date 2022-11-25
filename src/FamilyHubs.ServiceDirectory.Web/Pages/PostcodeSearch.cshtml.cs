using Microsoft.AspNetCore.Mvc.RazorPages;
using FamilyHubs.ServiceDirectory.Infrastructure.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FamilyHubs.ServiceDirectory.Web.Pages
{
    public class PostcodeSearchModel : PageModel
    {
        public PostcodeError PostcodeError { get; set; }
        //todo: clean architecture says don't access infrastructure code in web (apart from program/startup)
        // so create a wrapper in core project
        private readonly IPostcodesIoClient _postcodesIoClient;

        public PostcodeSearchModel(IPostcodesIoClient postcodesIoClient)
        {
            _postcodesIoClient = postcodesIoClient;
        }

        //todo: use post-redirect-get or not??
        public void OnGet(PostcodeError postcodeError)
        {
            PostcodeError = postcodeError;
        }

        public async Task<IActionResult> OnPost(string? postcode)
        {
            var (postcodeError, _) = await _postcodesIoClient.Get(postcode);
            if (postcodeError != PostcodeError.None)
            {
                return RedirectToPage("/PostcodeSearch", new { postcodeError });
            }

            return RedirectToPage("/ServiceFilter");
        }
    }
}
