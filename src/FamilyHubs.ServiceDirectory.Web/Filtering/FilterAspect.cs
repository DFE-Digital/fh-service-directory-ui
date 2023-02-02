using FamilyHubs.ServiceDirectory.Web.Filtering.Interfaces;
using System.Diagnostics;

namespace FamilyHubs.ServiceDirectory.Web.Filtering;

//todo: more precise Id description
/// <param name="Id">Taxonomy guid that matches the sub-category in the database.</param>
/// <param name="Name">A friendly name. Used in the URL, so *must* be url safe. *Must* be unique within the category (or sub-category when using FilterSubGroups).</param>
/// <param name="Description">As displayed in the filter panel.</param>
/// <param name="SelectedByDefault">Is the filter auto-selected, when the user first enters the page via the post code search page?</param>
[DebuggerDisplay("{Id}")]
public sealed record FilterAspect(
    string Id,
    string Name,
    string Description,
    bool SelectedByDefault = false) : IFilterAspect;
