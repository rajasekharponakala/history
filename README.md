# Early Indians — Interactive Atlas

An interactive visual companion to *Early Indians* by Tony Joseph (Juggernaut, 2018).
Plain HTML, CSS and JavaScript: no build step, no framework, and it works offline. Web fonts (Fraunces, Inter) load from Google Fonts when online; offline it falls back to system fonts.

## Run it
- Double-click `index.html`, or serve the folder: `python3 -m http.server 8000` then open http://localhost:8000

## What's inside
- **History atlas**: a real geographic map (Natural Earth land and borders, bundled offline) with 12 guided stops, from the exodus across Bab el Mandeb to the Mauryas. It shows 45 places and 26 animated migration and trade routes, approximate river courses and the extent of the Mature Harappan civilization. A time slider covers 300,000 years ago to 500 CE, places open detail cards with pictures from the book, and you can pan, pinch or Ctrl/⌘ + scroll to zoom, or use the keyboard. Layers can be switched on and off.
- **Out of Africa journey** (chapter 1): an 8-step scrubber drawn on the same map engine.
- **Master timeline**: 38 events on three scales (400,000-year log, 15,000-year, 8,000-year), with chapter filters, era bands (MIS 4, Holocene, Mature Harappan, Steppe waves, era of mixing), drag to pan, ←/→ keyboard stepping and a **Show on the map** link.
- 29 charts (range bars, bars, lollipops, donuts, 100% stacked, waffles, time ranges, columns, a haplogroup tree), each with a Data table toggle.
- Genetics primer, the "Indian pizza" explorer and a research timeline.
- All 48 pictures from the book, grouped by chapter, with a filterable gallery, lightbox, slideshow and **Show on map** for photographed sites.
- Command palette (press `/` or Ctrl/⌘+K) that searches events, facts, images, charts, map stops and places.
- Light and dark themes, a mobile chapter bar, a back-to-top button, and reduced-motion support.

## Structure
```
index.html          page structure and chapter narrative
css/style.css       design tokens, layout, components, charts, map (CSS layers)
js/data.js          book data: chapters, image manifest, events, chart datasets
js/atlas-data.js    places, routes, rivers, Harappan extent, guided map stops
js/geo.js           land + border outlines (Natural Earth 1:50m, public domain), delta-encoded
js/charts.js        small SVG chart kit
js/map.js           SVG map engine (Miller projection, pan/zoom, routes, labels)
js/app.js           wiring: timeline, atlas, journey, gallery, search, pizza…
assets/img/         pictures extracted from the book
```
- To change a number, edit `js/data.js`.
- To add a chart, add an entry in the `CHARTS` registry in `js/app.js` and a `<figure data-chart="name">` in `index.html`.
- To add a place or route, add it to `SITES` / `ROUTES` in `js/atlas-data.js` (`ll` is `[lon, lat]`; `from`/`to` are years ago). To add a stop to the guided tour, add an entry to `STORIES`.

## Notes
Figures come from the book, and ranges are kept as ranges. Site coordinates are approximate. Migration paths are schematic: they follow the book's narrative, not exact tracks. Rivers are hand-traced approximations, and modern borders are shown only for orientation. The pizza is a metaphor. Images belong to their credited sources; this is an unofficial study aid.
