using System.Text.Json.Serialization;
using FamilyHubs.ServiceDirectory.Core.Postcode.Model;

namespace FamilyHubs.ServiceDirectory.Infrastructure.Services.PostcodesIo;

//todo: can we flatten the result during deserialization?
public sealed record PostcodesIoResponse(
    [property: JsonPropertyName("error")] string? Error,
    [property: JsonPropertyName("result")] PostcodeInfo PostcodeInfo);
