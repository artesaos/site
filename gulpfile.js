'use strict';
var pkgConf = require('./package.json')["gulp-config"];
var gulp   = require('gulp');
var browserSync = require('browser-sync').create();
var fs = require('fs');
var path = require('path');

pkgConf.ROOT = __dirname;

fs.readdirSync('./tasks')
  .filter(function (file) {
    return (/^gulp\-([a-z0-9-_]+)\.(js|coffee)$/i).test(file);
  })
  .map(function (file) {
    require(path.join(pkgConf.ROOT, 'tasks', file))(pkgConf);
  });

gulp.task('default', ['scripts', 'styles']);
