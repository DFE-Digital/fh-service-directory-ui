//todo:

//using FamilyHubs.ServiceDirectory.Web.Filtering;
//using FamilyHubs.ServiceDirectory.Web.Filtering.Interfaces;
//using Microsoft.AspNetCore.Http;
//using Moq;

//namespace FamilyHubs.ServiceDirectory.UnitTests.Web.Filtering;

//public class PostFilterOptionalSelectTest
//{
//    public Mock<IFilterOptionalSelect> FilterOptionalSelect { get; set; }
//    public Mock<IFormCollection> Form { get; set; }
//    public string? Remove { get; set; }

//    public PostFilterOptionalSelectTest()
//    {
//        FilterOptionalSelect = new Mock<IFilterOptionalSelect>();
//        FilterOptionalSelect.SetupGet(x => x.Name).Returns("TestFilter");
//        Form = new Mock<IFormCollection>();
//    }

//    [Theory]
//    [InlineData(null)]
//    [InlineData("")]
//    [InlineData("remove")]
//    [InlineData(" remove!@#$%^&*()_+")]
//    public void PostFilterOptionalSelectConstructor(string? remove)
//    {
//        // act
//        var postFilterOptionalSelect = new AppliedFilterOptionalSelect(FilterOptionalSelect.Object, Form.Object, remove);

//        // assert
//        Assert.Equal(FilterOptionalSelect.Object.Name, postFilterOptionalSelect.Name);
//        Assert.Equal(FilterOptionalSelect.Object.Description, postFilterOptionalSelect.Description);
//        Assert.Equal(FilterOptionalSelect.Object.FilterType, postFilterOptionalSelect.FilterType);
//        Assert.Equal(FilterOptionalSelect.Object.Aspects, postFilterOptionalSelect.Aspects);
//        Assert.Equal(Array.Empty<IFilterAspect>(), postFilterOptionalSelect.SelectedAspects);
//        Assert.Equal(Enumerable.Empty<string>(), postFilterOptionalSelect.Values);
//    }
//}