using FamilyHubs.ServiceDirectory.Web.Filtering.Interfaces;

namespace FamilyHubs.ServiceDirectory.Web.Filtering;

public class PostFilterOptionalSelect : PostFilter, IFilterOptionalSelect
{
    public bool IsOptionSelected => ((IFilterOptionalSelect) Filter).IsOptionSelected;
    public string OptionDescription => ((IFilterOptionalSelect)Filter).OptionDescription;
    public string SelectDescription => ((IFilterOptionalSelect)Filter).SelectDescription;

    public PostFilterOptionalSelect(IFilterOptionalSelect filter, IFormCollection form, string? remove)
        : base(filter, form, remove)
    {
    }
}