'use strict';

var gulp = require('gulp');
var webserver = require('gulp-webserver');

/* AUTOMATED LAUNCH */
gulp.task('default', ['webserver']);

// Launch webserver
gulp.task('webserver', function() {
  return gulp.src("./app")
    .pipe(webserver({
      host: 'localhost',
      port: '8080',
      livereload: true,
      open: true
    }));
});
