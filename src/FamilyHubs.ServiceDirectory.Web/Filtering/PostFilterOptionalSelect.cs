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

        //todo: const for remove param
        string remove = query["remove"].ToString();

        // assumes single selection (and only the selected item can be removed)
        if (remove == IFilter.RemoveAll || remove.StartsWith(Filter.Name))
        {
            IsOptionSelected = false;
        }
        else
        {
            var isOptionSelectedStr = query[OptionSelectedName];
            bool.TryParse(isOptionSelectedStr, out var isOptionSelected);
            IsOptionSelected = isOptionSelected;
        }

        // we _could_ remember the selection when the option isn't selected, but not have it as an active selection
        if (!IsOptionSelected)
        {
            Values = Enumerable.Empty<string>();
            SelectedAspects = Array.Empty<IFilterAspect>();
        }
    }
}