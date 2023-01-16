using FamilyHubs.ServiceDirectory.Web.Filtering;
using FamilyHubs.ServiceDirectory.Web.Filtering.Interfaces;
using Microsoft.AspNetCore.Http;
using Moq;

namespace FamilyHubs.ServiceDirectory.UnitTests.Web.Filtering;

// xunit test for PostFilterOptionalSelect in the style of lazcool
// 
public class PostFilterOptionalSelectTest
{
    public Mock<IFilterOptionalSelect> FilterOptionalSelect { get; set; }
    public Mock<IFormCollection> Form { get; set; }
    public string? Remove { get; set; }

    public PostFilterOptionalSelectTest()
    {
        FilterOptionalSelect = new Mock<IFilterOptionalSelect>();
        FilterOptionalSelect.SetupGet(x => x.Name).Returns("TestFilter");
        Form = new Mock<IFormCollection>();
    }

    // xunit test for PostFilterOptionalSelect constructor
    [Fact]
    public void PostFilterOptionalSelectConstructorTest()
    {
        // arrange
        var remove = "remove";

        // act
        var postFilterOptionalSelect = new PostFilterOptionalSelect(FilterOptionalSelect.Object, Form.Object, remove);

        // assert
        Assert.Equal(FilterOptionalSelect.Object.Name, postFilterOptionalSelect.Name);
        Assert.Equal(FilterOptionalSelect.Object.Description, postFilterOptionalSelect.Description);
        Assert.Equal(FilterOptionalSelect.Object.FilterType, postFilterOptionalSelect.FilterType);
        Assert.Equal(FilterOptionalSelect.Object.Aspects, postFilterOptionalSelect.Aspects);
        Assert.Equal(Array.Empty<IFilterAspect>(), postFilterOptionalSelect.SelectedAspects);
        Assert.Equal(Enumerable.Empty<string>(), postFilterOptionalSelect.Values);
    }

    // xunit test for PostFilterOptionalSelect constructor with null remove
    // 
    [Fact]
    public void PostFilterOptionalSelectConstructorWithNullRemoveTest()
    {
        // arrange
        var filter = new Mock<IFilterOptionalSelect>();
        var form = new Mock<IFormCollection>();
        string? remove = null;

        // act
        var postFilterOptionalSelect = new PostFilterOptionalSelect(filter.Object, form.Object, remove);

        // assert
        Assert.Equal(filter.Object.Name, postFilterOptionalSelect.Name);
        Assert.Equal(filter.Object.Description, postFilterOptionalSelect.Description);
        Assert.Equal(filter.Object.FilterType, postFilterOptionalSelect.FilterType);
        Assert.Equal(filter.Object.Aspects, postFilterOptionalSelect.Aspects);
        Assert.Equal(Array.Empty<IFilterAspect>(), postFilterOptionalSelect.SelectedAspects);
        Assert.Equal(Enumerable.Empty<string>(), postFilterOptionalSelect.Values);
    }

    // xunit test for PostFilterOptionalSelect constructor with empty remove
    // 
    [Fact]
    public void PostFilterOptionalSelectConstructorWithEmptyRemoveTest()
    {
        // arrange
        var filter = new Mock<IFilterOptionalSelect>();
        var form = new Mock<IFormCollection>();
        var remove = string.Empty;

        // act
        var postFilterOptionalSelect = new PostFilterOptionalSelect(filter.Object, form.Object, remove);

        // assert
        Assert.Equal(filter.Object.Name, postFilterOptionalSelect.Name);
        Assert.Equal(filter.Object.Description, postFilterOptionalSelect.Description);
        // continue here
        Assert.Equal(filter.Object.FilterType, postFilterOptionalSelect.FilterType);
        Assert.Equal(filter.Object.Aspects, postFilterOptionalSelect.Aspects);
        Assert.Equal(Array.Empty<IFilterAspect>(), postFilterOptionalSelect.SelectedAspects);
        Assert.Equal(Enumerable.Empty<string>(), postFilterOptionalSelect.Values);
    }

