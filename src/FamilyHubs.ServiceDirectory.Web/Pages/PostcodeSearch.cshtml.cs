using Microsoft.AspNetCore.Mvc.RazorPages;
using FamilyHubs.ServiceDirectory.Infrastructure.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

//todo: temp
#pragma warning disable

namespace FamilyHubs.ServiceDirectory.Web.Pages
{
    public class PostcodeSearchModel : PageModel
    {
        public enum ErrorType
        {
            None,
            Postcode
        };

        public ErrorType Error { get; set; }
        //todo: clean architecture says don't access infrastructure code in web (apart from program/startup)
        // so create a wrapper in core project
        private readonly IPostcodesIoClient _postcodesIoClient;

        public PostcodeSearchModel(IPostcodesIoClient postcodesIoClient)
        {
            _postcodesIoClient = postcodesIoClient;
        }

        //todo: use post-redirect-get or not??
        public void OnGet(ErrorType error)
        {
            Error = error;
        }

        public async Task<IActionResult> OnPost(string? postcode)
        {
            if (postcode == null)
            {
                return RedirectToPage("/PostcodeSearch", new {error = ErrorType.Postcode});
            }

            var postcodeInfo = await _postcodesIoClient.Get(postcode);

            return RedirectToPage("/ServiceFilter");
        }
    }
}
