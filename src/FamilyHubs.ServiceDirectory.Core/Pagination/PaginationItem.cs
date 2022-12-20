
namespace FamilyHubs.ServiceDirectory.Core.Pagination;

public class PaginationItem
{
    public int? Page { get; }

    // skip (ellipses)
    public PaginationItem()
    {
    }

    public PaginationItem(int page)
    {
        Page = page;
    }

    public bool SkippedPages => Page == null;

    //todo: current page & next & previous

    public static IEnumerable<PaginationItem> GetForLargeSet(int totalPages, int currentPage)
    {
        return Get(totalPages, 1, currentPage - 1, currentPage, currentPage + 1, totalPages);
    }

    public static IEnumerable<PaginationItem> Get(int totalPages, params int[] pages)
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
            yield return new PaginationItem(uniquePage-1);
        }
    }
}