"use strict";

var gulp = require("gulp"),
    sass = require('gulp-sass')(require('sass')),
    sourcemaps = require('gulp-sourcemaps'),
    csso = require('gulp-csso'),
    terser = require('gulp-terser'),
    ts = require("gulp-typescript"),
    rollup = require('gulp-better-rollup'),
    concat = require('gulp-concat');

gulp.task('sass-to-min-css', async function () {
    return gulp.src('./styles/scss/application.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(csso())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./wwwroot/css'));
});

gulp.task('sass-to-min-css:watch', function () {
    gulp.watch('./wwwroot/scss/application.scss', gulp.series('sass-to-min-css'));
});

// https://www.meziantou.net/compiling-typescript-using-gulp-in-visual-studio.htm

//todo: split into compile and bundle tasks, and have a task that series them?

var tsProject;

gulp.task("transpile-ts", function () {

    if (!tsProject) {
        tsProject = ts.createProject("tsconfig.json");
    }

    var reporter = ts.reporter.fullReporter();
    var tsResult = tsProject.src()
        .pipe(sourcemaps.init())
        .pipe(tsProject(reporter));

    return tsResult.js
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("./tmp/js"));
});

gulp.task('bundle-js', () => {
    return gulp.src(['./tmp/js/app.js', './scripts/govuk-4.4.1.js'])
        .pipe(sourcemaps.init())
        .pipe(concat('bundle.js'))
        .pipe(rollup({}, 'es'))
        .pipe(terser())
        // inlining the sourcemap into the exported .js file
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./wwwroot/js'));
});
