namespace FamilyHubs.ServiceDirectory.Core.Postcode.Model;

public enum PostcodeError
{
    /// <summary>
    /// Postcode was found
    /// </summary>
    None,
    /// <summary>
    /// No postcode supplied
    /// </summary>
    NoPostcode,
    /// <summary>
    /// Postcode in an invalid format
    /// </summary>
    InvalidPostcode,
    /// <summary>
    /// Postcode is in a valid format, but not found
    /// </summary>
    PostcodeNotFound
}