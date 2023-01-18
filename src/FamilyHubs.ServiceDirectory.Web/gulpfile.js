"use strict";

var gulp = require("gulp"),
    sass = require('gulp-sass')(require('sass'));

gulp.task('sass-to-css', async function () {
    return gulp.src('./styles/scss/application.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./wwwroot/css'));
});

gulp.task('sass-to-css:watch', function () {
    gulp.watch('./wwwroot/scss/application.scss', gulp.series('sass-to-css'));
});