namespace FamilyHubs.ServiceDirectory.Web.Filtering.Interfaces
{
    public interface IFilterOptionalSelect : IFilter
    {
        const string OptionSelectedPostfix = "-option-selected";

        bool IsOptionSelected { get; }
        string OptionDescription { get; }
        string SelectDescription { get; }
        string OptionSelectedName { get; }
    }
}
