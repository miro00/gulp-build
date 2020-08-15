const {src, dest, watch, parallel, series} = require("gulp")
const sass = require("gulp-sass")
const rename = require("gulp-rename")

function styles() {
  return src("./src/scss/*.scss")
    .pipe(sass())
    .pipe(rename({
      extname: ".min"
    }))
    .pipe(dest("./dist/css"))
}

exports.default = series(styles)