
namespace FamilyHubs.ServiceDirectory.Web.Models;

//todo: this should probably be a subclass of filter
public sealed record FilterSubGroups(string Name, string Description, IEnumerable<IFilter> SubFilters);