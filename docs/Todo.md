# Todo

* package up filter framework into a razor class library

* default filter values not in url

* govuk-frontend 4.5 has switched to terser, so should now be compatible with our gulpfile, as we already use terser

* resharper is warning about security vulnerabilities in FamilyHubs.ServiceDirectory.Shared

* update url paths to match prototype

* js in tmp/components/components

* environment tags for non-optimised js

* pick up standard libraries such as jQuery from one of the big CDN's (Google/MS/jQuery) with fallback to fetching a local copy.

* fix extra whitespace in filter tag sometimes when text wraps
* fix incorrect colour of bottom border of header in chromium browsers

* add js tests for govuk-design-system sourced js (https://github.com/alphagov/govuk-design-system)

* we could read the categories from the db (Taxonomy) and automatically pick up any changes to the categories
 (reuse old service to update data on the fly)

* this looks useful for exception testing: https://github.com/dotnet/aspnetcore/blob/ed1ac4285213158a85f69449dba448ef0c65fbf4/src/Testing/src/ExceptionAssertions.cs

* use razor page css isolation?

* pick up jquery from one of the big cdn's (google/ms/jquery) with fallback to local copy (optimisation)

* accessible autocomplete?

* generate ie8 css using $govuk-is-ie8. & ie8 version of moj too (same https://design-patterns.service.justice.gov.uk/get-started/supporting-internet-explorer-8/)
 revert to non-js version of website for internet explorer (saves a lot of hassle), don't think html5shiv is required if we don't support js on ie.
 would have to plug in oldie too. seems quite involved for what's reported as 0% browser usage stats!
 see https://frontend.design-system.service.gov.uk/supporting-ie8/#support-internet-explorer-8

changes from fh-referral-ui

swapped from node-sass (libsass) to sass (dart sass)
see... https://frontend.design-system.service.gov.uk/installing-with-npm/#install-with-node-js-package-manager-npm
`Do not use either LibSass or Ruby Sass, which are deprecated, for new projects.`

* pick up govuk js from node_modules and only initialize import what we need: https://frontend.design-system.service.gov.uk/importing-css-assets-and-javascript/#select-and-initialise-an-individual-component

* _service using new th has encoding issues...

@using Microsoft.AspNetCore.Html
@model Service

<div class="app-service">
    <div class="govuk-summary-list__row">
        <div class="govuk-summary-list__key">
            @*todo: description on view enum? - think it will come from db*@
            <span class="govuk-caption-m govuk-!-margin-top-3">@(Model.Type == ServiceType.FamilyHub ? "Family hub" : "Service and groups")</span>
            <h3 class="govuk-heading-s govuk-!-margin-bottom-0">@Model.Name <span class="govuk-!-font-weight-regular"> (@Model.Distance?.ToString("0.0") miles)</span></h3>
        </div>
    </div>
    
    <summary-list border="false">
            
        @if (Model.Type == ServiceType.Service)
        {
            <summary-list-row key="Category">@ToBreakHtml(Model.Categories)</summary-list-row>
            <summary-list-row key="Age range">@Model.AgeRange</summary-list-row>
            <summary-list-row key="When">@ToBreakHtml(Model.When)</summary-list-row>

            <partial name="_SummaryListRows" model='("Category", Model.Categories)' />
            <partial name="_SummaryListRow" model='("Age range", Model.AgeRange)' />
            <partial name="_SummaryListRows" model='("When", Model.When)' />
        }

        <summary-list-row key="Where">@ToBreakHtml(Model.Where)</summary-list-row>
        <partial name="_SummaryListRows" model='("Where", Model.Where)' />
        
        @*todo: how best to handle when these are missing *@
        @if (!string.IsNullOrEmpty(Model.Phone))
        {
            <summary-list-row key="Phone"><a phone="@Model.Phone"></a></summary-list-row>
        }
        @if (!string.IsNullOrEmpty(Model.Email))
        {
            <summary-list-row key="Email"><a email="@Model.Email"></a></summary-list-row>
        }
        @if (!string.IsNullOrEmpty(Model.WebsiteUrl))
        {
            <summary-list-row key="Website"><a web-page="@Model.WebsiteUrl" new-tab>@Model.WebsiteName</a></summary-list-row>
        }
        @*todo: default not nice*@
        <partial name="_SummaryListLink" model='("Phone", Model.Phone, LinkType.Phone, default(string?))' />
        <partial name="_SummaryListLink" model='("Email", Model.Email, LinkType.Email, default(string?))' />
        <partial name="_SummaryListLink" model='("Website", Model.WebsiteUrl, LinkType.WebPageInNewTab, Model.WebsiteName)' />

        @if (Model.Type == ServiceType.FamilyHub)
        {
            <summary-list-row key="Opening hours">@ToBreakHtml(Model.When)</summary-list-row>
            <partial name="_SummaryListRows" model='("Opening hours", Model.When)' />
        }
        else
        {
            <summary-list-row key="Cost">@ToBreakHtml(Model.Cost)</summary-list-row>
            <partial name="_SummaryListRows" model='("Cost", Model.Cost)' />
        }
    </summary-list>
</div>

@functions
{
    //todo: give better name and move to components?
    private IHtmlContent ToBreakHtml(IEnumerable<string> lines)
    {
        // var html = string.Join("<br/>", lines.Select(line => System.Text.Encodings.Web.HtmlEncoder.Default.Encode(line)));
        // return new HtmlString(html);

        //return Html.Raw(string.Join("<br />", lines));
        return new HtmlString(string.Join("<br />", lines));

    }
}

