const gulp = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const babel = require('gulp-babel')

const  paths = {
  styles: {
    src: './src/scss/**/*.scss',
    dest: './dist/css/'
  },
  scripts : {
    src: './src/js/app.js',
    dest: './dist/js/'
  }
}

function styles() {
  return gulp.src(paths.styles.src)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(paths.styles.dest))
}

function scripts() {
  return gulp.src(paths.scripts.src)
    .pipe(babel({
      presets: ['@babel/preset-env']
    }))
    .pipe(gulp.dest(paths.scripts.dest))
}

function watch() {
  gulp.watch(paths.styles.src, styles)
  gulp.watch(paths.scripts.src, scripts)
}

function run() {
  return gulp.series( styles, scripts, watch)()
}

exports.styles = styles
exports.scripts = scripts
exports.watch = watch
exports.default = run