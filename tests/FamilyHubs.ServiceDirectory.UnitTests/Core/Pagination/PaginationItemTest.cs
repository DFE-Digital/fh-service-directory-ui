using FamilyHubs.ServiceDirectory.Core.Pagination;
using FluentAssertions;

namespace FamilyHubs.ServiceDirectory.UnitTests.Core.Pagination;

public class PaginationItemTests
{
    [Theory, MemberData(nameof(Data))]
    public void Get(int count, int current, IEnumerable<PaginationItem<int>> expected)
    {
        var pages = Enumerable.Range(1, count);

        var actual = PaginationItem<int>.GetForLargeSet(pages, current);

        actual.Should().BeEquivalentTo(expected);
    }

    //todo: add current flag to pagination item
    public static IEnumerable<object[]> Data =>
        new List<object[]>
        {
            new object[] {0, 1, GenerateExpected()},
            new object[] {1, 1, GenerateExpected(1)},
            new object[] {2, 1, GenerateExpected(1, 2)},
            new object[] {2, 2, GenerateExpected(1, 2)},
            new object[] {3, 1, GenerateExpected(1, 2, 3)},
            new object[] {3, 2, GenerateExpected(1, 2, 3)},
            new object[] {3, 3, GenerateExpected(1, 2, 3)},
            new object[] {4, 1, GenerateExpected(1, 2, null, 4)},
            new object[] {7, 4, GenerateExpected(1, null, 3, 4, 5, null, 7)}
        };

    public static IEnumerable<PaginationItem<int>> GenerateExpected(params int?[] pages)
    {
        return pages.Select(p => p == null ? new PaginationItem<int>() : new PaginationItem<int>(p.Value));
    }
}