# ImageShrink
Less size. Same story.

A dependency-free JavaScript tool to resize and compress JPEG, PNG and WebP images directly in the browser.

https://danenlarping333.github.io/ImageShrink/

## Use
Extract this entire folder and open index.html in a modern browser. Keep style.css, core.js and app.js alongside it. Drop one image, choose the output format, quality and maximum longest side, then click Shrink image. Compare Original and Result, and download the new file.

## Features
- One image at a time; drag-and-drop or file picker.
- JPEG, PNG and WebP input/output (browser support varies).
- 1920, 1280, 800 px or original dimensions; preserves aspect ratio without upscaling.
- Adjustable JPEG/WebP quality; PNG uses lossless encoding and ignores quality.
- Before/after sizes, dimensions and percentage saved.
- Local processing with Canvas; no uploads, analytics, dependencies or account.

## Limits and behavior
Input limit: 25 MiB, 24 megapixels, and 16,000 pixels on the longest side. Decoding occurs before the pixel limit can be checked, so high-resolution inputs can still require substantial memory. Smaller files are not guaranteed; PNG and already-compressed photos may become larger.
JPEG replaces transparency with white. Animated files become a still image. Browser re-encoding can change colors and does not intentionally copy camera metadata; do not treat this as a forensic metadata-removal tool.
If a browser falls back to PNG, the UI and filename use the actual output type. This tool is intended for modern browsers with Canvas, image decode and Blob support.
Changing settings invalidates the old result. The original file is never overwritten.

## GitHub Pages
Upload the contents of this folder to the root of an ImageShrink repository, including .nojekyll.
Choose Settings > Pages > Deploy from a branch > main > / (root).
Wait for deployment, then use the exact URL shown by GitHub.

Suggested repository description:
A private, browser-based image resizer and compressor built with vanilla JavaScript. No uploads or dependencies.

## Development
Open index.html; no build step. Run node core.test.cjs to check dimension calculations and output naming.
Unit tests and JavaScript syntax checks were run. Full browser conversion and visual tests still need verification.

## License
MIT — see LICENSE.
