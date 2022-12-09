using FamilyHubs.ServiceDirectory.Web.Filtering.Interfaces;

namespace FamilyHubs.ServiceDirectory.Web.Filtering;

public class PostFilterOptionalSelect : PostFilter, IFilterOptionalSelect
{
    public bool IsOptionSelected { get; }
    public string OptionDescription => ((IFilterOptionalSelect)Filter).OptionDescription;
    public string SelectDescription => ((IFilterOptionalSelect)Filter).SelectDescription;

    public PostFilterOptionalSelect(IFilterOptionalSelect filter, IFormCollection form, string? remove)
        : base(filter, form, remove)
    {
        //todo: const
        var isOptionSelectedStr = form[$"{filter.Name}-option-selected"];
        bool.TryParse(isOptionSelectedStr, out var isOptionSelected);
        IsOptionSelected = isOptionSelected;

        //todo: we _could_ remember the selection when the option isn't selected, but not have it as an active selection
        if (!IsOptionSelected)
        {
            Values = Enumerable.Empty<string>();
            SelectedAspects = Array.Empty<IFilterAspect>();
        }
    }
}