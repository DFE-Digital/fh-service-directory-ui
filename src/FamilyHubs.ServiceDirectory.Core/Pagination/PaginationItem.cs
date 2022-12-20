
namespace FamilyHubs.ServiceDirectory.Core.Pagination;

public class PaginationItem<T>
{
    public T? Item { get; }

    // skip (ellipses)
    public PaginationItem()
    {
    }

    public PaginationItem(T item)
    {
        Item = item;
    }

    public bool SkippedPages => Item == null;

    public static IEnumerable<PaginationItem<T>> GetForLargeSet(IEnumerable<T> items, int currentItem)
    {
        var itemArray = items as T[] ?? items.ToArray();
        return Get(itemArray, 1, currentItem - 1, currentItem, currentItem + 1, itemArray.Length);
    }

    public static IEnumerable<PaginationItem<T>> Get(T[] items, params int[] pages)
    {
        var uniquePageNumbers = new HashSet<int>();
        foreach (int page in pages)
        {
            if (page > 0 && page <= items.Length)
            {
                uniquePageNumbers.Add(page);
            }
        }

        int lastPageNumber = 1;
        foreach (var uniquePage in uniquePageNumbers)
        {
            if (uniquePage > lastPageNumber + 1)
            {
                yield return new PaginationItem<T>();
            }

            lastPageNumber = uniquePage;
            yield return new PaginationItem<T>(items[uniquePage-1]);
        }
    }
}