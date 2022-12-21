using FamilyHubs.ServiceDirectory.Core.Pagination.Interfaces;

namespace FamilyHubs.ServiceDirectory.Core.Pagination;

public class DontShowPagination : IPagination
{
    public IEnumerable<PaginationItem> PaginationItems => Enumerable.Empty<PaginationItem>();
    public bool Show => false;
    public int? TotalPages { get; }
    public int? CurrentPage { get; }
    public int? PreviousPage { get; }
    public int? NextPage { get; }
}