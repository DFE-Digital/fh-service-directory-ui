using FamilyHubs.ServiceDirectory.Web.Filtering;
using FamilyHubs.ServiceDirectory.Web.Filtering.Interfaces;

namespace FamilyHubs.ServiceDirectory.Web.Content;

//todo: 0.00 miles

public static class FilterDefinitions
{
    public const string AspectIdSeparator = "--";
    public const string CostFilterName = "cost";
    public const string ShowFilterName = "show";
    public const string SearchWithinFilterName = "search_within";
    public const string ChildrenAndYoungPeopleFilterName = "children_and_young";

    public const string ChildrenAndYoungPeopleAllId = "all";

    //todo: we could read this data from the db (OpenReferralTaxonomy) and automatically pick up any changes to the categories
    public static readonly FilterSubGroups CategoryFilter = new("category", "Category", new Filter[]
    {
        new("activities", "Activities, clubs and groups", FilterType.Checkboxes, new IFilterAspect[]
        {
            new FilterAspect("activities--aafa1cc3-b984-4b10-89d5-27388c5432de", "Activities"),
            new FilterAspect("activities--3c207700-dc08-43bc-94ab-80c3d36d2e12", "Before and after school clubs"),
            new FilterAspect("activities--022ae22f-8be6-4b20-99a6-faf2b9e0291a", "Holiday clubs and schemes"),
            new FilterAspect("activities--4d362474-79cc-449a-bafe-b128ab3b4f63", "Music, arts and dance"),
            new FilterAspect("activities--27ae8b5f-3249-40b0-b12c-e0b4b664d758", "Parent, baby and toddler groups"),
            new FilterAspect("activities--85cc81bd-c81a-4565-94fc-094bc605489e", "Pre-school playgroup"),
            new FilterAspect("activities--e48bd335-ac3c-44ce-a0f7-57c91a823a2f", "Sports and recreation")
        }),
        new("family-support", "Family support", FilterType.Checkboxes, new IFilterAspect[]
        {
            new FilterAspect("family-support--a6a8e423-7c32-493d-ad21-4732a40f2793", "Bullying and cyber bullying"),
            new FilterAspect("family-support--9944d79d-00c8-43b7-b369-2f1baca1dcb0", "Debt and welfare advice"),
            new FilterAspect("family-support--47599de2-6638-4ed7-8bc1-afe4ba47a797", "Domestic abuse"),
            new FilterAspect("family-support--8ec7ae63-3f88-472a-92c9-27dcfca9565b", "Intensive targeted family support"),
            new FilterAspect("family-support--94713493-8f49-4e96-8828-13aa12484866", "Money, benefits and housing"),
            new FilterAspect("family-support--f11a9fdd-de48-499a-ac2d-2bd01dfc22f1", "Parenting support"),
            new FilterAspect("family-support--a092d35f-87f1-453d-937f-00534cd339aa", "Reducing parental conflict"),
            new FilterAspect("family-support--110ba031-18e8-4e7c-8b91-70a5b3504d0f", "Separating and separated parent support"),
            new FilterAspect("family-support--6bca5e3d-ad93-4083-b721-31d89c9e357d", "Stopping smoking"),
            new FilterAspect("family-support--8fc58423-2f78-41f8-8211-947318940c50", "Substance misuse (including alcohol and drug)"),
            new FilterAspect("family-support--8a74745f-b95e-4c57-be27-f3cc4e24ddd6", "Targeted youth support"),
            new FilterAspect("family-support--be1de9a2-a833-498b-95d3-9e525d4d9951", "Youth justice services")
        }),
        new("health", "Health", FilterType.Checkboxes, new IFilterAspect[]
        {
            new FilterAspect("health--11696b1f-209a-47b1-9ef5-c588a14d43c6", "Hearing and sight"),
            new FilterAspect("health--7c39c3df-2ad4-4f94-aedd-d1cf5981e195", "Mental health, social and emotional support"),
            new FilterAspect("health--5b64e25a-929c-4a41-9c47-9faeaf2b5f29", "Nutrition and weight management"),
            new FilterAspect("health--2bc4dba9-14a8-4942-b52d-c0cf5622f5a7", "Oral health"),
            new FilterAspect("health--75fe2e44-69c8-4da7-b4bd-d2d042acc657", "Public health services")
        }),
        new("pregnancy", "Pregnancy, birth and early years", FilterType.Checkboxes, new IFilterAspect[]
        {
            new FilterAspect("pregnancy--1e305952-ea60-43d6-bbc8-6cf6f1a1c7f0", "Birth registration"),
            new FilterAspect("pregnancy--5f9acf55-be45-4847-9d45-cf94445b71ca", "Early years language and learning"),
            new FilterAspect("pregnancy--e734cabd-2b69-4583-a844-9b6a4b266c71", "Health visiting"),
            new FilterAspect("pregnancy--231a2bf5-b05a-4da7-a338-a838b83806db", "Infant feeding support (including breastfeeding)"),
            new FilterAspect("pregnancy--19c29d11-ffbc-41d0-841c-ea8f0dfdda94", "Midwife and maternity"),
            new FilterAspect("pregnancy--2b2489d5-aee8-42ef-8c97-d8fcccdb5a8b", "Perinatal mental health support (pregnancy to one year post birth)"),
        }),
        new("send", "Special educational needs and disabilities (SEND) support", FilterType.Checkboxes,
            new IFilterAspect[]
            {
                new FilterAspect("send--2db648ae-69fb-4f06-b76f-b66a3bb64215", "Autistic Spectrum Disorder (ASD)"),
                new FilterAspect("send--9d5161ee-a289-47b4-a967-a5912ae143ba", "Breaks and respite"),
                new FilterAspect("send--dacf095a-83df-4d23-a20a-da751d956ab9", "Early years support"),
                new FilterAspect("send--43349183-1145-4bae-bf49-d5398e33d1b2", "Groups for parents and carers of children with SEND"),
                new FilterAspect("send--72a24e08-79d3-49d5-89ca-2d3d8c0e470e", "Hearing impairment"),
                new FilterAspect("send--619344e1-2185-4d62-b3b3-fc95ac18cd9f", "Learning difficulties and disabilities"),
                new FilterAspect("send--0bc60c67-9fac-4b9e-aeee-38950859c700", "Multi-sensory impairment"),
                new FilterAspect("send--bf6db3be-b539-4a02-a212-3858126d35d2", "Other difficulties or disabilities"),
                new FilterAspect("send--cbda7b61-d330-4923-a174-3cb4c5cf9c0a", "Physical disabilities"),
                new FilterAspect("send--4f4053cc-9250-4109-9c30-3b53960524f7", "Social, emotional and mental health support"),
                new FilterAspect("send--38bf4fc2-f6b9-4c15-bc07-b03b707659bd", "Speech, language and communication needs"),
                new FilterAspect("send--4c219f95-21da-4222-8286-bbe1cfaf675c", "Visual impairment"),
            }),
        new("transport", "Transport", FilterType.Checkboxes, new IFilterAspect[]
        {
            new FilterAspect("transport--93a29b1e-acd9-4abf-9f30-07dce3378558", "Community transport")
        })
    });

