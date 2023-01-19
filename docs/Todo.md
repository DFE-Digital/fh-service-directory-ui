# Todo

* use stringvalues for multi-params?

* add js tests for govuk-design-system sourced js (https://github.com/alphagov/govuk-design-system)

* we could read the categories from the db (OpenReferralTaxonomy) and automatically pick up any changes to the categories
 (reuse old service to update data on the fly)

* this looks useful for exception testing: https://github.com/dotnet/aspnetcore/blob/ed1ac4285213158a85f69449dba448ef0c65fbf4/src/Testing/src/ExceptionAssertions.cs

* use razor page css isolation?

* gap between h1 and back seems large (although seems to match at least some other gov.uk sites).
 prototype has a custom 1em padding-top, perhaps we should duplicate the prototype

* optimse css and js
* pick up jquery from one of the big cdn's (google/ms/jquery) with fallback to local copy (optimisation)

* accessible autocomplete?

* generate ie8 css using $govuk-is-ie8. & ie8 version of moj too (same https://design-patterns.service.justice.gov.uk/get-started/supporting-internet-explorer-8/)
 revert to non-js version of website for internet explorer (saves a lot of hassle), don't think html5shiv is required if we don't support js on ie.
 see https://frontend.design-system.service.gov.uk/supporting-ie8/#support-internet-explorer-8

changes from fh-referral-ui

swapped from node-sass (libsass) to sass (dart sass)
see... https://frontend.design-system.service.gov.uk/installing-with-npm/#install-with-node-js-package-manager-npm
`Do not use either LibSass or Ruby Sass, which are deprecated, for new projects.`
