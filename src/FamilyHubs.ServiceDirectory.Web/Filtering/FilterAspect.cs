using FamilyHubs.ServiceDirectory.Web.Filtering.Interfaces;
using System.Diagnostics;

namespace FamilyHubs.ServiceDirectory.Web.Filtering;

//todo: more precise Id description
//todo: put name in data- attribute for test
//todo: allow null name and default to id for name?
[DebuggerDisplay("{Id}")]
public sealed record FilterAspect(
    string Id,
    string Description,
    string? Name = null,
    bool SelectedByDefault = false) : IFilterAspect
{
    public string Value => Name ?? Id;
}
