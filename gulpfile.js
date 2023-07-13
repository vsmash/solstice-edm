/* eslint-disable no-console */
const gulp = require("gulp");
const sass = require('gulp-sass')(require('sass'));
const file = require('gulp-file');
const fs = require('fs');
const replace = require("gulp-replace");
const rename = require("gulp-rename");
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
const inlinesource = require("gulp-inline-source");
const cssVersion = new Date().getTime();
const sassFiles = './src/sass/**/*.scss';
const currentDate = new Date();
const zip = require('gulp-zip');
const formatHTML = require('gulp-format-html');
const indailylunchtime ={
  folder: 'indaily-lunchtime',
  featuredheadline : 'left',
  text: 'left',
  preheader: 'left',
  viewonline: 'left',
  midboard: 'centre',
  topstories: 'left',
  breaking: 'left',
  exclusive: 'left',
  mrec: 'centre',
  presspatron: 'centre',
  showcase: 'centre',
  showcaseend: 'centre',
  inreview: 'centre',
  imageblock: 'centre',
}


const source=indailylunchtime;

// template build
function createHTML(template, variables) {
  let html = template.replace("##readmorelink##", readmorelink);
  return html.replace(/\{\{(\w+)\}\}/g, function(match, variable) {
    return variables[variable] || '';
  });
}

function buildTemplate(innertemplate, labelname, thiswrapper=wrapperNoLine){
    let html  = createHTML(innertemplate,{content:labelname});
    html = createHTML(thiswrapper,{content:html,itemlabel:labelname});
    // append to repeater
    return html;
}

function readTemplate(templatePath) {
  sourcfolder = source.folder;
  try {
    const contents = fs.readFile('templates/'+sourcefolder+'/'+templatePath+'.html', 'utf8');
    const template = contents.replace(/\r?\n|\r/g, ''); // Remove line breaks for a single-line string
    return contents;
  } catch (err) {
    const contents = fs.readFileSync('templates/'+templatePath+'.html', 'utf8');
    return contents;
  }

}
const left = function(content){
  return readTemplate('left').replace("{{content}}",content);
};
const centre = function(content){
  return readTemplate('centre').replace("{{content}}",content);
};


const readmorelink = readTemplate('readmorelink');
const readmore = readTemplate('readmoretr').replace("##readmorelink##",readmorelink);
const hr = readTemplate('hr');
const wrapper = readTemplate('wrapper').replace("{{hr}}",hr);
const wrapperNoLine = readTemplate('wrapper').replace("{{hr}}","");
const mtwrapper = readTemplate('emptywrapper');
const emptyWrapper = mtwrapper.replace("{{hr}}",hr);
const category = readTemplate('category');
const headline = readTemplate('headline');
const featureheadline = left(readTemplate('featuredheadline'));
const storyimg = readTemplate('storyimg');
const img2col = readTemplate('img2col');
const storycopy = readTemplate('storycopy');
const featuredcopy =readTemplate('featuredcopy');
const twocolumnstory = readTemplate('twocolumnstory'); 
const tennewsicon = readTemplate('tennewsicon');
const text = left(readTemplate('text'));

// specific templates
const preheader = left(readTemplate('preheader'));
const viewonline = left(readTemplate('viewonline'));
const header = readTemplate('header');
const banner = readTemplate('banner');
const midboard = centre(readTemplate('midboard'));
const oldmidboard = readTemplate('oldmidboard');
const topstories = left(readTemplate('topstories'));
const breaking = left(readTemplate('breaking'));
const exclusive = left(readTemplate('exclusive'));
const mrec = centre(readTemplate('mrec'));
const twocolumn = readTemplate('twocolumn');
const fullwidthheading = readTemplate('fullwidthheading');
const presspatron = centre(readTemplate('presspatron'));
const showcase = centre(readTemplate('showcase'));
const showcaseend = centre(readTemplate('showcaseend'));
const inreview = centre(readTemplate('inreview'));
const imageblock = centre(readTemplate('imageblock'));

