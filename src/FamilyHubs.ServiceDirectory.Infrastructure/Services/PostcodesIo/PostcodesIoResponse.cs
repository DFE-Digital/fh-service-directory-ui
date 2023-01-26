using System.Text.Json.Serialization;
using FamilyHubs.ServiceDirectory.Core.Postcode.Model;

namespace FamilyHubs.ServiceDirectory.Infrastructure.Services.PostcodesIo;

public sealed class PostcodesIoResponse
{
    [JsonPropertyName("error")]
    public string? Error { get; set; }

    [JsonPropertyName("result")]
    public PostcodeInfo PostcodeInfo { get; set; } = default!;
}
