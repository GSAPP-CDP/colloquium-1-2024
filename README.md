# GSAPP CDP Colloquium 1 Course Site

This repository hosts the source code and site content for the Summer 2024
[Computational Design Practices](https://www.arch.columbia.edu/programs/15-m-s-computational-design-practices) 
Colloquium I course website.

## Site Structure

The site contains one folder, `work`, that contains student work, plus a few Markdown files:

```
about.md
index.md
public/
work/
├── students.yaml
├── student1
|   ├── index.html
|   ├── featured.jpg
|   ├── style.css
|   ├── image-1.jpg
|   ├── image-2.jpg
├── student2
|   ├── index.html
|   ├── featured.jpg
|   ├── style.css
|   ├── image-1.jpg
|   ├── image-2.jpg
├── student2
|   ├── index.html
|   ├── featured.jpg
|   ├── style.css
|   ├── image-1.jpg
|   ├── image-2.jpg
├── *
```

## Work Folders and `index.html`

These folders are intended to be independent websites, so the `index.html` files
do not included the typical frontmatter needed for Eleventy to catalog and
process them.

To ensure we can render a nice catalog for the work, we include a catalog file
at `work/students.yaml` that maps folders to names. Eleventy then reads this
to generate the `work/index.html` file at render time.

## Previewing Your Site

When you get started, you can download your `index.html` file and set up a
folder to iterate on your work locally. You can then preview your own site
by just opening it in a browser (double-click on the file in macOS Finder,
for example) or with Python like this:

    python -m http.server

Then navigate to `https://localhost:8000` or whatever URL it provides.

## Files

Include images, CSS, JavaScript, and other media in the folder alongside your
`index.html` file. Then you can reference them in simple image tags relatively
like this:

```html
<img src="image.png">
<link href="style.css" rel="stylesheet" />
<script src="script.js"></script>
```

### Videos

If animated gifs get too large (over a few MB), consider converting it to a
movie format like `mov` or `mp4.`

For longer feature videos, please consider hosting them on external platforms
like YouTube and Vimeo. Such services process videos so they can be streamed in
different resolutions and adapt to a visitor's connection bandwidth.

YouTube, Vimeo, and videos supported by HTML5 can be added thusly:

```html
<!--- YouTube -->
<iframe
  src="https://www.youtube.com/embed/laiVuCmEjlg"
  frameborder="0"
  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share"
  allowfullscreen
  style="aspect-ratio: 16 / 9; width: 100%;">
</iframe>

<!--- Vimeo -->
<iframe
  src="https://player.vimeo.com/video/158673446?h=30e98ac368&title=0&byline=0&portrait=0"
  frameborder="0"
  allow="autoplay; fullscreen; picture-in-picture"
  allowfullscreen
  style="aspect-ratio: 16 / 9; width: 100%;">
</iframe>

<!--- HTML5 video -->
<video
  src="earth.mp4"
  controls
  style="aspect-ratio: 16 / 9; width: 100%;">
</video>
```

Note that each element has a `style` attribute that sets the width to 100%. This 
causes them to be responsive and fill the width of the container.

The aspect ratio can be changed by modifying the `style` attribute to fit your video.

## Development

This is only for the instructional team.

This site is built with [Eleventy](https://www.11ty.dev/). After cloning the repo,
run the site with:

```
npm install
npx @11ty/eleventy --serve
```

Browse to <http://localhost:8080/> or use the URL outputted by `yarn start`.

Sometimes this fails with some obscure errors about the passthrough copy. In this 
case, one troubleshooting step is to completely remove the `_site` folder with 
`rm -rf _site` and try serving the site again.

## Deployment

This repository is automatically deployed to GitHub Pages whenever a new commit 
is pushed to the `main` branch using a GitHub workflow located at 
`.github/workflows/deploy.yml`.

