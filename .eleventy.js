const markdownIt = require("markdown-it");
const { EleventyHtmlBasePlugin } = require("@11ty/eleventy");

const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');

module.exports = function (eleventyConfig) {
  const markdownLib = markdownIt({
    html: true,
    linkify: true,
  });
  
  eleventyConfig.setLibrary("md", markdownLib);
  
  // copy assets from public/ directory to root of site build
  eleventyConfig.addPassthroughCopy({ public: "/" });
  
  // add base plugin to allow deployment to GitHub Pages subfolder
  eleventyConfig.addPlugin(EleventyHtmlBasePlugin);
  
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
  eleventyConfig.addPassthroughCopy("work/**/*.svg");
  eleventyConfig.addPassthroughCopy("work/**/*.glb");
  eleventyConfig.addPassthroughCopy("work/**/*.gltf");
  eleventyConfig.addPassthroughCopy("work/**/*.webp");
  eleventyConfig.addPassthroughCopy("work/**/*.pdf");



  
  eleventyConfig.addPassthroughCopy("work/**/*.eot");
  eleventyConfig.addPassthroughCopy("work/**/*.ttf");
  eleventyConfig.addPassthroughCopy("work/**/*.woff");
  eleventyConfig.addPassthroughCopy("work/**/*.woff2");
  
  const studentsYamlPath = path.join(__dirname, 'work/students.yaml');
  eleventyConfig.addWatchTarget(studentsYamlPath);
  eleventyConfig.addCollection('students', function(collection) {
    // Open the work/students.yaml file and create a collection from it for Eleventy to render.
    const yamlData = yaml.load(fs.readFileSync(studentsYamlPath, 'utf8'));
    return Object.entries(yamlData).map(([key, data]) => ({
      ...data,
      folder: key,
    }));
  });
  
  return {
    dir: {
      layouts: "_layouts"
    }
  }
};
