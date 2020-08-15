const { src, dest, watch, parallel, series } = require("gulp")
const sass = require("gulp-sass")
const cssnano = require('gulp-cssnano')
const rename = require("gulp-rename")
const sourcemaps = require('gulp-sourcemaps')
const browserSync = require('browser-sync')
const pug = require("gulp-pug")
const pugLinter = require('gulp-pug-linter')
const del = require('del')
const autoprefixer = require('gulp-autoprefixer')
const svgSprite = require("gulp-svg-sprite")
const imagemin = require('gulp-imagemin')

function styles() {
  return src("./src/scss/*.scss")
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(cssnano())
    .pipe(sourcemaps.write('.'))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(dest("./dist/css"))
    .pipe(browserSync.stream())
}

function pug2html() {
  return src('./src/views/*.pug')
    .pipe(pugLinter({
      reporter: 'default'
    }))
    .pipe(pug({
      pretty: true
    })) 
    .pipe(dest('./dist'))
    .pipe(browserSync.stream())
}

function svg() {
  return src('./src/assets/icons/*.svg')
    .pipe(svgSprite({
      mode: {
        stack: {
          sprite: '../spite.svg'
        }
      }
    }))
    .pipe(dest('./dist/images'))
    .pipe(browserSync.stream())
}

function images() {
  return src('./src/assets/images/*')
    .pipe(imagemin([
      imagemin.gifsicle({ interlaced: true }),
      imagemin.mozjpeg({
        quality: 75,
        progressive: true
      }),
      imagemin.optipng({ optimizationLevel: 5 }),
    ]))
    .pipe(dest('./dist/images'))
    .pipe(browserSync.stream())
}

function clean() {
  return del('./dist')
}

function watchFiles() {
  browserSync.init({
    server: {
      baseDir: './dist'
    }
  })

  watch('./src/scss/*.scss', styles)
  watch('./src/views/*.pug', pug2html)
  watch('./src/assets/images/.*', images)
  watch('./src/assets/icons/*.svg', svg)
}

exports.default = series(clean, parallel(pug2html, styles, images, svg), watchFiles)