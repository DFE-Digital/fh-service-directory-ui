using Moq;
using FamilyHubs.ServiceDirectory.Core.Postcode.Model;
using Moq.Protected;
using System.Net;
using FamilyHubs.ServiceDirectory.Infrastructure.Services.PostcodesIo;

namespace FamilyHubs.ServiceDirectory.UnitTests.Infrastructure.Services
{
    public class PostcodeLookupTest
    {
        public Mock<IHttpClientFactory> HttpClientFactory { get; set; }
        public PostcodesIoLookup PostcodesIoLookup { get; set; }

        public PostcodeLookupTest()
        {
            HttpClientFactory = new Mock<IHttpClientFactory>();

            var mockHttpMessageHandler = new Mock<HttpMessageHandler>();
            mockHttpMessageHandler.Protected()
                .Setup<Task<HttpResponseMessage>>("SendAsync", ItExpr.IsAny<HttpRequestMessage>(), ItExpr.IsAny<CancellationToken>())
                .ReturnsAsync(new HttpResponseMessage
                {
                    StatusCode = HttpStatusCode.NotFound,
                    Content = new StringContent("{\"status\":404,\"error\":\"Invalid postcode\"}"),
                });

            var client = new HttpClient(mockHttpMessageHandler.Object)
            {
                BaseAddress = new Uri("https://example.com/")
            };

            HttpClientFactory.Setup(_ => _.CreateClient("postcodesio")).Returns(client);

            PostcodesIoLookup = new PostcodesIoLookup(HttpClientFactory.Object);
        }

        [Theory]
        [InlineData(null)]
        [InlineData("")]
        [InlineData(" ")]
        [InlineData("\t")]
        [InlineData(" \t \t")]
        public async Task Get_NullOrWhitespacePostcode_ReturnsNoPostcode(string? postcode)
        {
            var (postcodeError, _) = await PostcodesIoLookup.Get(postcode);

            Assert.Equal(PostcodeError.NoPostcode, postcodeError);
        }

        [Theory]
        [InlineData(null)]
        [InlineData("")]
        [InlineData(" ")]
        [InlineData("\t")]
        [InlineData(" \t \t")]
        public async Task Get_NullOrWhitespacePostcode_ReturnsNullPostcodeInfo(string? postcode)
        {
            var (_, postcodeInfo) = await PostcodesIoLookup.Get(postcode);

            Assert.Null(postcodeInfo);
        }

        [Theory]
        [InlineData("X")]
        [InlineData("not a postcode")]
        public async Task Get_InvalidPostcode_ReturnsInvalidPostcode(string? postcode)
        {
            var (postcodeError, _) = await PostcodesIoLookup.Get(postcode);

            Assert.Equal(PostcodeError.InvalidPostcode, postcodeError);
        }

        [Theory]
        [InlineData("X")]
        [InlineData("not a postcode")]
        public async Task Get_InvalidPostcode_ReturnsNullPostcodeInfo(string? postcode)
        {
            var (_, postcodeInfo) = await PostcodesIoLookup.Get(postcode);

            Assert.Null(postcodeInfo);
        }

        //todo: tech-debt
        //[Fact]
        //public async Task Get_NotFoundPostcode_ReturnsPostcodeNotFound()
        //{
        //    var (postcodeError, _) = await PostcodesIoLookup.Get("B11BB");

        //    Assert.Equal(PostcodeError.PostcodeNotFound, postcodeError);
        //}

        [Fact]
        public async Task Get_NotFoundPostcode_ReturnsNullPostcodeInfo()
        {
            var (_, postcodeInfo) = await PostcodesIoLookup.Get("B11BB");

            Assert.Null(postcodeInfo);
        }

        //todo: happy path mapping tests
        //todo: "null" response
        //todo: non success and not found status codes
    }
}
