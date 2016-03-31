'use strict';

var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');
var cssmin = require('gulp-cssmin');
var concatCss = require('gulp-concat-css');

gulp.task('styles', function () {
  return gulp.src('./src/css/*.css')
    .pipe(concatCss("style.min.css"))
    .pipe(cssmin())
    .pipe(gulp.dest('./assets/css'));
});

gulp.task('browserify', function () {
  // set up the browserify instance on a task basis
  var b = browserify({
    entries: './src/js/main.js',
    debug: true
  });

  return b.bundle()
    .pipe(source('main.min.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
        // Add transformation tasks to the pipeline here.
        .pipe(uglify())
        .on('error', gutil.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./assets/js/'));
});

gulp.task('default', ['browserify', 'styles']);
