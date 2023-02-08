using FamilyHubs.ServiceDirectory.Web.Filtering.Interfaces;

namespace FamilyHubs.ServiceDirectory.Web.Filtering;

public class AppliedFilterOptionalSelect : AppliedFilter, IFilterOptionalSelect
{
    public bool IsOptionSelected { get; }
    public string OptionDescription => ((IFilterOptionalSelect)Filter).OptionDescription;
    public string SelectDescription => ((IFilterOptionalSelect)Filter).SelectDescription;
    public string OptionSelectedName { get; }

    public AppliedFilterOptionalSelect(IFilterOptionalSelect filter, IQueryCollection query)
        : base(filter, query)
    {
        OptionSelectedName = $"{filter.Name}{IFilterOptionalSelect.OptionSelectedPostfix}";

        var isOptionSelectedStr = query[OptionSelectedName];
        bool.TryParse(isOptionSelectedStr, out var isOptionSelected);
        IsOptionSelected = isOptionSelected;

        if (!IsOptionSelected)
        {
            SelectedAspects = Array.Empty<IFilterAspect>();
        }
    }
}