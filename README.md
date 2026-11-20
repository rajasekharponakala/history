# Early Indians — Interactive Atlas

An interactive visual companion to *Early Indians* by Tony Joseph (Juggernaut, 2018).
Dependency-free: plain HTML, CSS and JavaScript. No build step, no CDN, works offline.

## Run it
- Double-click `index.html`, or serve the folder: `python3 -m http.server 8000` then open http://localhost:8000

## What's inside
- Master timeline: 38 events, three scales (400,000-year log, 15,000-year, 8,000-year), chapter filters, drag to pan, keyboard accessible
- 29 charts (range bars, bars, lollipops, donuts, 100% stacked, unit/waffle charts, time-range plots, column chart, gradient, haplogroup tree), each with a Data table toggle
- Out-of-Africa scrubber (schematic), genetics primer, "Indian pizza" explorer, research timeline
- All 48 pictures from the book, grouped by chapter, with a filterable gallery, lightbox and slideshow
- Command palette search (press `/` or Ctrl/Cmd+K), light/dark theme

## Structure
```
index.html          page structure and chapter narrative
css/style.css       design tokens, layout, components (CSS layers)
js/data.js          all book data, image manifest, events
js/charts.js        small SVG chart kit
js/app.js           timeline, journey, gallery, search, pizza, etc.
assets/img/         pictures extracted from the book
```
To change a number, edit `js/data.js`. To add a chart, add an entry in the `CHARTS` registry in `js/app.js` and a `<figure data-chart="name">` in `index.html`.

## Notes
Figures come from the book; ranges are kept as ranges. The Out-of-Africa map and the pizza are schematic illustrations. Images belong to their credited sources; this is an unofficial study aid.
