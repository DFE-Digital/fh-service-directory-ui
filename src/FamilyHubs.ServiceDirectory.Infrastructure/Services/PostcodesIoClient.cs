using System.Net;
using FamilyHubs.ServiceDirectory.Infrastructure.Services.Interfaces;
using System.Text.Json;

namespace FamilyHubs.ServiceDirectory.Infrastructure.Services
{
    public class PostcodesIoClient : IPostcodesIoClient
    {
        private readonly IHttpClientFactory _httpClientFactory;
        internal const string HttpClientName = "postcodesio";

        public PostcodesIoClient(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
        }

        //todo: important to unit test this
        public async Task<(PostcodeError, PostcodeInfo?)> Get(string? postcode, CancellationToken cancellationToken = default)
        {
            if (string.IsNullOrWhiteSpace(postcode))
                return (PostcodeError.NoPostcode, null);

            var httpClient = _httpClientFactory.CreateClient(HttpClientName);

            using var response = await httpClient.GetAsync(postcode, HttpCompletionOption.ResponseHeadersRead, cancellationToken);

            if (!response.IsSuccessStatusCode && response.StatusCode != HttpStatusCode.NotFound)
                throw new PostcodeIoClientException(response, await response.Content.ReadAsStringAsync(cancellationToken));

            //todo: can't remember when this actually returns null. is it safe to forgive?
            // need to be careful, as returning null here will be interpreted as postcode not found
            var postcodesIoResponse = await JsonSerializer.DeserializeAsync<PostcodesIoResponse>(
                await response.Content.ReadAsStreamAsync(cancellationToken), 
                cancellationToken: cancellationToken);

            if (postcodesIoResponse is null)
            {
                //todo:
                throw new NotImplementedException();
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
}
