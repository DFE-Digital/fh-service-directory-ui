using System.Text.Json.Serialization;
using FamilyHubs.ServiceDirectory.Core.Postcode.Model;
using FamilyHubs.SharedKernel;
using Newtonsoft.Json;

namespace FamilyHubs.ServiceDirectory.Infrastructure.Services.PostcodesIo;

public sealed class PostcodesIoResponse
{
    [JsonProperty("status")]
    public int Status { get; set; }

    [JsonProperty("error")]
    public string? Error { get; set; }

    [JsonProperty("result")]
    public PostcodeInfo Result { get; set; } = default!;
}
