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
require('./src/indaily_lunchtime.js');



// template build
function createHTML(template, variables) {
  return template.replace(/\{\{(\w+)\}\}/g, function(match, variable) {
    return variables[variable] || '';
  });
}

function buildTemplate(innertemplate, labelname, thiswrapper=wrapperNoLine){
    let html  = createHTML(innertemplate,{content:labelname});
    html = createHTML(thiswrapper,{content:html,itemlabel:labelname});
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
  <table role="presentation" style="width:100%;border:0;border-spacing:0;" width="100%">
  {{content}}
  </table>
</layout>
`;
const wrapperNoLine = `
<layout label="{{itemlabel}}">
  <table role="presentation" style="width:100%;border:0;border-spacing:0;" width="100%">
  {{content}}
  </table>
</layout>
`;

const emptyWrapper = `
<layout label="{{itemlabel}}">
  {{content}}
</layout>
`;


const newrapper = `<table role="presentation" style="width:100%;border:0;border-spacing:0;">
<tr>
    <td style="padding:10px 10px 20px 10px;font-family:Arial,sans-serif;font-size:24px;line-height:28px;font-weight:bold;">
        <img src="images/header.png" width="640" alt="" style="width:100%;height:auto;" />
    </td>
</tr>
<tr>
    <td style="padding:10px;text-align:left;">
        <h1 style="margin-top:0;margin-bottom:16px;font-family:Arial,sans-serif;font-size:26px;line-height:32px;font-weight:bold;">Creating responsive email magic</h1>
        <p style="margin:0;font-family:Arial,sans-serif;font-size:18px;line-height:24px;">Maecenas sed ante pellentesque, posuere leo id, eleifend dolor. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent laoreet malesuada cursus!</p>
    </td>
</tr>
</table>
<div class="spacer" style="line-height:26px;height:26px;mso-line-height-rule:exactly;">&nbsp;</div>
`;

const category = `
  <p class="category">
      <singleline>CATEGORY</singleline>
  </p>
`;
const headline = `

      <h2 style="font-size:18px;text-align:left;"><singleline>{{content}}</singleline></h2>
`;
const featureheadline = `
<tr>
  <td class="featureheadline">
     <h1><singleline>{{content}}</singleline></h1>
  </td>
</td>
`;
const storyimg = `

      <img editable="true" alt="Image:" border="0" src="images/story-placeholder.jpg" width="600">
`;
const img2col = `
<p style="margin:0;font-family:Arial,sans-serif;font-size:14px;line-height:18px;">
      <a href=""><img
      editable="true"
      alt="Image:"
      border="0"
      src="images/story-placeholder.jpg"
      width="280" alt="" style="display:block;width:280px;max-width:100%;height:auto;" /></a></p>
`;
const storycopy = `
<tr>
  <td class="storycopy">
  <div class="multiline-style"><multiline>Story copy. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam consectetur lacus sit amet elit scelerisque iaculis. Praesent non quam quis turpis mollis posuere. Maecenas odio lectus, lobortis ut nunc in, ultrices mollis erat. Donec nec tristique elit, non porta arcu. Maecenas lacus ex, vehicula nec finibus sed, tincidunt id quam.</multiline></div>
  </td>
</tr>
`;
const featuredcopy = `
<tr>
  <td class="featuredcopy "><div class="multiline-style featuredcopy"><multiline>
      Featured story copy. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam consectetur lacus sit amet elit scelerisque iaculis. Praesent non quam quis turpis mollis posuere. Maecenas odio lectus, lobortis ut nunc in, ultrices mollis erat. Donec nec tristique elit, non porta arcu. Maecenas lacus ex, vehicula nec finibus sed, tincidunt id quam.</multiline></div>
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
<div class="two-col" style="text-align:center;font-size:0;">
    <!--[if mso]> 
<table role="presentation" width="100%"> 
<tr> 
<td style="width:50%;padding:10px;" valign="middle"> 
<![endif]-->
    <div class="column" style="width:100%;max-width:300px;display:inline-block;vertical-align:middle;">
        <div style="padding:10px;">
            <p style="margin:0;font-family:Arial,sans-serif;font-size:14px;line-height:18px;">
            <a href=""><img
            editable="true"
            alt="Image:"
            border="0"
            src="images/story-placeholder.jpg"
            width="280" alt="" style="display:block;width:280px;max-width:100%;height:auto;"
            /></a>
            </p>
        </div>
    </div>
    <!--[if mso]> 
</td> 
<td style="width:50%;padding:0 0 0 0;" valign="top"> 
<![endif]-->
    <div class="column" style="width:100%;max-width:300px;display:inline-block;vertical-align:top;padding:0 0 0 0;">
        <div style="padding:0 10px 0 10px;font-size:16px;line-height:18px;text-align:left;">
        {{category}}
        {{icon}}
        <p class="storycopy">
       <multiline>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam consectetur lacus sit amet elit scelerisque iaculis. Praesent non quam quis turpis mollis posuere. Maecenas odio lectus, lobortis ut nunc in, ultrices mollis erat. Donec nec tristique elit, non porta arcu. Maecenas lacus ex, vehicula nec finibus sed, tincidunt id quam.</multiline></p>
        </div>
    </div>
    <!--[if mso]> 
</td> 
</tr> 
</table> 
<![endif]-->
</div>



`; 
const tennewsicon = `
<p>
              <img src="images/Play_icon.png"
                  height="30" class="playicon" alt="Play Icon">&nbsp;&nbsp;<img src="images/ten_news_first.png" class="tnf" alt="TEN NEWS FIRST"></p>
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
      <webversion><span class="preheader">View in browser</span></webversion>
  </singleline>
</div>
`);
const header = `
<tr>
  <th class="center"> <center><a editable="true"
          href="https://indaily.com.au"> <img editable="true"
              alt="InDaily - Adelaide Independent News" border="0"
              src="images/indaily_logo_notagline.png"
              width="250" /> </a></center>
  </th>
</tr>
<tr>
  <th class="fl center " valign="top">
      <center><h1 class="todaysheadlines">Today's Headlines</h1></center>
  </th>
</tr>

`;
const banner = `
  <tr>
      <td class="center" align="center" style="padding-bottom:20px;">
      <center>
          <h9>
  <currentday>
      <currentmonthname>, <currentyear> <singleline></singleline>
          </h9>

      </td></center>
  </tr>
`;
const midboard = centre(`
  <tr>
      <td class="full_lb"> <a href="" style="text-decoration:none;">
              <p class="advertisement">Advertisement</p><img editable="true" alt="Leaderboard" border="0" src="images/mid-board-placeholder.jpg" width="100%" />
          </a> </td>
  </tr>
`);
const Topstories = `
<tr>
  <td align="left" >
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
<img alt="BREAKING:" border="0" class="h14_w14"
            src="images/breaking.gif"  width="15"
            valign="top" /> <span class="category" 
            >
              <singleline>BREAKING</singleline>
            </span>
`);
const exclusive = left(`
<img alt="EXCLUSIVE:" border="0" class="h14_w14 "
            src="images/exclusive.gif"  width="15"
            valign="top" /> <span class="category" 
            >
              <singleline>EXCLUSIVE</singleline>
            </span>
`);
const mrec = centre(`
<table border="0" cellpadding="0" align="center" cellspacing="0" width="300" style="width:300px;padding-bottom:10px;">
  <tr>
      <td><center><a href="" >
              <p class="advertisment">Advertisement</p><img
                  editable="true" alt="Advertisement" border="0"
                  src="images/mrec-placeholder.jpg" width="300" align="center" />
          </a></center>
          <p>&nbsp;</p> </td>
  </tr>
</table>
`);
const twocolumn = `
<div class="two-col" style="text-align:center;font-size:0;">
    <!--[if mso]> 
<table role="presentation" width="100%"> 
<tr> 
<td style="width:50%;padding:10px;" valign="middle"> 
<![endif]-->
    <div class="column" style="width:100%;max-width:300px;display:inline-block;vertical-align:middle;">
        <div style="padding:10px;font-size:14px;text-align:left;">
        {{image}}
        {{category}}
        {{headline}}
        <multiline>Story copy. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam consectetur lacus sit amet elit scelerisque iaculis. Praesent non quam quis turpis mollis posuere. Maecenas odio lectus, lobortis ut nunc in, ultrices mollis erat. Donec nec tristique elit, non porta arcu. Maecenas lacus ex, vehicula nec finibus sed, tincidunt id quam.</multiline>
        </div>
    </div>
    <!--[if mso]> 
</td> 
<td style="width:50%;padding:10px;" valign="top"> 
<![endif]-->
<div class="column" style="width:100%;max-width:300px;display:inline-block;vertical-align:middle;">
<div style="padding:10px;font-size:14px;text-align:left;">
{{image}}
{{category}}
{{headline}}
<multiline>Story copy. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam consectetur lacus sit amet elit scelerisque iaculis. Praesent non quam quis turpis mollis posuere. Maecenas odio lectus, lobortis ut nunc in, ultrices mollis erat. Donec nec tristique elit, non porta arcu. Maecenas lacus ex, vehicula nec finibus sed, tincidunt id quam.</multiline>
</div>
</div>
    <!--[if mso]> 
</td> 
</tr> 
</table> 
<![endif]-->
</div>



`; 

const twocolumnold = `
<tr>
  <td >
      <table class="presentation">
          <tr>
              <td class="block evenleft" style="padding:0 58px 0 0;" valign="top">
                  <table width="242" class="">
                  {{image}}
                  {{category}}
                  {{headline}}
                      <tr><td>
                      <div class="multiline-style"><multiline>Story copy. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam consectetur lacus sit amet elit scelerisque iaculis. Praesent non quam quis turpis mollis posuere. Maecenas odio lectus, lobortis ut nunc in, ultrices mollis erat. Donec nec tristique elit, non porta arcu. Maecenas lacus ex, vehicula nec finibus sed, tincidunt id quam.</multiline></div>
                          </td></tr>
                  </table>

              </td>
              <td class="block evenright" align="right" style="padding: 0 0 0 58px;" valign="top">
                  <table width="242" class="hugright">
                      {{image}}
                      {{category}}
                      {{headline}}
                      <tr><td>
                      <div class="multiline-style"><multiline>Story copy. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam consectetur lacus sit amet elit scelerisque iaculis. Praesent non quam quis turpis mollis posuere. Maecenas odio lectus, lobortis ut nunc in, ultrices mollis erat. Donec nec tristique elit, non porta arcu. Maecenas lacus ex, vehicula nec finibus sed, tincidunt id quam.</multiline></div>
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
          <p class="font_size_15 line_height_20"><div class="multiline-style">
              <multiline>A trusted source is one key to uncovering important stories. Help us remain
                  your trusted source of information by donating to InDaily.</multiline></div>
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
const imageblock = centre(`
          <img editable="true" src="images/image_block.png" class="homes" width="600"
              border="0" alt="" />
`);


const buildit = () => {
  let template = "";
  //template += buildTemplate(Preheader,'Preheader');
  template += buildTemplate(viewonline,'View Online');
  template += buildTemplate(header,'HEADER');
  template += buildTemplate(banner,'Banner', wrapper);
  template += buildTemplate(midboard,'Advertisement (mid-board)');
  template += buildTemplate(Topstories,"Section Block",wrapper);
  template += buildTemplate(storyimg+category+createHTML(featureheadline,{content:"Feature Story w/ Category"})+featuredcopy+readmore,"Feature Story w/ Category", wrapper);
  template += buildTemplate(storyimg+createHTML(featureheadline,{content:"Feature story"})+featuredcopy+readmore,"Feature Story", wrapper);
  template += buildTemplate(category+createHTML(featureheadline,{content:"Feature Story no image"})+featuredcopy+readmore,"Feature Story no image", wrapper);
  template += buildTemplate(createHTML(twocolumnstory,{headline:"1 Story (2 column)",category:category,icon:""}),"1 Story (2 column)", emptyWrapper);
  template += buildTemplate(createHTML(twocolumnstory,{headline:"1 Story (No Category)",category:"",icon:""}),"1 Story (No Category)", emptyWrapper);
  template += buildTemplate(createHTML(twocolumnstory,{headline:"Video Story with Icon",category:"",icon:tennewsicon}),"Video Story with Icon", emptyWrapper);
  template += buildTemplate(createHTML(twocolumn,{headline:createHTML(headline,{content:"2 column"},"{{content}}"),category:"",image:img2col,icon:""}),"2 column", emptyWrapper);
  template += buildTemplate(mrec,"Advertisement (mrec)");
  template += buildTemplate(createHTML(twocolumn,{headline:createHTML(headline,{content:"2 Column w/ Category"}),category:category,image:img2col,icon:""}),"2 Column w/ Category", emptyWrapper);
  template += buildTemplate(category,"Category");
  template += buildTemplate(text,"Text");
  template += buildTemplate(breaking,"BREAKING");
  template += buildTemplate(exclusive,"EXCLUSIVE");
  template += buildTemplate(storyimg+exclusive+createHTML(featureheadline,{content:"EXCLUSIVE Feature Story"})+featuredcopy+readmore,"EXCLUSIVE Feature Story", wrapper);
  template += buildTemplate(storyimg+breaking+createHTML(featureheadline,{content:"BREAKING Feature Story"})+featuredcopy+readmore,"BREAKING Feature Story", wrapper);
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

    const oldversion = () =>
    gulp
      .src(["src/oldversion.html"])
      .pipe(rename("oldversion.html"))
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
    gulp.series(assets, sassdev, demo, htmldev, oldversion, zipit)
  );

exports.html = html;
exports.css = css;
exports.dev = dev;
exports.sassprod = sassprod;
exports.demo = demo;
exports.zipit = zipit;
exports.default = gulp.series(assets,sassprod, css, html, demo, oldversion, zipit);
