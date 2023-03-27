using FamilyHubs.ServiceDirectory.Core.ServiceDirectory.Models;
using FamilyHubs.ServiceDirectory.Shared.Dto;
using FamilyHubs.ServiceDirectory.Web.Filtering.Interfaces;

namespace FamilyHubs.ServiceDirectory.Web.Filtering.Filters;

public class CategoryFilter : FilterSubGroups
{
    public CategoryFilter(IList<TaxonomyDto> categories) : base("category", "Category", new []
    {
        new SubFilter("activities", "Activities, clubs and groups", 
            categories.Where(c => c.ParentId == categories.Single(p => p.Name == "Activities, clubs and groups").Id)
                .Select(ct => new FilterAspect(ct.Id.ToString(), ct.Name))),

        new SubFilter("family-support", "Family support",
            categories.Where(c => c.ParentId == categories.Single(p => p.Name == "Family support").Id)
                .Select(ct => new FilterAspect(ct.Id.ToString(), ct.Name))),

        new SubFilter("health", "Health",
            categories.Where(c => c.ParentId == categories.Single(p => p.Name == "Health").Id)
                .Select(ct => new FilterAspect(ct.Id.ToString(), ct.Name))),

        new SubFilter("pregnancy", "Pregnancy, birth and early years",
            categories.Where(c => c.ParentId == categories.Single(p => p.Name == "Pregnancy, birth and early years").Id)
                .Select(ct => new FilterAspect(ct.Id.ToString(), ct.Name))),

        new SubFilter("send", "Special educational needs and disabilities (SEND) support",
            categories.Where(c =>
                    c.ParentId == categories.Single(p => p.Name == "Special educational needs and disabilities (SEND)").Id)
                .Select(ct => new FilterAspect(ct.Id.ToString(), ct.Name))),

        new SubFilter("transport", "Transport",
            categories.Where(c => c.ParentId == categories.Single(p => p.Name == "Transport").Id)
                .Select(ct => new FilterAspect(ct.Id.ToString(), ct.Name))),
    })
    {
    }

    public override void AddFilterCriteria(IEnumerable<IFilterAspect> selectedAspects, ServicesParams servicesParams)
    {
        servicesParams.TaxonomyIds = selectedAspects.Select(a => a.Id.ToString());
    }
}