using FamilyHubs.ServiceDirectory.Web.Filtering;
using FamilyHubs.ServiceDirectory.Web.Filtering.Interfaces;

namespace FamilyHubs.ServiceDirectory.Web.Content;

public static class FilterDefinitions
{
    public const string ChildrenAndYoungPeopleAllId = "all";

    public const string CostFilterName = "cost";
    public const string ShowFilterName = "show";
    public const string SearchWithinFilterName = "search_within";
    public const string ChildrenAndYoungPeopleFilterName = "children_and_young";

    //todo: we could read this data from the db (OpenReferralTaxonomy) and automatically pick up any changes to the categories
    public static readonly FilterSubGroups CategoryFilter = new("category", "Category", new Filter[]
    {
        //todo: for names, use initials or easier to recognise snippet. e.g. sr or sport, ss or smoke etc? ask designers/content?
        new("activities", "Activities, clubs and groups", FilterType.Checkboxes, new IFilterAspect[]
        {
            new FilterAspect("aafa1cc3-b984-4b10-89d5-27388c5432de", "a", "Activities"),
            new FilterAspect("3c207700-dc08-43bc-94ab-80c3d36d2e12", "basc", "Before and after school clubs"),
            new FilterAspect("022ae22f-8be6-4b20-99a6-faf2b9e0291a", "hcs", "Holiday clubs and schemes"),
            new FilterAspect("4d362474-79cc-449a-bafe-b128ab3b4f63", "mad", "Music, arts and dance"),
            new FilterAspect("27ae8b5f-3249-40b0-b12c-e0b4b664d758", "pbtg", "Parent, baby and toddler groups"),
            new FilterAspect("85cc81bd-c81a-4565-94fc-094bc605489e", "pp", "Pre-school playgroup"),
            new FilterAspect("e48bd335-ac3c-44ce-a0f7-57c91a823a2f", "sr", "Sports and recreation")
        }),
        new("family-support", "Family support", FilterType.Checkboxes, new IFilterAspect[]
        {
            new FilterAspect("a6a8e423-7c32-493d-ad21-4732a40f2793", "bcb", "Bullying and cyber bullying"),
            new FilterAspect("9944d79d-00c8-43b7-b369-2f1baca1dcb0", "dwa", "Debt and welfare advice"),
            new FilterAspect("47599de2-6638-4ed7-8bc1-afe4ba47a797", "da", "Domestic abuse"),
            new FilterAspect("8ec7ae63-3f88-472a-92c9-27dcfca9565b", "itfs", "Intensive targeted family support"),
            new FilterAspect("94713493-8f49-4e96-8828-13aa12484866", "mbh", "Money, benefits and housing"),
            new FilterAspect("f11a9fdd-de48-499a-ac2d-2bd01dfc22f1", "ps", "Parenting support"),
            new FilterAspect("a092d35f-87f1-453d-937f-00534cd339aa", "rpc", "Reducing parental conflict"),
            new FilterAspect("110ba031-18e8-4e7c-8b91-70a5b3504d0f", "ssps", "Separating and separated parent support"),
            new FilterAspect("6bca5e3d-ad93-4083-b721-31d89c9e357d", "ss", "Stopping smoking"),
            new FilterAspect("8fc58423-2f78-41f8-8211-947318940c50", "sm", "Substance misuse (including alcohol and drug)"),
            new FilterAspect("8a74745f-b95e-4c57-be27-f3cc4e24ddd6", "tys", "Targeted youth support"),
            new FilterAspect("be1de9a2-a833-498b-95d3-9e525d4d9951", "yjs", "Youth justice services")
        }),
        new("health", "Health", FilterType.Checkboxes, new IFilterAspect[]
        {
            new FilterAspect("11696b1f-209a-47b1-9ef5-c588a14d43c6", "hs", "Hearing and sight"),
            new FilterAspect("7c39c3df-2ad4-4f94-aedd-d1cf5981e195", "mhses", "Mental health, social and emotional support"),
            new FilterAspect("5b64e25a-929c-4a41-9c47-9faeaf2b5f29", "nwm", "Nutrition and weight management"),
            new FilterAspect("2bc4dba9-14a8-4942-b52d-c0cf5622f5a7", "oh", "Oral health"),
            new FilterAspect("75fe2e44-69c8-4da7-b4bd-d2d042acc657", "phs", "Public health services")
        }),
        new("pregnancy", "Pregnancy, birth and early years", FilterType.Checkboxes, new IFilterAspect[]
        {
            new FilterAspect("1e305952-ea60-43d6-bbc8-6cf6f1a1c7f0", "br", "Birth registration"),
            new FilterAspect("5f9acf55-be45-4847-9d45-cf94445b71ca", "eyll", "Early years language and learning"),
            new FilterAspect("e734cabd-2b69-4583-a844-9b6a4b266c71", "hv", "Health visiting"),
            new FilterAspect("231a2bf5-b05a-4da7-a338-a838b83806db", "ifs", "Infant feeding support (including breastfeeding)"),
            new FilterAspect("19c29d11-ffbc-41d0-841c-ea8f0dfdda94", "mm", "Midwife and maternity"),
            new FilterAspect("2b2489d5-aee8-42ef-8c97-d8fcccdb5a8b", "pmhs", "Perinatal mental health support (pregnancy to one year post birth)"),
        }),
        new("send", "Special educational needs and disabilities (SEND) support", FilterType.Checkboxes,
            new IFilterAspect[]
            {
                new FilterAspect("2db648ae-69fb-4f06-b76f-b66a3bb64215", "asd", "Autistic Spectrum Disorder (ASD)"),
                new FilterAspect("9d5161ee-a289-47b4-a967-a5912ae143ba", "br", "Breaks and respite"),
                new FilterAspect("dacf095a-83df-4d23-a20a-da751d956ab9", "eys", "Early years support"),
                new FilterAspect("43349183-1145-4bae-bf49-d5398e33d1b2", "send", "Groups for parents and carers of children with SEND"),
                new FilterAspect("72a24e08-79d3-49d5-89ca-2d3d8c0e470e", "hi", "Hearing impairment"),
                new FilterAspect("619344e1-2185-4d62-b3b3-fc95ac18cd9f", "ldd", "Learning difficulties and disabilities"),
                new FilterAspect("0bc60c67-9fac-4b9e-aeee-38950859c700", "mi", "Multi-sensory impairment"),
                new FilterAspect("bf6db3be-b539-4a02-a212-3858126d35d2", "odd", "Other difficulties or disabilities"),
                new FilterAspect("cbda7b61-d330-4923-a174-3cb4c5cf9c0a", "pd", "Physical disabilities"),
                new FilterAspect("4f4053cc-9250-4109-9c30-3b53960524f7", "semhs", "Social, emotional and mental health support"),
                new FilterAspect("38bf4fc2-f6b9-4c15-bc07-b03b707659bd", "slc", "Speech, language and communication needs"),
                new FilterAspect("4c219f95-21da-4222-8286-bbe1cfaf675c", "vi", "Visual impairment"),
            }),
        new("transport", "Transport", FilterType.Checkboxes, new IFilterAspect[]
        {
            new FilterAspect("93a29b1e-acd9-4abf-9f30-07dce3378558", "ct", "Community transport")
        })
    });

