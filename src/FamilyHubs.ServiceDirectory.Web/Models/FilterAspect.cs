using FamilyHubs.ServiceDirectory.Web.Models.Interfaces;
using System.Diagnostics;

namespace FamilyHubs.ServiceDirectory.Web.Models;

//todo: selected can't be here if static
[DebuggerDisplay("{Id}")]
public sealed record FilterAspect(string Id, string Description, bool Selected = false) : IFilterAspect;