    // xunit test for PostFilterOptionalSelect constructor with remove that starts with filter name
    [Fact]
    public void PostFilterOptionalSelectConstructorWithRemoveThatStartsWithFilterNameTest()
    {
        // arrange
        var filter = new Mock<IFilterOptionalSelect>();
        var form = new Mock<IFormCollection>();
        var remove = $"{filter.Object.Name}remove";

        // act
        var postFilterOptionalSelect = new PostFilterOptionalSelect(filter.Object, form.Object, remove);

        // assert
        Assert.Equal(filter.Object.Name, postFilterOptionalSelect.Name);
        Assert.Equal(filter.Object.Description, postFilterOptionalSelect.Description);
        Assert.Equal(filter.Object.FilterType, postFilterOptionalSelect.FilterType);
        Assert.Equal(filter.Object.Aspects, postFilterOptionalSelect.Aspects);
        Assert.Equal(Array.Empty<IFilterAspect>(), postFilterOptionalSelect.SelectedAspects);
        Assert.Equal(Enumerable.Empty<string>(), postFilterOptionalSelect.Values);
    }

    // xunit test for PostFilterOptionalSelect constructor with remove that does not start with filter name
    [Fact]
    public void PostFilterOptionalSelectConstructorWithRemoveThatDoesNotStartWithFilterNameTest()
    {
        // arrange
        var filter = new Mock<IFilterOptionalSelect>();
        var form = new Mock<IFormCollection>();
        var remove = $"remove{filter.Object.Name}";

        // act
        var postFilterOptionalSelect = new PostFilterOptionalSelect(filter.Object, form.Object, remove);

        // assert
        Assert.Equal(filter.Object.Name, postFilterOptionalSelect.Name);
        Assert.Equal(filter.Object.Description, postFilterOptionalSelect.Description);
        Assert.Equal(filter.Object.FilterType, postFilterOptionalSelect.FilterType);
        Assert.Equal(filter.Object.Aspects, postFilterOptionalSelect.Aspects);
        Assert.Equal(Array.Empty<IFilterAspect>(), postFilterOptionalSelect.SelectedAspects);
        Assert.Equal(Enumerable.Empty<string>(), postFilterOptionalSelect.Values);
    }

    // xunit test for PostFilterOptionalSelect constructor with remove that is filter name
    [Fact]
    public void PostFilterOptionalSelectConstructorWithRemoveThatIsFilterNameTest()
    {
        // arrange
        var filter = new Mock<IFilterOptionalSelect>();
        var form = new Mock<IFormCollection>();
        var remove = filter.Object.Name;

        // act
        var postFilterOptionalSelect = new PostFilterOptionalSelect(filter.Object, form.Object, remove);

        // assert
        Assert.Equal(filter.Object.Name, postFilterOptionalSelect.Name);
        Assert.Equal(filter.Object.Description, postFilterOptionalSelect.Description);
        Assert.Equal(filter.Object.FilterType, postFilterOptionalSelect.FilterType);
        Assert.Equal(filter.Object.Aspects, postFilterOptionalSelect.Aspects);
        Assert.Equal(Array.Empty<IFilterAspect>(), postFilterOptionalSelect.SelectedAspects);
        Assert.Equal(Enumerable.Empty<string>(), postFilterOptionalSelect.Values);
    }

    // xunit test for PostFilterOptionalSelect constructor with remove that is filter name with spaces
    [Fact]
    public void PostFilterOptionalSelectConstructorWithRemoveThatIsFilterNameWithSpacesTest()
    {
        // arrange
        var filter = new Mock<IFilterOptionalSelect>();
        var form = new Mock<IFormCollection>();
        var remove = $" {filter.Object.Name} ";

        // act
        var postFilterOptionalSelect = new PostFilterOptionalSelect(filter.Object, form.Object, remove);

        // assert
        Assert.Equal(filter.Object.Name, postFilterOptionalSelect.Name);
        Assert.Equal(filter.Object.Description, postFilterOptionalSelect.Description);
        Assert.Equal(filter.Object.FilterType, postFilterOptionalSelect.FilterType);
        Assert.Equal(filter.Object.Aspects, postFilterOptionalSelect.Aspects);
        Assert.Equal(Array.Empty<IFilterAspect>(), postFilterOptionalSelect.SelectedAspects);
        Assert.Equal(Enumerable.Empty<string>(), postFilterOptionalSelect.Values);
    }

