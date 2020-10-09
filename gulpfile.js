const fs = require("fs");
const gulp = require("gulp");
const sass = require("gulp-sass");
const gulpClean = require("gulp-clean");
const gulpZip = require("gulp-zip");
const imagemin = require("gulp-imagemin");

const { watch, series, parallel } = gulp;

const extImg = ["png", "gif", "jpg", "jpeg"].join("|");
const extCss = ["css", "scss"].join("|");

const css = () =>
  gulp
    .src(`src/**/*.*(${extCss})`)
    .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
    .pipe(gulp.dest("tmp"));

const clean = () =>
  gulp.src("tmp", { read: false, allowEmpty: true }).pipe(gulpClean());

const copy = () =>
  gulp.src([`src/**/*.!(${extImg}|${extCss})`]).pipe(gulp.dest("tmp"));

const img = () =>
  gulp.src(`src/**/*.*(${extImg})`).pipe(imagemin()).pipe(gulp.dest("tmp"));

const zip = parallel(
  fs.readdirSync("tmp").map((template) => () =>
    gulp
      .src(`tmp/${template}/**`)
      .pipe(gulpZip(`${template}.zip`))
      .pipe(gulp.dest("./dist"))
  )
);

exports.default = () => watch("src/**/*.*(scss|css)", css);
exports.deploy = series(clean, copy, parallel(css, img), zip);
exports.copy = series(clean, copy);
exports.css = css;
