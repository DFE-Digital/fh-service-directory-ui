﻿using FamilyHubs.ServiceDirectory.Core.ServiceDirectory.Models;
using FamilyHubs.ServiceDirectory.Web.Filtering.Interfaces;

namespace FamilyHubs.ServiceDirectory.Web.Filtering.Filters;

//todo: don't think will need filter name, so remove. we can get a filter by its type
public class CostFilter : Filter
{
    public CostFilter() : base("cost", "Cost", FilterType.Checkboxes, new IFilterAspect[]
    {
        new FilterAspect("free", "Free"),
        new FilterAspect("pay-to-use", "Pay to ue")
    })
    {
    }

    public override void AddFilterCriteria(IEnumerable<IFilterAspect> selectedAspects, ServicesParams servicesParams)
    {
        if (selectedAspects.Count() == 1)
        {
            //todo: const for pay-to-use
            servicesParams.IsPaidFor = selectedAspects.First().Id == "pay-to-use";
        }
    }
}