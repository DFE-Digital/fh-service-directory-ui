using FamilyHubs.ServiceDirectory.Core.ServiceDirectory.Models;
using FamilyHubs.ServiceDirectory.Web.Filtering.Interfaces;

namespace FamilyHubs.ServiceDirectory.Web.Filtering;

public abstract class Filter : IFilter
{
    protected const string CheckboxesPartialName = "_Checkboxes";
    protected const string RadiosPartialName = "_Radios";

    public string Name { get; }
    public string Description { get; }
    public string PartialName { get; }
    public IEnumerable<IFilterAspect> Aspects { get; }
    public IEnumerable<string> Values { get; }

    private readonly IFilterAspect[] _selectedFilterAspects;

    protected Filter(string name, string description, string partialName, IEnumerable<IFilterAspect> aspects)
    {
        Name = name;
        Description = description;
        PartialName = partialName;
        Aspects = aspects;

        _selectedFilterAspects = Aspects.Where(a => a.SelectedByDefault).ToArray();

        Values = _selectedFilterAspects.Select(a => a.Value);
    }

    public virtual IFilter Apply(IQueryCollection query)
    {
        return new AppliedFilter(this, query);
    }

    public IEnumerable<IFilterAspect> SelectedAspects => _selectedFilterAspects;

    public bool IsSelected(IFilterAspect aspect)
    {
        return aspect.SelectedByDefault;
    }

    public void AddFilterCriteria(ServicesParams servicesParams)
    {
        AddFilterCriteria(SelectedAspects, servicesParams);
    }

    public abstract void AddFilterCriteria(IEnumerable<IFilterAspect> selectedAspects, ServicesParams servicesParams);
}