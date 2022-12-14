# Todo

* cost : api needs to add new field and use that for the every {new_field} bit
  and also display cost description on line below if there is one

* filtering by free is returning services with a cost with the new data import set

* sass: pick up sass exe from .bin folder?

* now that the API filters by organisation type, we could pass back the organisation (or what we need from the org), rather than fetching the service's org

* add category as data-attribute to services to help front end tests

* we could read the categories from the db (OpenReferralTaxonomy) and automatically pick up any changes to the categories
 (reuse old service to update data on the fly)

* this looks useful for exception testing: https://github.com/dotnet/aspnetcore/blob/ed1ac4285213158a85f69449dba448ef0c65fbf4/src/Testing/src/ExceptionAssertions.cs

* use razor page css isolation?

* does moj js do anything with filter?
 if not, don't include
if so, initialize individual component, https://design-patterns.service.justice.gov.uk/get-started/setting-up-javascript/

* gap between h1 and back seems large (although seems to match at least some other gov.uk sites).
 prototype has a custom 1em padding-top, perhaps we should duplicate the prototype

* cookie consent : which version to use?

* app services doesn't support codeless app insights with .net 7
add manually (Martin may have done something in shared)

* optimse css and js

* accessible autocomplete?

* pick up jquery from one of the big cdn's (google/ms/jquery) with fallback to local copy (optimisation)

* generate ie8 css using $govuk-is-ie8. & ie8 version of moj too (same https://design-patterns.service.justice.gov.uk/get-started/supporting-internet-explorer-8/)
 revert to non-js version of website for internet explorer (saves a lot of hassle), don't think html5shiv is required if we don't support js on ie.
 see https://frontend.design-system.service.gov.uk/supporting-ie8/#support-internet-explorer-8

* improve sass integration

current instructions:
install sass _globally_, using
`npm install -g sass`

run
`npm run-script scss`
to generate the css from the sass (and watch for changes)

better to use the version of sass installed to the project, using js, similar to...

```
const sass = require('sass');
const fs = require('fs');

const result = sass.compile('wwwroot/styles/site.scss');

fs.writeFile('site.css', result, function (err) { });

```

or set up gulp or some other manager or built in vs management

see https://www.npmjs.com/package/sass
https://learn.microsoft.com/en-us/answers/questions/869707/converting-scss-to-css-and-using-in-aspnet-mvc-cor.html

changes from fh-referral-ui

swapped from node-sass (libsass) to sass (dart sass)
see... https://frontend.design-system.service.gov.uk/installing-with-npm/#install-with-node-js-package-manager-npm
`Do not use either LibSass or Ruby Sass, which are deprecated, for new projects.`

* sonarscanner for .net vs SonarAnalyzer.CSharp? why 2? only latter supports .net 7 so stick with it for now