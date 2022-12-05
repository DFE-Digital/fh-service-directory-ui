using FamilyHubs.ServiceDirectory.Web.Models;
using FamilyHubs.ServiceDirectory.Web.Models.Interfaces;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace FamilyHubs.ServiceDirectory.Web.Pages.ServiceFilter;

public partial class ServiceFilterModel : PageModel
{
    public static readonly FilterSubGroups CategoryFilter = new("category", "Category", new Filter[]
    {
        //todo: can we get these from the db?
        new("activities", "Activities, clubs and groups", FilterType.Checkboxes, new IFilterAspect[]
        {
            new FilterAspect("activities--activities", "Activities"),
            new FilterAspect("activities--school-clubs", "Before and after school clubs"),
            new FilterAspect("activities--holiday-clubs", "Holiday clubs and schemes"),
            new FilterAspect("activities--music-arts-dance", "Music, arts and dance"),
            new FilterAspect("activities--parent-group", "Parent, baby and toddler groups"),
            new FilterAspect("activities--preschool-playgroup", "Pre-school playgroup"),
            new FilterAspect("activities--sports", "Sports and recreation")
        }),
        new("family-support", "Family support", FilterType.Checkboxes, new IFilterAspect[]
        {
            new FilterAspect("family-support--bullying", "Bullying and cyber bullying"),
            new FilterAspect("family-support--debt-advice", "Debt and welfare advice"),
            new FilterAspect("family-support--domestic-abuse", "Domestic abuse"),
            new FilterAspect("family-support--intensive", "Intensive targeted family support"),
            new FilterAspect("family-support--money-benefits-housing", "Money, benefits and housing"),
            new FilterAspect("family-support--parenting", "Parenting support"),
            new FilterAspect("family-support--reducing-parental-conflict", "Reducing parental conflict"),
            new FilterAspect("family-support--separation-support", "Separating and separated parent support"),
            new FilterAspect("family-support--stopping-smoking", "Stopping smoking"),
            new FilterAspect("family-support--substance-misuse", "Substance misuse (including alcohol and drug)"),
            new FilterAspect("family-support--targeted-youth", "Targeted youth support"),
            new FilterAspect("family-support--youth-justice", "Youth justice services")
        }),
        new("health", "Health", FilterType.Checkboxes, new IFilterAspect[]
        {
            new FilterAspect("health--hearing-sight", "Hearing and sight"),
            new FilterAspect("health--nutrition", "Nutrition and weight management"),
            new FilterAspect("health--oral", "Oral health"),
            new FilterAspect("health--public", "Public health services"),
            new FilterAspect("health--mental", "Mental health, social and emotional support")
        }),
        new("pregnancy", "Pregnancy, birth and early years", FilterType.Checkboxes, new IFilterAspect[]
        {
            new FilterAspect("pregnancy--early-years", "Early years language and learning"),
            new FilterAspect("pregnancy--birth-registration", "Birth registration"),
            new FilterAspect("pregnancy--infant-feeding", "Infant feeding support (including breastfeeding)"),
            new FilterAspect("pregnancy--midwife", "Midwife and maternity"),
            new FilterAspect("pregnancy--perinatal_mental",
                "Perinatal mental health support (pregnancy to one year post birth)"),
            new FilterAspect("pregnancy--health-visiting", "Health visiting")
        }),
        new("send", "Special educational needs and disabilities (SEND) support", FilterType.Checkboxes,
            new IFilterAspect[]
            {
                new FilterAspect("send--early-years", "Early years support"),
                new FilterAspect("send--asd", "Autistic Spectrum Disorder (ASD)"),
                new FilterAspect("send--breaks", "Breaks and respite"),
                new FilterAspect("send--parents-carers", "Groups for parents and carers of children with SEND"),
                new FilterAspect("send--hearing-impairment", "Hearing impairment"),
                new FilterAspect("send--multi-sensory-impairment", "Multi-sensory impairment"),
                new FilterAspect("send--physical-disabilities", "Physical disabilities"),
                new FilterAspect("send--learning-difficulties", "Learning difficulties and disabilities"),
                new FilterAspect("send--social-support", "Social, emotional and mental health support"),
                new FilterAspect("send--speech", "Speech, language and communication needs"),
                new FilterAspect("send--visual-impairment", "Visual impairment"),
                new FilterAspect("send--other-difficulties", "Other difficulties or disabilities")
            }),
        new("transport", "Transport", FilterType.Checkboxes, new IFilterAspect[]
        {
            new FilterAspect("transport--community", "Community transport")
        })
    });

    public static readonly IEnumerable<Filter> Filters = new[]
    {
        new Filter("cost", "Cost", FilterType.Checkboxes, new IFilterAspect[]
        {
            new FilterAspect("cost--free", "Free"),
            new FilterAspect("cost--pay-to-use", "Pay to use")
        }),
        new Filter("show", "Show", FilterType.Checkboxes, new IFilterAspect[]
        {
            new FilterAspect("show--family-hubs", "Family hubs"),
            new FilterAspect("show--services-and-groups", "Services and groups")
        }),
        new Filter("search-within", "Search within", FilterType.Radios, new IFilterAspect[]
        {
            new FilterAspect("search-within--1-mile", "1 mile"),
            new FilterAspect("search-within--2-miles", "2 miles"),
            new FilterAspect("search-within--5-miles", "5 miles"),
            new FilterAspect("search-within--10-miles", "10 miles"),
            new FilterAspect("search-within--20-miles", "20 miles")
        }),
        new Filter("age-range", "Age range", FilterType.Checkboxes, new IFilterAspect[]
        {
            new FilterAspect("age-range--all-age-groups", "All age groups"),
            new FilterAspect("age-range--0-to-5", "0 to 5"),
            new FilterAspect("age-range--6-to-11", "6 to 11"),
            new FilterAspect("age-range--12-to-15", "12 to 15"),
            new FilterAspect("age-range--16-to-18", "16 to 18"),
            new FilterAspect("age-range--19-to-25-with-send", "19 to 25 with SEND")
        })
    };
}