    // xunit test for PostFilterOptionalSelect constructor with remove that is filter name with spaces and other characters
    [Fact]
    public void PostFilterOptionalSelectConstructorWithRemoveThatIsFilterNameWithSpacesAndOtherCharactersTest()
    {
        // arrange
        var filter = new Mock<IFilterOptionalSelect>();
        var form = new Mock<IFormCollection>();
        var remove = $" {filter.Object.Name}!@#$%^&*()_+ ";

        // act
        var postFilterOptionalSelect = new PostFilterOptionalSelect(filter.Object, form.Object, remove);

        // assert
        Assert.Equal(filter.Object.Name, postFilterOptionalSelect.Name);
        Assert.Equal(filter.Object.Description, postFilterOptionalSelect.Description);
        Assert.Equal(filter.Object.FilterType, postFilterOptionalSelect.FilterType);
        Assert.Equal(filter.Object.Aspects, postFilterOptionalSelect.Aspects);
        Assert.Equal(Array.Empty<IFilterAspect>(), postFilterOptionalSelect.SelectedAspects);
        Assert.Equal(Enumerable.Empty<string>(), postFilterOptionalSelect.Values);
    }

    // xunit test for PostFilterOptionalSelect constructor with remove that is filter name with spaces and other characters and is not equal to filter name
    [Fact]
    public void PostFilterOptionalSelectConstructorWithRemoveThatIsFilterNameWithSpacesAndOtherCharactersAndIsNotEqualToFilterNameTest()
    {
        // arrange
        var filter = new Mock<IFilterOptionalSelect>();
        var form = new Mock<IFormCollection>();
        var remove = $" {filter.Object.Name}!@#$%^&*()_+remove ";

        // act
        var postFilterOptionalSelect = new PostFilterOptionalSelect(filter.Object, form.Object, remove);

        // assert
        Assert.Equal(filter.Object.Name, postFilterOptionalSelect.Name);
        Assert.Equal(filter.Object.Description, postFilterOptionalSelect.Description);
        Assert.Equal(filter.Object.FilterType, postFilterOptionalSelect.FilterType);
        Assert.Equal(filter.Object.Aspects, postFilterOptionalSelect.Aspects);
        Assert.Equal(Array.Empty<IFilterAspect>(), postFilterOptionalSelect.SelectedAspects);
        Assert.Equal(Enumerable.Empty<string>(), postFilterOptionalSelect.Values);
    }

    // xunit test for PostFilterOptionalSelect constructor with remove that is filter name with spaces and other characters and is equal to filter name
    [Fact]
    public void PostFilterOptionalSelectConstructorWithRemoveThatIsFilterNameWithSpacesAndOtherCharactersAndIsEqualToFilterNameTest()
    {
        // arrange
        var filter = new Mock<IFilterOptionalSelect>();
        var form = new Mock<IFormCollection>();
        var remove = $" {filter.Object.Name}!@#$%^&*()_+{filter.Object.Name} ";

        // act
        var postFilterOptionalSelect = new PostFilterOptionalSelect(filter.Object, form.Object, remove);

        // assert
        Assert.Equal(filter.Object.Name, postFilterOptionalSelect.Name);
        Assert.Equal(filter.Object.Description, postFilterOptionalSelect.Description);
        Assert.Equal(filter.Object.FilterType, postFilterOptionalSelect.FilterType);
        Assert.Equal(filter.Object.Aspects, postFilterOptionalSelect.Aspects);
        Assert.Equal(Array.Empty<IFilterAspect>(), postFilterOptionalSelect.SelectedAspects);
        Assert.Equal(Enumerable.Empty<string>(), postFilterOptionalSelect.Values);
    }

    // xunit test for PostFilterOptionalSelect constructor with remove that is filter name with spaces and other characters and is equal to filter name and is not equal to filter name
    [Fact]
    public void PostFilterOptionalSelectConstructorWithRemoveThatIsFilterNameWithSpacesAndOtherCharactersAndIsEqualToFilterNameAndIsNotEqualToFilterNameTest()
    {
        // arrange
        var filter = new Mock<IFilterOptionalSelect>();
        var form = new Mock<IFormCollection>();
        var remove = $" {filter.Object.Name}!@#$%^&*()_+{filter.Object.Name}remove ";

        // act
        var postFilterOptionalSelect = new PostFilterOptionalSelect(filter.Object, form.Object, remove);

        // assert
        Assert.Equal(filter.Object.Name, postFilterOptionalSelect.Name);
        Assert.Equal(filter.Object.Description, postFilterOptionalSelect.Description);
        Assert.Equal(filter.Object.FilterType, postFilterOptionalSelect.FilterType);
        Assert.Equal(filter.Object.Aspects, postFilterOptionalSelect.Aspects);
        Assert.Equal(Array.Empty<IFilterAspect>(), postFilterOptionalSelect.SelectedAspects);
        Assert.Equal(Enumerable.Empty<string>(), postFilterOptionalSelect.Values);
    }
}