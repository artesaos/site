'use strict';
var pkgConf = require('./package.json')["gulp-config"];
var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');
var cssmin = require('gulp-cssmin');
var concatCss = require('gulp-concat-css');
var concat = require('gulp-concat');

gulp.task('styles:main', function () {
  return gulp.src('./src/css/*.css')
    .pipe(concatCss("main.min.css"))
    .pipe(cssmin())
    .pipe(gulp.dest('./assets/css'));
});

gulp.task('styles:vendors', function () {
  var src = pkgConf.vendors.css;
  return gulp.src(src)
    .pipe(concatCss("vendors.css"))
    .pipe(gulp.dest('./assets/css'));
});

gulp.task('styles', ['styles:main', 'styles:vendors'])

gulp.task('scripts:vendors', function () {
  var src = pkgConf.vendors.js;
  return gulp.src(src)
    .pipe(concat("vendors.js"))
    .pipe(gulp.dest('./assets/js'));
});

gulp.task('scripts:main', function () {
  // set up the browserify instance on a task basis
  var b = browserify({
    entries: './src/js/index.js',
    debug: true
  });

  return b.bundle()
    .pipe(source('app.min.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
        // Add transformation tasks to the pipeline here.
        .pipe(uglify())
        .on('error', gutil.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./assets/js/'));
});

gulp.task('scripts', ['scripts:main', 'scripts:vendors'])

gulp.task('default', ['scripts', 'styles']);
