const gulp = require('gulp');
const sass = require('gulp-sass');
const ts = require('gulp-typescript');
let tsProject = ts.createProject("tsconfig.json");
const browserSync = require('browser-sync').create();

gulp.task('sass', function(){
  return gulp.src('./sass/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./public/css'))
    .pipe(browserSync.stream());
});

gulp.task('serve', ['sass'], function(){

  browserSync.init({
    server: './public/'
  })
  gulp.watch('./sass/*.scss', ['sass']);
  gulp.watch('./ts/*.ts', ['ts']);
  gulp.watch('.*.html').on('change', browserSync.reload);
  gulp.watch('./*.js').on('change', browserSync.reload);
});

gulp.task('ts', function(){
  // return gulp.src('./ts/*.ts')
  //   .pipe(typescript())
  //   .pipe(gulp.dest('./public'))
  //   .pipe(browserSync.stream());
  return tsProject.src()
    .pipe(tsProject())
    .js.pipe(gulp.dest('./public'));
});

gulp.task('default', ['serve']);