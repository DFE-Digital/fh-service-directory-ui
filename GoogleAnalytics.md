# Google Analytics

## Page view event

### Filter page

The page view event for the filter page contains query parameters representing the current search criteria, page number etc. The parameters can be found in the page_location or page_path parameters. One view of the page view events can be found in the Analytics dashboard here.

Here’s an example path…

```
/ServiceFilter?postcode=M27 8&adminarea=E08000006&latitude=53.508884&longitude=-2.294605&activities=activities,school-clubs&family-support=bullying,debt&cost=free,pay-to-use&show=family-hubs,services&search_within=20&children_and_young-option-selected=true&children_and_young=14
```

Here’s a breakdown of each parameter:

| Query Parameter | Notes | Example Value |
|-----------------|-------|-------------- |
| postcode        | The normalised outcode portion of the postcode that was entered into the postcode search page, which is PII safe. | M27 |
| adminarea       | The LA administrative area, which can be at the county or district/unitary authority level, to which the postcode has been assigned. | E08000006 |
| activities      | The (comma separated) selected ‘Activities, clubs and groups’ sub-categories.<BR><BR>The possible values are:<BR>activities<BR>school-clubs<BR>holiday-clubs<BR>mad<BR>baby-groups<BR>playgroup<BR>sports<BR> | activities,school-clubs |
| family-support  | The (comma separated) selected ‘Family support’ sub-categories.<BR><BR>The possible values are:<BR>bullying<BR>debt<BR>domestic-abuse<BR>family-support<BR>money<BR>parenting<BR>parent-conflict<BR>separating-parents<BR>smoking<BR>substance-misuse<BR>youth-support<BR>youth-justice | smoking,substance-misuse |
| health          | The (comma separated) selected ‘Health’ sub-categories.<BR><BR>The possible values are:<BR>hearing-sight<BR>mental-health<BR>nutrition<BR>oral<BR>public-health<BR>hearing-sight<BR> | oral |
| pregnancy       | The (comma separated) selected ‘Pregnancy, birth and early years’ sub-categories.<BR><BR>The possible values are:<BR>birth-registration<BR>early-years<BR>health-visiting<BR>infant-feeding<BR>midwife-maternity<BR>perinatal-mental-health | early-years,midwife-maternity |
| send            | The (comma separated) selected ‘Special educational needs and disabilities (SEND) support’ sub-categories.<BR><BR>The possible values are:<BR>asd<BR>breaks-respite<BR>early-years<BR>send<BR>hearing-impairment<BR>learning-difficulties<BR>multi-sensory-impairment<BR>other-difficulties<BR>physical-disabilities<BR>social-emotional<BR>speech-language<BR>visual-impairment<BR> | send |
| transport       | The (comma separated) selected ‘Transport’ sub-categories.<BR><BR>The possible values are:<BR>community-transport | community-transport |
| cost            | The selected ‘Cost’ options, comma separated.<BR><BR>The possible values are:<BR>free<BR>pay-to-use | free,pay-to-use |
| show            | The selected ‘Show’ options, comma separated.<BR><BR>The possible values are:<BR>family-hubs<BR>services<BR> | family-hubs,services |
| search_within   | The (single) selected ‘Search within’ option.<BR><BR>The possible values are:<BR>1, 2, 5, 10, 20<BR> | 20 |
| children_and_young-option-selected | Whether the user has checked the ‘For children and young people’ checkbox under ‘Children and young people’.<BR><BR>The possible values are:<BR>true, false | true |
| children_and_young | The (single) selected ‘For children and young people’ value.<BR><BR>Possible values are:<BR>all, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25 | 0 |
| frompostcodesearch | Whether the user has just entered the filter page from the postcode search page. Is absent from the moment the user performs an ‘Apply filters’ or removes any filters.<BR><BR>Possible values are:<BR>True, False | True |
| pageNum         | The page number of the results being viewed, corresponding to the number clicked in the pagination control (1 being the first page) | 1 |

#### Notes

The URL in the address bar will show the full postcode and also the latitude and longitude. Before the URL is sent to GA, the latitude and longitude is removed and the postcode shortened to comply with the GDPR. 

## Postcode Search

When we report an error to the user, related to the postcode they entered, the URL will contain a query parameter called postcodeError, e.g.:

```
postcodeError=InvalidPostcode
```

The possible values are

| Value | Scenario |
|-------|----------|
| NoPostcode | No postcode supplied |
| InvalidPostcode | Postcode in an invalid format |
| PostcodeNotFound | Postcode is in a valid format, but not found |

## Service Errors and 404’s

When a general error occurs, the page title will be:

```
Sorry, there is a problem with the service - Find support for your family - GOV.UK
```

When a page is not found, the page title will be:

```
Page not found - Find support for your family - GOV.UK
```

## Custom Events

Our custom events can be viewed in the Analytics dashboard.

Here’s [GA4 docs on reporting using custom events](https://support.google.com/analytics/answer/12229021?hl=en). We’ll probably need to report on custom event parameters, so we’ll have to [create custom dimensions or metrics](https://support.google.com/analytics/answer/10075209) to use them in reports.

### analytics custom event

A custom event that indicates when a user has accepted or rejected analytics cookies.

The event has 2 custom params:

| Parameter Name | Values | Description |
|----------------|--------|-------------|
| accepted       | true|false | Whether an user has accepted or rejected analytics cookies |
| source         | banner|cookies | Whether the decision was made via the banner or the cookies page |

Use the custom source parameter to determine if analytics was accepted or rejected from the global cookie banner, or from the cookie page. Looking for a `page_path` of `/cookies` isn't appropriate to use, as the user might have interacted with the cookie banner whilst on the cookies page.

Note: to meet the requirement of counting the number of users who decline analytics cookies, when an user declines cookies, we enable consent, create a cookie, sent a custom event, then disable consent and delete the analytics cookies.

### filter_page custom event

The event has 1 custom param:

| Parameter Name | Values | Description |
|----------------|--------|-------------|
| total_results  | 0-9999 | The number of results that match the search criteria |

`total_results` can be used to see how many searches returned results, and when it contains 0, it indicates that no results matched.
