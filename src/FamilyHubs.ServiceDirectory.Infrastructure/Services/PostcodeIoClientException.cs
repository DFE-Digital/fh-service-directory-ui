using System.Net;
using System.Runtime.Serialization;

namespace FamilyHubs.ServiceDirectory.Infrastructure.Services
{
    // at some point we might want a more generic HttpClientException / RestHttpClientException
//#pragma warning disable S3925
    [Serializable]
    public class PostcodeIoClientException : Exception
    {
        public HttpStatusCode? StatusCode { get; }
        public string? ReasonPhrase { get; }
        public Uri? RequestUri { get; }
        public string? ErrorResponse { get; }

        public PostcodeIoClientException(HttpResponseMessage httpResponseMessage, string errorResponse)
            : base(GenerateMessage(httpResponseMessage, errorResponse))
        {
            StatusCode = httpResponseMessage.StatusCode;
            ReasonPhrase = httpResponseMessage.ReasonPhrase;
            //todo: when is RequestMessage null?
            RequestUri = httpResponseMessage.RequestMessage!.RequestUri;
            ErrorResponse = errorResponse;
        }

        protected PostcodeIoClientException(SerializationInfo info, StreamingContext context)
            : base(info, context)
        {
        }

        public override void GetObjectData(SerializationInfo info, StreamingContext context)
        {
            base.GetObjectData(info, context);

            info.AddValue("Message", StatusCode, typeof(HttpStatusCode?)); // Do not rename (binary serialization)
            info.AddValue("ReasonPhrase", ReasonPhrase, typeof(string)); // Do not rename (binary serialization)
            info.AddValue("RequestUri", RequestUri, typeof(Uri)); // Do not rename (binary serialization)
            info.AddValue("ErrorResponse", ErrorResponse, typeof(string)); // Do not rename (binary serialization)
        }

        private static string GenerateMessage(HttpResponseMessage httpResponseMessage, string errorResponse)
        {
            //todo: when is RequestMessage null?
            return $@"Request '{httpResponseMessage.RequestMessage?.RequestUri}'
                    returned {(int)httpResponseMessage.StatusCode} {httpResponseMessage.ReasonPhrase}
                    Response: {errorResponse}";
        }
    }
}