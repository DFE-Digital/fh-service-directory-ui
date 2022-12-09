using FamilyHubs.ServiceDirectory.Web.Filtering.Interfaces;
using System.Diagnostics;

namespace FamilyHubs.ServiceDirectory.Web.Filtering;

[DebuggerDisplay("{Id}")]
public sealed record FilterAspect(string Id, string Description, bool SelectedByDefault = false) : IFilterAspect;
