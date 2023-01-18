"use strict";

var gulp = require("gulp"),
    sass = require('gulp-sass')(require('sass')),
    sourcemaps = require('gulp-sourcemaps'),
    csso = require('gulp-csso'),
    //concat = require('gulp-concat')
    ts = require("gulp-typescript");

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

//gulp.task('scripts', function () {
//    return gulp.src('./scripts/*.js')
//        .pipe(concat('all.js'))
//        .pipe(gulp.dest('./dist/'));
//});


// https://www.meziantou.net/compiling-typescript-using-gulp-in-visual-studio.htm

var tsProject;

gulp.task("js", function () {

    if (!tsProject) {
        tsProject = ts.createProject("tsconfig.json");
    }

    var reporter = ts.reporter.fullReporter();
    var tsResult = tsProject.src()
        .pipe(sourcemaps.init())
        .pipe(tsProject(reporter));

    return tsResult.js
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("./wwwroot/js"));
});