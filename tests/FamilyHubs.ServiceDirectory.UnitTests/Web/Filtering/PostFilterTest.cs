//todo:

//using FamilyHubs.ServiceDirectory.Web.Filtering;
//using FamilyHubs.ServiceDirectory.Web.Filtering.Interfaces;
//using Microsoft.AspNetCore.Http;
//using Moq;

//namespace FamilyHubs.ServiceDirectory.UnitTests.Web.Filtering
//{
//    // xunit test for PostFilter in the style of lazcool
//    public class PostFilterTest
//    {
//        // xunit test for PostFilter constructor
//        [Fact]
//        public void PostFilterConstructorTest()
//        {
//            // arrange
//            var filter = new Mock<IFilter>();
//            var form = new Mock<IFormCollection>();
//            var remove = "remove";

//            // act
//            var postFilter = new PostFilter(filter.Object, form.Object, remove);

//            // assert
//            Assert.Equal(filter.Object.Name, postFilter.Name);
//            Assert.Equal(filter.Object.Description, postFilter.Description);
//            Assert.Equal(filter.Object.FilterType, postFilter.FilterType);
//            Assert.Equal(filter.Object.Aspects, postFilter.Aspects);
//            Assert.Equal(Array.Empty<IFilterAspect>(), postFilter.SelectedAspects);
//            Assert.Equal(Enumerable.Empty<string>(), postFilter.Values);
//        }

//        // xunit test for PostFilter constructor with null remove
//        [Fact]
//        public void PostFilterConstructorWithNullRemoveTest()
//        {
//            // arrange
//            var filter = new Mock<IFilter>();
//            var form = new Mock<IFormCollection>();
//            string? remove = null;

//            // act
//            var postFilter = new PostFilter(filter.Object, form.Object, remove);

//            // assert
//            Assert.Equal(filter.Object.Name, postFilter.Name);
//            Assert.Equal(filter.Object.Description, postFilter.Description);
//            Assert.Equal(filter.Object.FilterType, postFilter.FilterType);
//            Assert.Equal(filter.Object.Aspects, postFilter.Aspects);
//            Assert.Equal(Array.Empty<IFilterAspect>(), postFilter.SelectedAspects);
//            Assert.Equal(Enumerable.Empty<string>(), postFilter.Values);
//        }

//        // xunit test for PostFilter constructor with empty remove
//        [Fact]
//        public void PostFilterConstructorWithEmptyRemoveTest()
//        {
//            // arrange
//            var filter = new Mock<IFilter>();
//            var form = new Mock<IFormCollection>();
//            var remove = string.Empty;

//            // act
//            var postFilter = new PostFilter(filter.Object, form.Object, remove);

//            // assert
//            Assert.Equal(filter.Object.Name, postFilter.Name);
//            Assert.Equal(filter.Object.Description, postFilter.Description);
//            Assert.Equal(filter.Object.FilterType, postFilter.FilterType);
//            Assert.Equal(filter.Object.Aspects, postFilter.Aspects);
//            Assert.Equal(Array.Empty<IFilterAspect>(), postFilter.SelectedAspects);
//            Assert.Equal(Enumerable.Empty<string>(), postFilter.Values);
//        }
//    }
//}