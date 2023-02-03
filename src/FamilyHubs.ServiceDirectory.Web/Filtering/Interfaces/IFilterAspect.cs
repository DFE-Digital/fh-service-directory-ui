namespace FamilyHubs.ServiceDirectory.Web.Filtering.Interfaces;

public interface IFilterAspect
{
    /// <summary>
    /// The value that the code uses to identify the filter aspect.
    /// For sub-categories, it must be the sub-category taxonomy guid from the database.
    /// </summary>
    string Id { get; }

    /// <summary>
    /// A friendly name. Used in the URL, so *must* be url safe and mustn't contain ','. Preferably, keep it to alphanumeric and hyphens.
    /// *Must* be unique within the category (or sub-category when using FilterSubGroups).
    /// </summary>
    string? Name { get; }

    /// <summary>
    /// As displayed in the filter panel.
    /// </summary>
    string Description { get; }

    /// <summary>
    /// Is the filter auto-selected, when the user first enters the page via the post code search page?
    /// </summary>
    bool SelectedByDefault { get; }
}