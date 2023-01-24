# fh-service-directory-ui

A service directory to list the services and family hubs provided by local authorities in the UK.

## Set up a development environment

The web site uses two services, the service directory API and postcodes.io.

### Service Directory API

The service directory API is a custom DfE API. You can either [clone it fron GitHub](https://github.com/DFE-Digital/fh-service-directory-api) and run it locally, or use the development API.

The endpoint of the service directory API is retrieved from the `ServiceDirectoryAPI:Endpoint` config. `AppSettings.json` contains the default URL when running the API locally.

If you want to use the development API, ask a team member for the endpoint URL and set it in user secrets.

### Postcodes.io API

[Postcodes.io](https://postcodes.io/) is an external API that accepts anonymous requests. The correct enpoint is already in the `AppSettings.json` file, so it should just work.

## Regenerate the CSS

The CSS is generated from the SASS (.scss) files. If you are using Visual Studio, any changes to the SASS files should automatically trigger the compilation and minification of the CSS files. In Rider, follow these [instructions](https://www.jetbrains.com/help/rider/Using_Gulp_Task_Runner.html#ws_gulp_running_tasks_from_tasks_tree).

To manually generate and minify the CSS files, run the `sass-to-min-css` gulp task, or run the `sass-to-min-css:watch` gulp task to initiate a watcher that will automatically recompile the CSS files when the SASS files are changed.

The entry point for the site's SASS is `styles\scss\application.scss`.

## Regenerate the JavaScript

In Visual Studio, any changes to the Typescript (or JavaScript) files, should automatically trigger the transpiling, bundling and minification of the Javascript files. In Rider, follow these [instructions](https://www.jetbrains.com/help/rider/Using_Gulp_Task_Runner.html#ws_gulp_running_tasks_from_tasks_tree).

The bundling process supports the use of ECMAScript modules.

To manually transpile, bundle and minify the js files, run the `js` gulp task, or run the `js:watch` gulp task to initiate a watcher that will automatically run the process when the ts/js files are changed.

The entry point for the site's JavaScript is `scripts\app.ts`. This file imports the other modules that make up the site's JavaScript. That is then bundled with GOVUK's JavaScript.

## Debugging the JavaScript in Visual Studio

To debug the JavaScript in Visual Studio, set breakpoints in the JavaScript files under the `Script documents` folder in the Solution Explorer when debugging.

(Note, we might switch to [environment-based bundling and minification at a later point](https://learn.microsoft.com/en-us/aspnet/core/client-side/bundling-and-minification?view=aspnetcore-6.0).)

## Useful test data

Example Salford LA postcode:
```
m27 8ss
```

Example Tower Hamlets LA postcode:
```
e14 7pq
```