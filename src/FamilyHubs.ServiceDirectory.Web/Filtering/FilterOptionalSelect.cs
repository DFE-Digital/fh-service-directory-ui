using FamilyHubs.ServiceDirectory.Web.Filtering.Interfaces;

namespace FamilyHubs.ServiceDirectory.Web.Filtering;

// notes:
// * really, should be an ifilter sub-option on checkbox (filtertype)
// * we could add have FilterSelect with an optional flag (as to whether needs checkbox), but there's no requirement for on atm
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

    public override IFilterOptionalSelect ToPostFilter(IQueryCollection query, string? remove)
    {
        return new PostFilterOptionalSelect(this, query, remove);
    }
}