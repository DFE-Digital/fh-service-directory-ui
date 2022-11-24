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

        //todo: need to differentiate between 404 (bad postcode in ui) and other errors (service error page)
        public async Task<PostcodeInfo> Get(string postcode, CancellationToken cancellationToken = default)
        {
            //todo: const name
            var httpClient = _httpClientFactory.CreateClient("postcodesio");

            using var response = await httpClient.GetAsync(postcode, HttpCompletionOption.ResponseHeadersRead, cancellationToken);

            response.EnsureSuccessStatusCode();
            //todo: see what the above throws these days. if not enough info, use the below
            //if (!response.IsSuccessStatusCode)
            //{
            //    throw CreateClientException(response, await response.Content.ReadAsStringAsync(cancellationToken));
            //}

            //todo: can't remember when this actually returns null. is it safe to forgive?
            return (await JsonSerializer.DeserializeAsync<PostcodeInfo>(await response.Content.ReadAsStreamAsync(cancellationToken), options: new JsonSerializerOptions { PropertyNameCaseInsensitive = true }))!;
        }
    }
}
