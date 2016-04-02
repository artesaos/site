var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

module.exports = function(pkgConf) {
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
      gulp.watch('./src/js/*.vue', ['watch-js']);
      gulp.watch("*.html").on("change", reload);
  });


  gulp.task('watch-css', ['styles:main'], function() {
    browserSync.reload();
  });

  gulp.task('watch-js', ['scripts:main'], function() {
    browserSync.reload()
  });

};
