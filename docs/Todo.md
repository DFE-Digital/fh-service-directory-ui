# Todo

* gap between h1 and back seems large (although seems to match at least some other gov.uk sites).
 prototype has a custom 1em padding-top, perhaps we should duplicate the prototype

* cookie consent : which version to use?

* app services doesn't support codeless app insights with .net 7
add manually (Martin may have done something in shared)

* optimse css and js

* pick up jquery from one of the big cdn's (google/ms/jquery) with fallback to local copy (optimisation)

* generate ie8 css using $govuk-is-ie8.
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
