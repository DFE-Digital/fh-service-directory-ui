# fh-service-directory-ui
A service directory for local authorities, voluntary, charitable and faith organisations to list and manage their services.

## Regenerate the CSS

The CSS is generated from the SASS (.scss) files. Any changes to the SASS files should automatically trigger the compilation and minification of the CSS files (at least in Visual Studio).

To manually generate and minify the CSS files, run the `sass-to-min-css` gulp task, or run the `sass-to-min-css:watch` gulp task to initiate a watcher that will automatically recompile the CSS files when the SASS files are changed.

## Regenerate the Javascript

Any changes to the Typescript (or Javascript) files, should automatically trigger the transpiling, bundling and minification of the Javascript files (at least in Visual Studio).

To manually transpile, bundle and minify the js files, run the `js` gulp task, or run the `js:watch` gulp task to initiate a watcher that will automatically run the process when the ts/js files are changed.

## Useful test data

Example Salford LA postcode:
```
m27 8ss
```

Example Tower Hamlets LA postcode:
```
e14 7pq
```