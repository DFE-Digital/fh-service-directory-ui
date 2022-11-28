using FamilyHubs.ServiceDirectory.Core.Postcode.Interfaces;
using FamilyHubs.ServiceDirectory.Core.Postcode.Model;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc;

namespace FamilyHubs.ServiceDirectory.Web.Pages
{
    public class PostcodeSearchModel : PageModel
    {
        public PostcodeError PostcodeError { get; set; }
        private readonly IPostcodeLookup _postcodeLookup;

        public PostcodeSearchModel(IPostcodeLookup postcodeLookup)
        {
            _postcodeLookup = postcodeLookup;
        }

        public void OnGet(PostcodeError postcodeError)
        {
            PostcodeError = postcodeError;
        }

        public async Task<IActionResult> OnPost(string? postcode)
        {
            var (postcodeError, postcodeInfo) = await _postcodeLookup.Get(postcode);
            if (postcodeError != PostcodeError.None)
            {
                return RedirectToPage("/PostcodeSearch", new { postcodeError });
            }

            return RedirectToPage("/ServiceFilter", new { postcode = postcodeInfo!.Postcode});
        }
    }
}
