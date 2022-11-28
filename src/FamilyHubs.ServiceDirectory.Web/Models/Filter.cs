using FamilyHubs.ServiceDirectory.Web.Models.Interfaces;

namespace FamilyHubs.ServiceDirectory.Web.Models;

public record Filter(string Name, string Description, IEnumerable<IFilterAspect> Aspects);

//todo: temp
#pragma warning disable

//public class Filter
//{
//    public string Name { get; }
//    public string Description { get; }
//    /// <summary>
//    /// Guaranteed in ascending Order order
//    /// </summary>
//    public IEnumerable<IFilterAspect> Aspects { get; }

//    public Filter(string name, string description, IEnumerable<IFilterAspect> aspects)
//    {
//        Name = name;
//        Description = description;
//        Aspects = aspects;
//    }
//}