const templates = [
  'readmorelink', 'readmoretr', 'hr', 'wrapper', 'emptywrapper', 'category', 'headline', 'featuredheadline', 'storyimg', 'img2col', 'storycopy', 'featuredcopy', 'twocolumnstory', 'tennewsicon', 'text', 'preheader', 'viewonline', 'header', 'banner', 'midboard', 'oldmidboard', 'topstories', 'breaking', 'exclusive', 'mrec', 'twocolumn', 'fullwidthheading', 'presspatron', 'showcase', 'showcaseend', 'inreview', 'imageblock'
]


const buildit = () => {
  var folder=source.folder;
  let template = "";
  template += buildTemplate(preheader,'Preheader');
  template += buildTemplate(viewonline,'View Online');
  template += buildTemplate(header,'HEADER');
  template += buildTemplate(banner,'Banner', wrapper);
  template += buildTemplate(oldmidboard,'Advertisement (mid-board)');
  template += buildTemplate(topstories,"Section Block",wrapper);
  template += buildTemplate(left(storyimg)+left(category)+createHTML(featureheadline,{content:"Feature Story w/ Category"})+featuredcopy+readmore,"Feature Story w/ Category", wrapper);
  template += buildTemplate(left(storyimg)+createHTML(featureheadline,{content:"Feature Story"})+featuredcopy+readmore,"Feature Story", wrapper);
  template += buildTemplate(left(category)+createHTML(featureheadline,{content:"Feature Story no image"})+featuredcopy+readmore,"Feature Story no image", wrapper);
  template += buildTemplate(createHTML(twocolumnstory,{headline:createHTML(headline,{content:"1 Story (2 column)"},"{{content}}"),category:category,icon:""}),"1 Story (2 column)", emptyWrapper);
  template += buildTemplate(createHTML(twocolumnstory,{headline:createHTML(headline,{content:"1 Story (No Category)"},"{{content}}"),category:"",icon:""}),"1 Story (No Category)", emptyWrapper);
  template += buildTemplate(createHTML(twocolumnstory,{headline:createHTML(headline,{content:"Video Story with Icon"},"{{content}}"),category:"",icon:tennewsicon}),"Video Story with Icon", emptyWrapper);
  template += buildTemplate(createHTML(twocolumn,{headline:createHTML(headline,{content:"2 column"},"{{content}}"),category:"",image:img2col,icon:""}),"2 column", emptyWrapper);
  template += buildTemplate(mrec,"Advertisement (mrec)");
  template += buildTemplate(createHTML(twocolumn,{headline:createHTML(headline,{content:"2 Column w/ Category"}),category:category,image:img2col,icon:""}),"2 Column w/ Category", emptyWrapper);
  template += buildTemplate(createHTML(twocolumn.replace('##readmorelink##',''),{headline:createHTML(headline,{content:"2 Column w/ Category No Readmore"}),category:category,image:img2col,icon:""}),"2 Column w/ Category No Readmore", emptyWrapper);
  template += buildTemplate(left(category),"Category");
  template += buildTemplate(text,"Text");
  template += buildTemplate(breaking,"BREAKING");
  template += buildTemplate(exclusive,"EXCLUSIVE");
  template += buildTemplate(left(storyimg)+left(exclusive)+createHTML(featureheadline,{content:"EXCLUSIVE Feature Story"})+featuredcopy+readmore,"EXCLUSIVE Feature Story", wrapper);
  template += buildTemplate(left(storyimg)+left(breaking)+createHTML(featureheadline,{content:"BREAKING Feature Story"})+featuredcopy+readmore,"BREAKING Feature Story", wrapper);
  template += buildTemplate(left(fullwidthheading),"Full Width Heading", wrapper);
  template += buildTemplate(presspatron,"Press Patron");
  template += buildTemplate(showcase,"Regional Showcase");
  template += buildTemplate(showcaseend,"Regional Showcase - END SECTION");
  template += buildTemplate(imageblock,"Image Block");
  return template;
  }

const zipit = () =>
  gulp.src('dist/images/*')
  .pipe(zip('images.zip'))
  .pipe(gulp.dest('dist'));


// build

