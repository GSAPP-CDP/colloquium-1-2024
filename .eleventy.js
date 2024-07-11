const markdownIt = require("markdown-it");
const markdownItFootnote = require("markdown-it-footnote");
const markdownImplicitFigures = require("markdown-it-implicit-figures");
const { EleventyHtmlBasePlugin } = require("@11ty/eleventy");

const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');

module.exports = function (eleventyConfig) {
  const markdownLib = markdownIt({
    html: true,
    linkify: true,
  })
  .use(markdownItFootnote)
  .use(markdownImplicitFigures, { figcaption: true });
  
  eleventyConfig.setLibrary("md", markdownLib);

  // copy assets from public/ directory to root of site build
  eleventyConfig.addPassthroughCopy({ public: "/" });
  
  // add base plugin to allow deployment to GitHub Pages subfolder
  eleventyConfig.addPlugin(EleventyHtmlBasePlugin);
  
  // add filter to normalize links to array of objects with url and text properties
  eleventyConfig.addFilter("normalizeLinks", function (links) {
    if (typeof links === "undefined") return;
    if (!Array.isArray(links)) {
      throw new Error(
        "links must be an array of urls or objects with url and text properties"
      );
    }
    return links.map((link) => {
      if (typeof link === "string") {
        return { url: link, text: link };
      }
      if (typeof link === "object") {
        if (typeof link.url === "undefined") {
          throw new Error("link object must have url property");
        }
        if (typeof link.text === "undefined") {
          throw new Error("link object must have text property");
        }
        return link;
      }
      throw new Error("link must be a string or object");
    });
  });
  
  // Copy all HTML files that aren't index.html.
  eleventyConfig.addPassthroughCopy("work/**/!(index).html");

  // Copy media from their source folders to their respective published folders.
  eleventyConfig.addPassthroughCopy("work/**/*.png");
  eleventyConfig.addPassthroughCopy("work/**/*.jpg");
  eleventyConfig.addPassthroughCopy("work/**/*.jpeg");
  eleventyConfig.addPassthroughCopy("work/**/*.gif");
  eleventyConfig.addPassthroughCopy("work/**/*.cur");
  
  eleventyConfig.addPassthroughCopy("work/**/*.mov");
  eleventyConfig.addPassthroughCopy("work/**/*.mp3");
  eleventyConfig.addPassthroughCopy("work/**/*.mp4");

  eleventyConfig.addPassthroughCopy("work/**/*.js");
  eleventyConfig.addPassthroughCopy("work/**/*.css");

  eleventyConfig.addPassthroughCopy("work/**/*.obj");
  eleventyConfig.addPassthroughCopy("work/**/*.csv");
  eleventyConfig.addPassthroughCopy("work/**/*.geojson");
  
  eleventyConfig.addPassthroughCopy("work/**/*.eot");
  eleventyConfig.addPassthroughCopy("work/**/*.ttf");
  eleventyConfig.addPassthroughCopy("work/**/*.woff");
  eleventyConfig.addPassthroughCopy("work/**/*.woff2");
  
  // Open the work/students.yaml file and create a collection from it for
  // Eleventy to render.
  const yamlData = yaml.load(fs.readFileSync(path.join(__dirname, 'work/students.yaml'), 'utf8'));
  
  eleventyConfig.addCollection('students', function(collection) {
    return Object.entries(yamlData).map(([folder, name]) => ({
      folder,
      name
    }));
  });
  
  return {
    dir: {
      layouts: "_layouts"
    }
  }
};
