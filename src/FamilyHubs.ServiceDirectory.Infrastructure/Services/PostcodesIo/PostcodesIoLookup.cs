using FamilyHubs.ServiceDirectory.Core.Postcode.Interfaces;
using FamilyHubs.ServiceDirectory.Core.Postcode.Model;

namespace FamilyHubs.ServiceDirectory.Infrastructure.Services.PostcodesIo;

public class PostcodesIoLookup : IPostcodeLookup
{
    private readonly IHttpClientFactory _httpClientFactory;
    internal const string HttpClientName = "postcodesio";

    public PostcodesIoLookup(IHttpClientFactory httpClientFactory)
    {
        _httpClientFactory = httpClientFactory;
    }

    public async Task<(PostcodeError, PostcodeInfo?)> Get(string? postcode, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(postcode))
            return (PostcodeError.NoPostcode, null);

        // light touch validation (ie no regex). do enough so that postcodes.io can do it's own validation
        if (!postcode.All(c => char.IsLetterOrDigit(c) || char.IsWhiteSpace(c)))
            return (PostcodeError.InvalidPostcode, null);

        var httpClient = _httpClientFactory.CreateClient(HttpClientName);

        using var response = await httpClient.GetAsync(postcode, HttpCompletionOption.ResponseHeadersRead, cancellationToken);

        if (!response.IsSuccessStatusCode && response.StatusCode != HttpStatusCode.NotFound)
            throw new PostcodesIoClientException(response, await response.Content.ReadAsStringAsync(cancellationToken));

        var postcodesIoResponse = await JsonSerializer.DeserializeAsync<PostcodesIoResponse>(
            await response.Content.ReadAsStreamAsync(cancellationToken),
            cancellationToken: cancellationToken);

        if (postcodesIoResponse is null)
        {
            // the only time it'll be null, is if the API returns "null"
            // (see https://stackoverflow.com/questions/71162382/why-are-the-return-types-of-nets-system-text-json-jsonserializer-deserialize-m)
            // unlikely, but possibly (pass new MemoryStream(Encoding.UTF8.GetBytes("null")) to see it actually return null)
            // note we hard-code passing "null", rather than messing about trying to rewind the stream, as this is such a corner case and we want to let the deserializer take advantage of the async stream (in the happy case)
            throw new PostcodesIoClientException(response, "null");
        }

        var postcodeError = PostcodeError.None;
        if (response.StatusCode == HttpStatusCode.NotFound)
        {
            switch (postcodesIoResponse.Error)
            {
                case "Postcode not found":
                    postcodeError = PostcodeError.PostcodeNotFound;
                    break;
                case "Invalid postcode":
                    postcodeError = PostcodeError.InvalidPostcode;
                    break;
                // don't really need this one, as we guard against it at the start
                case "No postcode query submitted. Remember to include query parameter":
                    postcodeError = PostcodeError.NoPostcode;
                    break;
            }
        }

        return (postcodeError, postcodesIoResponse.PostcodeInfo);
    }
}