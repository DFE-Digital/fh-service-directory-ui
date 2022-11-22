# Todo

* app services doesn't support codeless app insights with .net 7
add manually (Martin may have done something in shared)

* optimse css and js

* improve sass integration

current instructions:
install sass _globally_, using
`npm install -g sass`

run
`npm run-script sass`
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
