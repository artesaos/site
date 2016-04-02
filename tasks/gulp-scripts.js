var gulp = require('gulp');
var path = require('path');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var vueify = require('vueify');
var shortify = require('shortify');

module.exports = function (pkgConf) {
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
        'src::': (path.join(pkgConf.ROOT, '/src/js/') + path.sep),
        'components::': (path.join(pkgConf.ROOT, '/src/js/components/') + path.sep)
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
};
