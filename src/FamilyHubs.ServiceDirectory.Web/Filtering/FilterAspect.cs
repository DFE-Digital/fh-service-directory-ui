using FamilyHubs.ServiceDirectory.Web.Filtering.Interfaces;
using System.Diagnostics;

namespace FamilyHubs.ServiceDirectory.Web.Filtering;

//todo: more precise Id description
//todo: put name in data- attribute for test
//todo: remove filter-- from id
//todo: allow null name and default to id for name?
/// <param name="Id">The value that the code uses to identify the filter aspect.
/// For sub-categories, it must be the sub-category taxonomy guid from the database.
/// </param>
/// <param name="Name">A friendly name. Used in the URL, so *must* be url safe. *Must* be unique within the category (or sub-category when using FilterSubGroups).</param>
/// <param name="Description">As displayed in the filter panel.</param>
/// <param name="SelectedByDefault">Is the filter auto-selected, when the user first enters the page via the post code search page?</param>
[DebuggerDisplay("{Id}")]
public sealed record FilterAspect(
    string Id,
    string Name,
    string Description,
    bool SelectedByDefault = false) : IFilterAspect;
