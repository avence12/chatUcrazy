var gulp = require('gulp');
//var rev = require('gulp-rev-append');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch')
var md5 = require("md5-file");
var replace = require('gulp-replace')

// Rerun the task when a file changes
gulp.task('scripts', function () {
  return gulp.src(['**/*.js'])
          .pipe(gulp.dest('dist'))
          .pipe(uglify())
          .pipe(gulp.dest('dist'));
});
