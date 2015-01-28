'use strict';

var gulp = require('gulp');
var clean = require('gulp-clean');
var gulpEjs = require('../index');
var gulpSequence = require('gulp-sequence');

module.exports = function () {

  gulp.task('clean', function () {
    return gulp.src(['test/templates.js'])
    .pipe(clean({force: true}));
  });

  gulp.task('ejsTemplate', function () {
    return gulp.src('test/fixtures/*.html')
    .pipe(gulpEjs())
    .pipe(gulp.dest('test'));
  });

  gulp.task('test', gulpSequence('clean', 'ejsTemplate'));
};
