using FamilyHubs.ServiceDirectory.Web.Filtering.Interfaces;

namespace FamilyHubs.ServiceDirectory.Web.Filtering;

public class PostFilterOptionalSelect : PostFilter, IFilterOptionalSelect
{
    public bool IsOptionSelected { get; }
    public string OptionDescription => ((IFilterOptionalSelect)Filter).OptionDescription;
    public string SelectDescription => ((IFilterOptionalSelect)Filter).SelectDescription;
    public string OptionSelectedName { get; }

    public PostFilterOptionalSelect(IFilterOptionalSelect filter, IQueryCollection query)
        : base(filter, query)
    {
        OptionSelectedName = $"{filter.Name}{IFilterOptionalSelect.OptionSelectedPostfix}";

        var isOptionSelectedStr = query[OptionSelectedName];
        bool.TryParse(isOptionSelectedStr, out var isOptionSelected);
        IsOptionSelected = isOptionSelected;

        //todo: we _could_ remember the selection when the option isn't selected, but not have it as an active selection
        if (!IsOptionSelected)
        {
            SelectedAspects = Array.Empty<IFilterAspect>();
        }
    }
}