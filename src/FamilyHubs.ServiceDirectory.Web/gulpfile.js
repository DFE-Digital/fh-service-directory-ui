/// <binding ProjectOpened='js:watch, sass-to-min-css:watch' />
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
    gulp.watch('./styles/**', gulp.series('sass-to-min-css'));
});

// https://www.meziantou.net/compiling-typescript-using-gulp-in-visual-studio.htm

//todo: clean to delete files in dest? & tmp folder

var tsProject;

gulp.task('transpile-ts', function () {

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

gulp.task('naive-bundle-js', () => {
    return gulp.src(['./tmp/js/app.js', './wwwroot/lib/govuk/assets/js/govuk-4.4.1.js'])
        .pipe(sourcemaps.init())
        .pipe(concat('bundle.js'))
        // inlining the sourcemap into the exported .js file
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./tmp/js'));
});

gulp.task('bundle-and-minify-js', () => {
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

gulp.task('js', gulp.series('clean', 'transpile-ts', 'naive-bundle-js', 'bundle-and-minify-js'));

//todo: single source for source - change transpiler to specify src, rather than tsconfig and use const
gulp.task('js:watch', function () {
    gulp.watch('./scripts/**', gulp.series('js'));
});
