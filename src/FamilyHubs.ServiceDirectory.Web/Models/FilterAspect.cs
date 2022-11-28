using FamilyHubs.ServiceDirectory.Web.Models.Interfaces;
using System.Diagnostics;

namespace FamilyHubs.ServiceDirectory.Web.Models;

[DebuggerDisplay("{Id}")]
public record FilterAspect(string Id, string Description, bool Selected = false) : IFilterAspect;

//todo: temp
#pragma warning disable

//[DebuggerDisplay("{Id}")]
//public class FilterAspect : IFilterAspect
//{
//    public string Id { get; }
//    public string Description { get; }
//    public bool Selected { get; }

//    public FilterAspect(string id, string description, bool selected = false)
//    {
//        Id = id;
//        Description = description;
//        Selected = selected;
//    }
//}