using FamilyHubs.ServiceDirectory.Web.Filtering.Interfaces;

namespace FamilyHubs.ServiceDirectory.Web.Filtering;

public abstract class FilterOptionalSelect : Filter, IFilterOptionalSelect
{
    public bool IsOptionSelected { get; }
    public string OptionDescription { get; }
    public string SelectDescription { get; }
    public string OptionSelectedName { get; }

    protected FilterOptionalSelect(
        string name,
        string description,
        string optionDescription,
        string selectDescription,
        IEnumerable<IFilterAspect> aspects,
        bool optionSelectedByDefault = false)
        : base(name, description, "_OptionalSelect", aspects)
    {
        OptionDescription = optionDescription;
        SelectDescription = selectDescription;
        IsOptionSelected = optionSelectedByDefault;
        OptionSelectedName = $"{Name}{IFilterOptionalSelect.OptionSelectedPostfix}";
    }

    public override IFilterOptionalSelect ToPostFilter(IQueryCollection query)
    {
        return new PostFilterOptionalSelect(this, query);
    }
}