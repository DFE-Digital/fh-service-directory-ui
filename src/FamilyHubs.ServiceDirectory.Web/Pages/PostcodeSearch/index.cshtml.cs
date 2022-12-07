using FamilyHubs.ServiceDirectory.Core.Postcode.Interfaces;
using FamilyHubs.ServiceDirectory.Core.Postcode.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace FamilyHubs.ServiceDirectory.Web.Pages.PostcodeSearch;

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
            return RedirectToPage("/PostcodeSearch/Index", new { postcodeError });
        }

        return RedirectToPage("/ServiceFilter/Index", new
        {
            postcode = postcodeInfo!.Postcode,
            adminDistrict = postcodeInfo.Codes.AdminDistrict,
            latitude = postcodeInfo.Latitude.ToString(),
            longitude = postcodeInfo.Longitude.ToString()
        });
    }
}