/* eslint-disable no-console */
const gulp = require("gulp");
const sass = require('gulp-sass')(require('sass'));
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



// template build
function createHTML(template, variables) {
  return template.replace(/\{\{(\w+)\}\}/g, function(match, variable) {
    return variables[variable] || '';
  });
}

function buildTemplate(innertemplate, labelname){
    let html  = createHTML(innertemplate,{content:labelname});
    html = createHTML(wrapper,{content:html,itemlabel:labelname});
    // append to repeater
    return html;
}


const left = function(content){
  return `
  <tr>
      <td class="left">
          ${content}
      </td>
  </tr>
  `;
};
const centre = function(content){
  return `
  <tr>
      <td class="center" align="center">
          ${content}
      </td>
  </tr>
  `;
};
const wrapper = `
<layout label="{{itemlabel}}">
<table class="row">
  <tr>
    <td align="center">
      <table class="wrapper">
        <tr>
          <td>
                          <table class="presentation">
                           {{content}}
                          </table>
                      </td>
                  </tr>
      </table>
    </td>
  </tr>
</table>
</layout>
`;
const category = `
<tr>
  <td class="category">
      <singleline>CATEGORY</singleline>
  </td>
</td>
`;
const headline = `
<tr>
  <td class="headline">
      <h2><singleline>{{content}}</singleline></h2>
  </td>
</td>
`;
const featureheadline = `
<tr>
  <td class="featureheadline">
     <h1><singleline>{{content}}</singleline></h1>
  </td>
</td>
`;
const storyimg = `
<tr>
  <td class="storyimg">
      <img editable="true" alt="Image:" border="0" src="images/story-placeholder.jpg" width="600">
  </td>
</td>
`;
const img2col = `
<tr>
  <td class="img2col">
      <a href=""><img
      editable="true"
      alt="Image:"
      border="0"
      src="images/story-placeholder.jpg"
      width="290" /></a>
  </td>
</tr>
`;
const storycopy = `
<tr>
  <td class="storycopy">
      <multiline>Story copy. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam consectetur lacus sit amet elit scelerisque iaculis. Praesent non quam quis turpis mollis posuere. Maecenas odio lectus, lobortis ut nunc in, ultrices mollis erat. Donec nec tristique elit, non porta arcu. Maecenas lacus ex, vehicula nec finibus sed, tincidunt id quam.</multiline>
  </td>
</tr>
`;
const featuredcopy = `
<tr>
  <td class="featuredcopy"><multiline>
      Featured story copy. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam consectetur lacus sit amet elit scelerisque iaculis. Praesent non quam quis turpis mollis posuere. Maecenas odio lectus, lobortis ut nunc in, ultrices mollis erat. Donec nec tristique elit, non porta arcu. Maecenas lacus ex, vehicula nec finibus sed, tincidunt id quam.</multiline>
  </td>
</tr>
`;
const readmore = `
<tr class="readmore">
  <td class="readmore">
      <a href="" editable="true">Read More</a>
  </td>
</tr>
`;
const twocolumnstory = `
<tr>
  <td class="leftcol block" valign="top">
      <a href=""><img
      editable="true"
      alt="Image:"
      border="0"
      src="images/story-placeholder.jpg"
      width="290" /></a>
  </td>
  <td class="rightcol block">
      <table>
          {{category}}
          {{icon}}
          <tr><td><h2><singleline>{{headline}}</singleline></h2></td></tr>
          <tr><td><multiline>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam consectetur lacus sit amet elit scelerisque iaculis. Praesent non quam quis turpis mollis posuere. Maecenas odio lectus, lobortis ut nunc in, ultrices mollis erat. Donec nec tristique elit, non porta arcu. Maecenas lacus ex, vehicula nec finibus sed, tincidunt id quam.</multiline></td></tr>
      </table>
  </td>
</tr>
`
const tennewsicon = `
<tr><td>
  <table border="0"
      cellpadding="0"
      cellspacing="0"
      width="100%">
      <tr>
          <td width="40">
              <img src="images/Play_icon.png"
                  height="30">
          </td>
          <td
              valign="middle">
              <span>TEN
                  NEWS
                  FIRST</span>
          </td>
      </tr>
  </table>
  </td></tr>
`;
const text = `
<tr>
  <td align="left" class="left">
  <div class="multiline-style">
      <multiline>
          <p>
              This is text only - not part of the Category heading above, consectetur adipiscing
              elit. Nam consectetur lacus sit
              amet elit scelerisque iaculis. Praesent non quam quis turpis mollis posuere.
              Maecenas odio lectus, lobortis ut nunc in, ultrices mollis erat. Donec nec tristique
              elit, non porta arcu. Maecenas lacus ex, vehicula nec finibus sed, tincidunt id
              quam.</p>
      </multiline>
  </div>
</td>
</tr>
`;
// specific templates
const Preheader = `
<div style="display:none;">
  <singleline>Pre-header Text</singleline>
</div>
`;
const viewonline = left(`
<div>
  <singleline>
      <webversion><span>View in browser</span></webversion>
  </singleline>
</div>
`);
const header = `
<tr>
  <th class="center"> <a editable="true"
          href="https://indaily.com.au"> <img editable="true"
              alt="InDaily - Adelaide Independent News" border="0"
              src="images/indaily_logo_notagline.png"
              width="250" /> </a>
  </th>
</tr>
<tr>
  <th class="fl center " valign="top">
      <h1 class="todaysheadlines">Today's Headlines</h1>
  </th>
</tr>

`;
const banner = `
  <tr>
      <td class="center" align="center" style="padding-bottom:20px;border-bottom:1px black solid;">
          <h9>
  <currentday>
      <currentmonthname>, <currentyear> <singleline></singleline>
          </h9>

      </td>
  </tr>
`;
const midboard = centre(`
<table border="0" cellpadding="0" cellspacing="0" class="wrapper" style="width:728px;" width="90">
  <tr>
      <td class="full_lb"> <a href="" style="text-decoration:none;">
              <p class="advertisement">Advertisement</p><img editable="true" alt="Leaderboard" border="0" src="images/mid-board-placeholder.jpg" width="728" />
          </a> </td>
  </tr>
</table>
`);
const Topstories = `
<tr>
  <td align="left">
  <h2>
      <a class="w100pc mob_only_inline_block"
          href="http://indaily.com.au">
          <singleline>Section Block (eg: TOP STORIES)</singleline>
      </a>
  </h2>
  </td>
</tr>
`;
const breaking = left(`
<img alt="BREAKING:" border="0" class="h14_w14 "
            src="images/breaking.gif"  width="15"
            valign="top" /> <span
            ><b>
              <singleline>BREAKING</singleline>
            </b></span>
`);
const exclusive = left(`
<img alt="EXCLUSIVE:" border="0" class="h14_w14 "
            src="images/exclusive.gif"  width="15"
            valign="top" /> <span
            ><b>
              <singleline>EXCLUSIVE</singleline>
            </b></span>
`);
const mrec = centre(`
<table border="0" cellpadding="0" align="center" cellspacing="0" width="300" style="width:300px;padding-bottom:10px;">
  <tr>
      <td> <a href="" >
              <p class="advertisment">Advertisement</p><img
                  editable="true" alt="Advertisement" border="0"
                  src="images/mrec-placeholder.jpg" width="300" align="center" />
          </a>
          <p>&nbsp;</p> </td>
  </tr>
</table>
`);
const twocolumn = `
<tr>
  <td>
      <table class="presentation twocol">
          <tr>
              <td class="leftcol block">
                  <table>
                      {{category}}
                      {{headline}}
                      {{image}}
                      <tr><td>
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam consectetur lacus sit amet elit scelerisque iaculis. Praesent non quam quis turpis mollis posuere. Maecenas odio lectus, lobortis ut nunc in, ultrices mollis erat. Donec nec tristique elit, non porta arcu. Maecenas lacus ex, vehicula nec finibus sed, tincidunt id quam
                          </td></tr>
                  </table>
              </td>
              <td class="rightcol block">
                  <table>
                      <table>
                      {{category}}
                      {{headline}}
                      {{image}}
                      <tr><td>
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam consectetur lacus sit amet elit scelerisque iaculis. Praesent non quam quis turpis mollis posuere. Maecenas odio lectus, lobortis ut nunc in, ultrices mollis erat. Donec nec tristique elit, non porta arcu. Maecenas lacus ex, vehicula nec finibus sed, tincidunt id quam
                          </td></tr>
                  </table>
              </td>
          </tr>
      </table>
  </td>
</tr>
`;
const fullwidthheading = `
<div >
  <h1 class="font_size_24 line_height_28"
      >
      <a href="" >
          <singleline>Full Width Heading</singleline>
      </a>
  </h1>
</div>
`;
const presspatron = centre(`
<table style="" class="presspatron">
<tr valign="top">
  <td align="center" stlye="padding:10px">
      <div style="padding:10px;">
          <h1>
              <a href="https://indaily.com.au/support-indaily/?utm_source=EDM%202020&utm_medium=Press%20Patron&utm_campaign=block" >
                  <singleline>We need you to help keep journalism independent and real</singleline>
              </a>
          </h1>
          <img editable="true" src="images/david-eccles.png" width="100" align="left">
          <p class="font_size_15 line_height_20">
              <multiline>A trusted source is one key to uncovering important stories. Help us remain
                  your trusted source of information by donating to InDaily.</multiline>
          </p>
      </div>
  </td>
</tr>
<tr class="button_alignment--align_button_center " >
  <td align="center" class="center" style="padding:1px 5px 10px 5px;">
      <table border="0" align="center" cellpadding="0" cellspacing="0" class="button">
          <tr>
              <td style="font-size: 12px; background-color: #000000; padding-top: 8px; padding-bottom: 8px; padding-left: 10px;  padding-right: 10px; border-radius: 5px; display: inline-block; color: #ffffff; font-weight: normal; letter-spacing: 1px; font-family: 'Helvetica', Arial, sans-serif; margin-top: 0px; color:#ffffff;">
                  <a href="https://indaily.com.au/support-indaily/?utm_source=EDM%202020&utm_medium=Press%20Patron&utm_campaign=block" style="color:#ffffff; text-decoration:none; font-weight: bold;">
                      <singleline>Donate here</singleline>
                  </a>
              </td>
          </tr>
      </table>
  </td>
</tr>
</table>
`);
const showcase = centre(`

                <a href="https://solsticemedia.com.au/regional-showcase/"
                  ><img editable="true" src="images/rs2.jpg" class="homes"
                    width="600" border="0" alt="South Australian Regional Showcase" /></a>
`);
const showcaseend = centre(`
<img editable="true" src="images/end_rs.jpg" class="homes" width="600" border="0" alt="" />
`);
const inreview = centre(`
          <img editable="true" src="images/inreview-banner-1.123338.jpg" class="homes" width="600"
              border="0" alt="InReview" />
`);
const buildit = () => {
  let template = "";
  template += buildTemplate(left(Preheader),'Preheader');
  template += buildTemplate(viewonline,'View Online');
  template += buildTemplate(header,'HEADER');
  template += buildTemplate(banner,'Banner');
  template += buildTemplate(midboard,'Advertisement (mid-board)');
  template += buildTemplate(Topstories,"Section Block");
  template += buildTemplate(storyimg+category+createHTML(featureheadline,{content:"Feature Story w/ Category"})+featuredcopy+readmore,"Feature Story w/ Category");
  template += buildTemplate(storyimg+createHTML(featureheadline,{content:"Feature story"})+featuredcopy+readmore,"Feature Story");
  template += buildTemplate(storyimg+createHTML(featureheadline,{content:"Feature story no read more"})+featuredcopy+readmore,"Feature story no read more");
  template += buildTemplate(category+createHTML(featureheadline,{content:"Feature Story no image"})+featuredcopy+readmore,"Feature Story no image");
  template += buildTemplate(createHTML(twocolumnstory,{headline:"1 Story (2 column)",category:category,icon:""}),"1 Story (2 column)");
  template += buildTemplate(createHTML(twocolumnstory,{headline:"1 Story (No Category)",category:"",icon:""}),"1 Story (No Category)");
  template += buildTemplate(createHTML(twocolumnstory,{headline:"Video Story with Icon",category:"",icon:tennewsicon}),"Video Story with Icon");
  template += buildTemplate(createHTML(twocolumn,{headline:createHTML(headline,{content:"2 column"}),category:"",image:img2col,icon:""}),"2 column");
  template += buildTemplate(mrec,"Advertisement (mrec)");
  template += buildTemplate(createHTML(twocolumn,{headline:createHTML(headline,{content:"2 Column w/ Category"}),category:category,image:img2col,icon:""}),"2 Column w/ Category");
  template += buildTemplate(category,"Category");
  template += buildTemplate(text,"Text");
  template += buildTemplate(breaking,"BREAKING");
  template += buildTemplate(exclusive,"EXCLUSIVE");
  template += buildTemplate(exclusive+createHTML(featureheadline,{content:"EXCLUSIVE Feature Story"})+storyimg+featuredcopy+readmore,"EXCLUSIVE Feature Story");
  template += buildTemplate(breaking+createHTML(featureheadline,{content:"BREAKING Feature Story"})+storyimg+featuredcopy+readmore,"BREAKING Feature Story");
  template += buildTemplate(left(fullwidthheading),"Full Width Heading");
  template += buildTemplate(presspatron,"Press Patron");
  template += buildTemplate(showcase,"Regional Showcase");
  template += buildTemplate(showcaseend,"Regional Showcase - END SECTION");
  template += buildTemplate(inreview,"InReview");
  return template;
  }