const htmldev = () =>
  gulp
    .src(['templates/'+ source.folder+'/index.html'])
    .pipe(replace("{{repeater}}", buildit()))
    .pipe(inlinesource({ rootpath: path.resolve("dist") }))
    .pipe(gulp.dest("dist"));
  
const demo = () =>
  gulp
    .src(['templates/'+ source.folder+'/index.html'])
    .pipe(replace("{{repeater}}", buildit()))
    .pipe(replace("<currentday>", new Date().getDate()))
    .pipe(replace("<currentmonthname>", currentDate.toLocaleString('default', { month: 'long' })))
    .pipe(replace("<currentyear>", currentDate.toLocaleString('default', { year: 'numeric' })))
    .pipe(rename("demo.html"))
    .pipe(formatHTML())
    .pipe(inlinesource({ rootpath: path.resolve("dist") }))
    .pipe(gulp.dest("dist"));

    const oldversion = () =>
    gulp
      .src(['templates/'+ source.folder+"/oldversion.html"])
      .pipe(rename("oldversion.html"))
      .pipe(formatHTML())
      .pipe(inlinesource({ rootpath: path.resolve("dist") }))
      .pipe(gulp.dest("dist"));
  

const cssdev = () =>
  gulp
    .src(["dist/styles/*.css"])
    .pipe(
      cleanCSS({ debug: true, level: 2 }, (details) => {
        console.log(`${details.name}: ${details.stats.originalSize}`);
        console.log(`${details.name}: ${details.stats.minifiedSize}`);
      })
    )
    .pipe(
      purgecss({
        content: ["templates/"+source.folder+"/**/*.html"],
      })
    )
    .pipe(gulp.dest("dist/css"));

const sassdev = () =>
       gulp
      .src('templates/'+source.folder+'/sass/**/*.scss')
          .pipe(sourcemaps.init()) // Lets us see the CSS source code in the inspector
          .pipe(sass()) // Transpiles SCSS to CSS
    .pipe(gulp.dest('dist/css')); // Put everything in the build directory


    const sassprod = () =>
    gulp
   .src('./templates/'+source.folder+'/sass/**/*.scss')
       .pipe(sourcemaps.init()) // Lets us see the CSS source code in the inspector
       .pipe(sass()) // Transpiles SCSS to CSS
       .pipe(postcss([autoprefixer(), cssnano()])) // Add browser prefixes and minify  
       .pipe(sourcemaps.write('.')) // Create sourcemap in the same place as the CSS
 .pipe(gulp.dest('dist/css')); // Put everything in the build directory


const compare = () =>
  gulp
    .src(["src/compare.html"])
    .pipe(gulp.dest("dist"));


const html = () =>
  gulp
  .src(['templates/'+ source.folder+'/index.html'])
    .pipe(replace("{{repeater}}", buildit(source)))
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
  .src(["dist/styles/*.css"])
  .pipe(
      cleanCSS({ debug: true, level: 2 }, (details) => {
        console.log(`${details.name}: ${details.stats.originalSize}`);
        console.log(`${details.name}: ${details.stats.minifiedSize}`);
      })
    )
    .pipe(
      purgecss({
        content: ["templates/"+source.folder+"/**/*.html"],
      })
    )
    .pipe(gulp.dest("dist/styles"));

const purge = () => del(["dist/styles","dist/css"]);

const assets = () => gulp.src("templates/"+source.folder+"/images/*").pipe(gulp.dest("dist/images"));

const dev = () =>
  gulp.watch(
    ["src/**/*", "version.txt","templates/**/*"],
    { ignoreInitial: false },
    gulp.series(assets,sassdev,demo, htmldev, zipit, purge)
    // gulp.series(assets(indailylunchtime), sassdev(indailylunchtime), demo(indailylunchtime), htmldev(indailylunchtime), oldversion(indailylunchtime), zipit)
  );

exports.html = html;
exports.css = css;
exports.dev = dev;
exports.sassprod = sassprod;
exports.demo = demo;
exports.zipit = zipit;
exports.default = gulp.series(assets,sassprod, css, html, demo, oldversion, zipit);
