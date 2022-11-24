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

            try
            {
                //todo: throw on 404 (postcode not found), or return null in that case?
                //response.EnsureSuccessStatusCode();
                if (!response.IsSuccessStatusCode)
                {
                    throw new PostcodeIoClientException(response, await response.Content.ReadAsStringAsync(cancellationToken));
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }

            //todo: can't remember when this actually returns null. is it safe to forgive?
            return (await JsonSerializer.DeserializeAsync<PostcodeInfo>(await response.Content.ReadAsStreamAsync(cancellationToken), options: new JsonSerializerOptions { PropertyNameCaseInsensitive = true }, cancellationToken: cancellationToken))!;
        }
    }
}
