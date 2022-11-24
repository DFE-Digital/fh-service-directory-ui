using System.Net;
using FamilyHubs.ServiceDirectory.Infrastructure.Services.Interfaces;
using System.Text.Json;

namespace FamilyHubs.ServiceDirectory.Infrastructure.Services
{
    public class PostcodesIoClient : IPostcodesIoClient
    {
        private readonly IHttpClientFactory _httpClientFactory;

        public PostcodesIoClient(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
        }

        //todo: important to unit test this
        public async Task<PostcodeInfo?> Get(string postcode, CancellationToken cancellationToken = default)
        {
            //todo: const name
            var httpClient = _httpClientFactory.CreateClient("postcodesio");

            using var response = await httpClient.GetAsync(postcode, HttpCompletionOption.ResponseHeadersRead, cancellationToken);

            switch ((int)response.StatusCode)
            {
                case (int)HttpStatusCode.NotFound:
                    return null;
                case < 200 or > 299:
                    throw new PostcodeIoClientException(response, await response.Content.ReadAsStringAsync(cancellationToken));
            }

            //todo: can't remember when this actually returns null. is it safe to forgive?
            // need to be careful, as returning null here will be interpreted as postcode not found
            return (await JsonSerializer.DeserializeAsync<PostcodeInfo>(
                await response.Content.ReadAsStreamAsync(cancellationToken), 
                cancellationToken: cancellationToken))!;
        }
    }
}
