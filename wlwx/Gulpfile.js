var gulp = require('gulp'),
  requirejs = require('requirejs'),
  minifycss = require('gulp-minify-css'),
  jshint = require('gulp-jshint'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
  htmlmin = require('gulp-htmlmin'),
  clean = require('gulp-clean');

// 清理dist目录
gulp.task('clean_dist', function() {
  return gulp.src('dist', {
      read: false
    })
    .pipe(clean());
});

gulp.task('pack_root', ['clean_dist'], function() {
  return gulp.src('app/*.*')
    .pipe(gulp.dest('dist'));
});

gulp.task('pack_html', ['clean_dist'], function() {
  var options = {
    removeComments: true, //清除HTML注释
    collapseBooleanAttributes: true, //省略布尔属性的值 <input checked="true"/> ==> <input />
    removeEmptyAttributes: true, //删除所有空格作属性值 <input id="" /> ==> <input />
    removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
    removeStyleLinkTypeAttributes: true, //删除<style>和<link>的type="text/css"
    minifyJS: true, //压缩页面JS
    minifyCSS: true //压缩页面CSS
  };

  return gulp.src('app/html/**/*.html')
    .pipe(htmlmin(options))
    .pipe(gulp.dest('dist/html'));
});

gulp.task('pack_css', ['clean_dist'], function() {
  return gulp.src('app/css/main.css')
    .pipe(gulp.dest('dist/css'));
});

gulp.task('pack_other', ['clean_dist'], function() {
  return gulp.src('app/*(img|font|json)/*')
    .pipe(gulp.dest('dist/'));
});

//需要优先加载
gulp.task('pack_requirejs', ['clean_dist'], function() {
  return gulp.src('app/bower_components/requirejs/require.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist/bower_components/requirejs'));
});

//IE注释的加载
gulp.task('pack_html5shiv', ['clean_dist'], function() {
  return gulp.src('app/bower_components/html5shiv/dist/html5shiv.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist/bower_components/html5shiv/dist'));
});

gulp.task('minify_js', ['clean_dist'], function() {
  requirejs.optimize({
    baseUrl: "app/js",
    mainConfigFile: "app/js/main.js",
    name: 'main',
    out: 'dist/js/main.js'
  });
});

gulp.task('default', [
  'pack_root', 'pack_html', 'pack_css', 'pack_other', 'pack_requirejs', 'pack_html5shiv', 'minify_js'
]);
