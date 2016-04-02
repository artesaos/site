'use strict';
var pkgConf = require('./package.json')["gulp-config"];
var gulp = require('gulp');
var path = require('path');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');
var cssmin = require('gulp-cssmin');
var concatCss = require('gulp-concat-css');
var concat = require('gulp-concat');
var vueify = require('vueify');
var pathmodify = require('pathmodify');
var browserSync = require('browser-sync').create();
var reload      = browserSync.reload;
var shortify = require('shortify');

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

  var transform = shortify({
      'src::': (path.join(__dirname, '/src/js/') + path.sep),
      'components::': (path.join(__dirname, '/src/js/components/') + path.sep)
    });

  b.transform(transform);
  b.transform(vueify);

  return b.bundle()
    .pipe(source('app.min.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
        // Add transformation tasks to the pipeline here.
        // .pipe(uglify())
        .on('error', gutil.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./assets/js/'));
});

gulp.task('scripts', ['scripts:main', 'scripts:vendors'])

gulp.task('watch-css', ['styles'], function(){
  browserSync.reload();
});

gulp.task('watch-js', ['scripts'], function(){
  browserSync.reload()
});

gulp.task('serve', ['scripts', 'styles'], function () {

    // Serve files from the root of this project
    browserSync.init({
        server: "./",
        port: 8080,
    });

    // add browserSync.reload to the tasks array to make
    // all browsers reload after tasks are complete.
    gulp.watch('./src/css/*.css', ['watch-css']);
    gulp.watch('./src/js/*.js', ['watch-js']);
    gulp.watch("*.html").on("change", reload);
});

gulp.task('default', ['scripts', 'styles']);
