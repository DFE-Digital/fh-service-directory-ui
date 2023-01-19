"use strict";

var gulp = require("gulp"),
    sass = require('gulp-sass')(require('sass')),
    sourcemaps = require('gulp-sourcemaps'),
    csso = require('gulp-csso'),
    terser = require('gulp-terser'),
    ts = require("gulp-typescript"),
    rollup = require('gulp-better-rollup'),
    concat = require('gulp-concat'),
    del = require('del');

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
//todo: clean to delete files in dest? & tmp folder
//todo: watches / integration using task runner
//todo: check maps ok by debugging in vs

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
    return gulp.src(['./tmp/js/app.js', './wwwroot/lib/govuk/assets/js/govuk-4.4.1.js'])
        .pipe(sourcemaps.init())
        .pipe(concat('bundle.js'))
        // inlining the sourcemap into the exported .js file
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./tmp/js'));
});

gulp.task('bundle-js2', () => {
    return gulp.src('./tmp/js/bundle.js')
        .pipe(sourcemaps.init())
        .pipe(rollup({}, 'es'))
        .pipe(terser())
        // inlining the sourcemap into the exported .js file
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./wwwroot/js'));
});


gulp.task('clean', () => {
    return del('./tmp/**');
});