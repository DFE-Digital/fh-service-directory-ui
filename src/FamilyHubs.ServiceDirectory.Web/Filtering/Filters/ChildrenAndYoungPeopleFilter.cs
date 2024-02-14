using FamilyHubs.ServiceDirectory.Core.ServiceDirectory.Models;
using FamilyHubs.ServiceDirectory.Web.Filtering.Interfaces;

namespace FamilyHubs.ServiceDirectory.Web.Filtering.Filters;

public class ChildrenAndYoungPeopleFilter : FilterOptionalSelect
{
    public const string ChildrenAndYoungPeopleAllId = "all";

    public ChildrenAndYoungPeopleFilter() : base("children_and_young", "Children and young people",
        "For children and young people", "Age", new IFilterAspect[]
        {
            new FilterAspect(ChildrenAndYoungPeopleAllId, "All ages"),
            new FilterAspect("0", "0 to 12 months"),
            new FilterAspect("1", "1 year old"),
            new FilterAspect("2", "2 year old"),
            new FilterAspect("3", "3 year old"),
            new FilterAspect("4", "4 year old"),
            new FilterAspect("5", "5 year old"),
            new FilterAspect("6", "6 year old"),
            new FilterAspect("7", "7 year old"),
            new FilterAspect("8", "8 year old"),
            new FilterAspect("9", "9 year old"),
            new FilterAspect("10", "10 year old"),
            new FilterAspect("11", "11 year old"),
            new FilterAspect("12", "12 year old"),
            new FilterAspect("13", "13 year old"),
            new FilterAspect("14", "14 year old"),
            new FilterAspect("15", "15 year old"),
            new FilterAspect("16", "16 year old"),
            new FilterAspect("17", "17 year old"),
            new FilterAspect("18", "18 year old"),
            new FilterAspect("19", "19 year old"),
            new FilterAspect("20", "20 year old"),
            new FilterAspect("21", "21 year old"),
            new FilterAspect("22", "22 year old"),
            new FilterAspect("23", "23 year old"),
            new FilterAspect("24", "24 year old"),
            new FilterAspect("25", "25 year old")
        })
    {
    }

    public override void AddFilterCriteria(IEnumerable<IFilterAspect> selectedAspects, ServicesParams servicesParams)
    {
        var childFilterAspect = selectedAspects.FirstOrDefault();
        if (childFilterAspect != null)
        {
            if (childFilterAspect.Id == ChildrenAndYoungPeopleAllId)
            {
                servicesParams.AllChildrenYoungPeople = true;
            }
            else
            {
                servicesParams.GivenAge = int.Parse(childFilterAspect.Id);
            }
        }
    }
}