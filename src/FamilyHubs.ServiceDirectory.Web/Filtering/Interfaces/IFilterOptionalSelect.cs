namespace FamilyHubs.ServiceDirectory.Web.Filtering.Interfaces
{
    public interface IFilterOptionalSelect : IFilter
    {
        bool IsOptionSelected { get; }
        string OptionDescription { get; }
        string SelectDescription { get; }
    }
}