    public static readonly IEnumerable<IFilter> Filters = new[]
    {
        new Filter(CostFilterName, "Cost", FilterType.Checkboxes, new IFilterAspect[]
        {
            new FilterAspect("free", "free", "Free"),
            new FilterAspect("pay-to-use", "pay", "Pay to ue")
        }),
        new Filter(ShowFilterName, "Show", FilterType.Checkboxes, new IFilterAspect[]
        {
            new FilterAspect("true", "fh", "Family hubs"), 
            new FilterAspect("false", "sg", "Services and groups")
       }),
        new Filter(SearchWithinFilterName, "Search within", FilterType.Radios, new IFilterAspect[]
        {
            new FilterAspect("1", "1", "1 mile"),
            new FilterAspect("2", "2", "2 miles"),
            new FilterAspect("5", "5", "5 miles"),
            new FilterAspect("10", "10", "10 miles"),
            new FilterAspect("20", "20", "20 miles", true)
        }),
        new FilterOptionalSelect(ChildrenAndYoungPeopleFilterName, "Children and young people",
            "For children and young people", "Age", new IFilterAspect[]
        {
            new FilterAspect(ChildrenAndYoungPeopleAllId, "all", "All ages"),
            new FilterAspect("0", "0", "0 to 12 months"),
            new FilterAspect("1", "1", "1 year old"),
            new FilterAspect("2", "2", "2 year old"),
            new FilterAspect("3", "3", "3 year old"),
            new FilterAspect("4", "4", "4 year old"),
            new FilterAspect("5", "5", "5 year old"),
            new FilterAspect("6", "6", "6 year old"),
            new FilterAspect("7", "7", "7 year old"),
            new FilterAspect("8", "8", "8 year old"),
            new FilterAspect("9", "9", "9 year old"),
            new FilterAspect("10", "10", "10 year old"),
            new FilterAspect("11", "11", "11 year old"),
            new FilterAspect("12", "12", "12 year old"),
            new FilterAspect("13", "13", "13 year old"),
            new FilterAspect("14", "14", "14 year old"),
            new FilterAspect("15", "15", "15 year old"),
            new FilterAspect("16", "16", "16 year old"),
            new FilterAspect("17", "17", "17 year old"),
            new FilterAspect("18", "18", "18 year old"),
            new FilterAspect("19", "19", "19 year old"),
            new FilterAspect("20", "20", "20 year old"),
            new FilterAspect("21", "21", "21 year old"),
            new FilterAspect("22", "22", "22 year old"),
            new FilterAspect("23", "23", "23 year old"),
            new FilterAspect("24", "24", "24 year old"),
            new FilterAspect("25", "25", "25 year old")
        })
    };
}