const zipit = () =>
  gulp.src('dist/images/*')
  .pipe(zip('images.zip'))
  .pipe(gulp.dest('dist'));


// build

const htmldev = () =>
  gulp
    .src(["src/index.html"])
    .pipe(replace("{{repeater}}", buildit()))
    .pipe(inlinesource({ rootpath: path.resolve("dist") }))
    .pipe(gulp.dest("dist"));
  
const demo = () =>
  gulp
    .src(["src/index.html"])
    .pipe(replace("{{repeater}}", buildit()))
    .pipe(replace("<currentday>", new Date().getDate()))
    .pipe(replace("<currentmonthname>", currentDate.toLocaleString('default', { month: 'long' })))
    .pipe(replace("<currentyear>", currentDate.toLocaleString('default', { year: 'numeric' })))
    .pipe(rename("demo.html"))
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





const html = () =>
  gulp
    .src(["src/index.html"])
    .pipe(replace("{{repeater}}", buildit()))
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
    gulp.series(assets, sassdev, demo, htmldev, zipit)
  );

exports.html = html;
exports.css = css;
exports.dev = dev;
exports.sassprod = sassprod;
exports.demo = demo;
exports.zipit = zipit;
exports.default = gulp.series(assets,sassprod, css, html, demo, zipit);
