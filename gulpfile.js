const gulp = require('gulp')
const postcss = require('gulp-postcss')
const babel = require('gulp-babel')

const  paths = {
  styles: {
    src: './src/css/**/*.css',
    dest: './dist/css/'
  },
  scripts : {
    src: './src/js/app.js',
    dest: './dist/js/'
  }
}

function styles() {
  return gulp.src(paths.styles.src)
    .pipe(postcss([
      require('tailwindcss'),
      require('autoprefixer'),
      // require('@fullhuman/postcss-purgecss')({
      //   content: [
      //     './index.html'
      //   ],
      //   defaultExtractor: content => content.match(/[A-Za-z0-9-_:/]+/g) || []
      // }),

    ]))
    .pipe(gulp.dest(paths.styles.dest))
}



function scripts() {
  return gulp.src(paths.scripts.src)
    .pipe(babel({
      presets: [['@babel/preset-env',{modules: false} ]]
    }))
    .pipe(gulp.dest(paths.scripts.dest))
}

function watch() {
  gulp.watch(paths.styles.src, styles)
  gulp.watch('./index.html', styles)
  gulp.watch(paths.scripts.src, scripts)
}

function run() {
  return gulp.series( styles, scripts, watch)()
}

// exports.styles = styles
exports.scripts = scripts
exports.styles = styles
exports.watch = watch
exports.default = run