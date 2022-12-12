using FamilyHubs.ServiceDirectory.Web.Filtering.Interfaces;

namespace FamilyHubs.ServiceDirectory.Web.Filtering;

//todo: really, should be an ifilter sub option on checkbox (filtertype)
//todo: FilterSelect with optional flag as to whether needs checkbox
public class FilterOptionalSelect : Filter, IFilterOptionalSelect
{
    public bool IsOptionSelected { get; }
    public string OptionDescription { get; }
    public string SelectDescription { get; }
    public string OptionSelectedName { get; }

    public FilterOptionalSelect(
        string name,
        string description,
        string optionDescription,
        string selectDescription,
        IEnumerable<IFilterAspect> aspects,
        bool optionSelectedByDefault = false)
        : base(name, description, FilterType.Select, aspects)
    {
        OptionDescription = optionDescription;
        SelectDescription = selectDescription;
        IsOptionSelected = optionSelectedByDefault;
        OptionSelectedName = $"{Name}{IFilterOptionalSelect.OptionSelectedPostfix}";
    }

    public override IFilterOptionalSelect ToPostFilter(IFormCollection form, string? remove)
    {
        return new PostFilterOptionalSelect(this, form, remove);
    }
}