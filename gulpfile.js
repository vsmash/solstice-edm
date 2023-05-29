/* eslint-disable no-console */
const gulp = require("gulp");
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const htmlmin = require("gulp-htmlmin");
const cleanCSS = require("gulp-clean-css");
const del = require("del");
const strip = require("gulp-strip-comments");
const purgecss = require("gulp-purgecss");
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const minifyInline = require("gulp-minify-inline");
const path = require("path");

// const fs = require("fs");
// const replace = require('gulp-replace');
// const uglify = require('gulp-uglify');
// const javascriptObfuscator = require("gulp-javascript-obfuscator");
const inlinesource = require("gulp-inline-source");
// const concat = require("gulp-concat");
// const babel = require("gulp-babel");
// const path = require("path");
// const minify = require("gulp-minify");

// const rollup = require("gulp-rollup");
const cssVersion = new Date().getTime();
const sassFiles = './src/sass/**/*.scss';

// const browserify = require("browserify");
// const nodeResolve = require("resolve");
// const source = require("vinyl-source-stream");
// dev


// process the index page and manifest info
const htmldev = () =>
  gulp
    .src(["src/index.html","src/test.html","src/temp.html"])
    .pipe(inlinesource({ rootpath: path.resolve("dist") }))
    .pipe(gulp.dest("dist"));

const cssdev = () =>
  gulp
    .src(["src/styles/*.css"])
    .pipe(
      cleanCSS({ debug: true, level: 2 }, (details) => {
        console.log(`${details.name}: ${details.stats.originalSize}`);
        console.log(`${details.name}: ${details.stats.minifiedSize}`);
      })
    )
    .pipe(
      purgecss({
        content: ["src/**/*.html"],
      })
    )
    .pipe(gulp.dest("dist/css"));

const sassdev = () =>
       gulp
      .src(sassFiles)
          .pipe(sourcemaps.init()) // Lets us see the CSS source code in the inspector
          .pipe(sass()) // Transpiles SCSS to CSS
    .pipe(gulp.dest('dist/css')); // Put everything in the build directory


    const sassprod = () =>
    gulp
   .src(sassFiles)
       .pipe(sourcemaps.init()) // Lets us see the CSS source code in the inspector
       .pipe(sass()) // Transpiles SCSS to CSS
       .pipe(postcss([autoprefixer(), cssnano()])) // Add browser prefixes and minify  
       .pipe(sourcemaps.write('.')) // Create sourcemap in the same place as the CSS
 .pipe(gulp.dest('dist/css')); // Put everything in the build directory


// prod
const html = () =>
  gulp
    .src(["src/index.html","src/test.html","src/temp.html"])
    .pipe(
      htmlmin({
        collapseWhitespace: true,
        // removeOptionalTags: true,
        collapseBooleanAttributes: true,
      })
    )
    .pipe(minifyInline())
    .pipe(strip())
    .pipe(gulp.dest("dist"));

const css = () =>
  gulp
    .src("src/styles/*.css")
    .pipe(
      cleanCSS({ debug: true, level: 2 }, (details) => {
        console.log(`${details.name}: ${details.stats.originalSize}`);
        console.log(`${details.name}: ${details.stats.minifiedSize}`);
      })
    )
    .pipe(
      purgecss({
        content: ["src/**/*.html"],
      })
    )
    .pipe(gulp.dest("dist/styles"));

const purge = () => del(["dist/styles"]);

const assets = () => gulp.src("src/images/*").pipe(gulp.dest("dist/images"));

const dev = () =>
  gulp.watch(
    ["src/**/*", "version.txt"],
    { ignoreInitial: false },
    gulp.series(sassdev, htmldev, assets)
  );

exports.html = html;
exports.css = css;
exports.dev = dev;
exports.sassprod = sassprod;
exports.default = gulp.series(sassprod, css, html, assets);