    public static readonly IEnumerable<IFilter> Filters = new[]
    {
        new Filter(CostFilterName, "Cost", FilterType.Checkboxes, new IFilterAspect[]
        {
            new FilterAspect(CostFilterName+AspectIdSeparator+"free", "Free"),
            new FilterAspect(CostFilterName+AspectIdSeparator+"pay-to-use", "Pay to use")
        }),
        new Filter(ShowFilterName, "Show", FilterType.Checkboxes, new IFilterAspect[]
        {
            new FilterAspect($"{ShowFilterName}{AspectIdSeparator}true", "Family hubs"),
            new FilterAspect($"{ShowFilterName}{AspectIdSeparator}false", "Services and groups")
        }),
        new Filter(SearchWithinFilterName, "Search within", FilterType.Radios, new IFilterAspect[]
        {
            new FilterAspect(SearchWithinFilterName+AspectIdSeparator+"1", "1 mile"),
            new FilterAspect(SearchWithinFilterName+AspectIdSeparator+"2", "2 miles"),
            new FilterAspect(SearchWithinFilterName+AspectIdSeparator+"5", "5 miles"),
            new FilterAspect(SearchWithinFilterName+AspectIdSeparator+"10", "10 miles"),
            new FilterAspect(SearchWithinFilterName+AspectIdSeparator+"20", "20 miles", true)
        }),
        new FilterOptionalSelect(ChildrenAndYoungPeopleFilterName, "Children and young people",
            "For children and young people", "Age", new IFilterAspect[]
        {
            new FilterAspect(ChildrenAndYoungPeopleFilterName+AspectIdSeparator+ChildrenAndYoungPeopleAllId, "All ages"),
            new FilterAspect(ChildrenAndYoungPeopleFilterName+AspectIdSeparator+"0", "0 to 12 months"),
            new FilterAspect(ChildrenAndYoungPeopleFilterName+AspectIdSeparator+"1", "1 year old"),
            new FilterAspect(ChildrenAndYoungPeopleFilterName+AspectIdSeparator+"2", "2 year old"),
            new FilterAspect(ChildrenAndYoungPeopleFilterName+AspectIdSeparator+"3", "3 year old"),
            new FilterAspect(ChildrenAndYoungPeopleFilterName+AspectIdSeparator+"4", "4 year old"),
            new FilterAspect(ChildrenAndYoungPeopleFilterName+AspectIdSeparator+"5", "5 year old"),
            new FilterAspect(ChildrenAndYoungPeopleFilterName+AspectIdSeparator+"6", "6 year old"),
            new FilterAspect(ChildrenAndYoungPeopleFilterName+AspectIdSeparator+"7", "7 year old"),
            new FilterAspect(ChildrenAndYoungPeopleFilterName+AspectIdSeparator+"8", "8 year old"),
            new FilterAspect(ChildrenAndYoungPeopleFilterName+AspectIdSeparator+"9", "9 year old"),
            new FilterAspect(ChildrenAndYoungPeopleFilterName+AspectIdSeparator+"10", "10 year old"),
            new FilterAspect(ChildrenAndYoungPeopleFilterName+AspectIdSeparator+"11", "11 year old"),
            new FilterAspect(ChildrenAndYoungPeopleFilterName+AspectIdSeparator+"12", "12 year old"),
            new FilterAspect(ChildrenAndYoungPeopleFilterName+AspectIdSeparator+"13", "13 year old"),
            new FilterAspect(ChildrenAndYoungPeopleFilterName+AspectIdSeparator+"14", "14 year old"),
            new FilterAspect(ChildrenAndYoungPeopleFilterName+AspectIdSeparator+"15", "15 year old"),
            new FilterAspect(ChildrenAndYoungPeopleFilterName+AspectIdSeparator+"16", "16 year old"),
            new FilterAspect(ChildrenAndYoungPeopleFilterName+AspectIdSeparator+"17", "17 year old"),
            new FilterAspect(ChildrenAndYoungPeopleFilterName+AspectIdSeparator+"18", "18 year old"),
            new FilterAspect(ChildrenAndYoungPeopleFilterName+AspectIdSeparator+"19", "19 year old"),
            new FilterAspect(ChildrenAndYoungPeopleFilterName+AspectIdSeparator+"20", "20 year old"),
            new FilterAspect(ChildrenAndYoungPeopleFilterName+AspectIdSeparator+"21", "21 year old"),
            new FilterAspect(ChildrenAndYoungPeopleFilterName+AspectIdSeparator+"22", "22 year old"),
            new FilterAspect(ChildrenAndYoungPeopleFilterName+AspectIdSeparator+"23", "23 year old"),
            new FilterAspect(ChildrenAndYoungPeopleFilterName+AspectIdSeparator+"24", "24 year old"),
            new FilterAspect(ChildrenAndYoungPeopleFilterName+AspectIdSeparator+"25", "25 year old")
        })
    };
}
