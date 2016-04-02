var gulp = require('gulp');
var cssmin = require('gulp-cssmin');
var concatCss = require('gulp-concat-css');

module.exports = function (pkgConf) {
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

  gulp.task('styles', ['styles:main', 'styles:vendors']);
};
