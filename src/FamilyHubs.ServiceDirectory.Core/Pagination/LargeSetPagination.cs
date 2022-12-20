
namespace FamilyHubs.ServiceDirectory.Core.Pagination;

public interface IPagination
{
    IEnumerable<PaginationItem> PaginationItems { get; }
    bool Show { get; }
    int? PreviousPage { get; }
    int? NextPage { get; }
}

public class LargeSetPagination : IPagination
{
    public IEnumerable<PaginationItem> PaginationItems { get; }

    public bool Show { get; }
    public int? PreviousPage { get; }
    public int? NextPage { get; }

    public LargeSetPagination(int totalPages, int currentPage)
    {
        Show = totalPages > 1;
        if (!Show)
        {
            PaginationItems = Enumerable.Empty<PaginationItem>();
            return;
        }

        PaginationItems = GetPaginationItems(totalPages, currentPage, 1, currentPage - 1, currentPage, currentPage + 1, totalPages);
        PreviousPage = currentPage > 1 ? currentPage-1 : null;
        NextPage = currentPage < totalPages ? currentPage + 1 : null;
    }

    public static IEnumerable<PaginationItem> GetPaginationItems(int totalPages, int currentPage, params int[] pages)
    {
        var uniquePageNumbers = new HashSet<int>();
        foreach (int page in pages)
        {
            if (page > 0 && page <= totalPages)
            {
                uniquePageNumbers.Add(page);
            }
        }

        int lastPageNumber = 1;
        foreach (var uniquePage in uniquePageNumbers)
        {
            if (uniquePage > lastPageNumber + 1)
            {
                yield return new PaginationItem();
            }

            lastPageNumber = uniquePage;
            yield return new PaginationItem(uniquePage, uniquePage == currentPage);
        }
    }
}