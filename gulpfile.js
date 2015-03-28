var gulp = require('gulp');
var del = require('del');
var argv = require('yargs').argv;
var gulpif = require('gulp-if');
var connect = require('gulp-connect');
var uglify = require('gulp-uglify');
var babel = require('gulp-babel');
var webpack = require('gulp-webpack');
var webpackConfig = require('./webpack.config.js');

var port = process.env.PORT || 8080;
var reloadPort = process.env.RELOAD_PORT || 35729;

gulp.task('clean', function () {
  return del.sync(['lib', 'build']);
});

// convert to es5 from es6 src modules with babel
gulp.task('lib', function (cb) {
  return gulp.src('./src/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest('lib/'));
});

// build for examples with webpack
gulp.task('build', ['lib'], function () {
  return gulp.src(webpackConfig.entry.demo[0])
    .pipe(webpack(webpackConfig))
    .pipe(gulpif(argv.production, uglify()))
    .pipe(gulp.dest('build/'));
});

gulp.task('serve', function () {
  connect.server({
    port: port,
    livereload: {
      port: reloadPort
    }
  });
});

gulp.task('reload-js', function () {
  return gulp.src('./build/*.js')
    .pipe(connect.reload());
});

gulp.task('watch', function () {
  gulp.watch(['./build/*.js'], ['reload-js']);
});

gulp.task('default', ['clean', 'lib', 'build', 'serve', 'watch']);
