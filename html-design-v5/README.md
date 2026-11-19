# Solidi v5

Serve this folder using any static server with directory index support (for example: python3 -m http.server 8155). Property URLs use folders with index.html, so the browser address has no .html extension. No build step or WordPress is required. All changes are isolated in html-design-v5; earlier versions and public are untouched.

## Included

- V4 layout, rounded property cards and assigned brokers.
- V1 Georgia/Arial typography, hero captions, sage contact section and original v4 dark footer.
- Hero background automatically cycles through three local photos every six seconds, with a gentle fade and no visible controls. Reduced-motion preference keeps the first photo static.
- Client document introduction and three service stages.
- Two brokers (in contacts and property cards): Lina Matukienė and Giedrė Daugirdaitė.
- Homepage categories: Visi objektai, Projektai, Namai, Butai, Kitas NT.
- Sale, rental and project categories on the homepage; individual property views and photo gallery with keyboard navigation. No separate listing pages.
- Google Maps loaded automatically on individual properties, without a Maps API key.
- Contact form preview, privacy draft and persistent optional tracking choices.

## Rebuild standalone pages

Run `node build-pages.cjs` from this folder after changing property data or shared markup/styles referenced by the generated documents. The generator updates `objektai/<slug>/index.html` for each property and `privatumo-politika/index.html` for the privacy policy. The public privacy URL is `/privatumo-politika/`; old privacy hash URLs redirect there. Property content is in the HTML itself; JavaScript adds gallery, maps, form and consent interactions. Homepage categories still use JavaScript. Old property hash links redirect to the corresponding standalone URL.

## Content and setup

- js/data.js: brokers, properties, image URLs and coordinates. Properties and photos are demonstration content. Agent assignments are examples. The supplied broker portraits are in assets/brokers and use CSS face-focused crops. Add confirmed phone numbers here; empty phones are hidden.
- js/settings.js: contact email, Google Analytics measurement ID and Meta Pixel ID. Tracking is disabled with empty IDs and only loads after the matching visitor choice. Full-page visits are tracked; SPA route/conversion tracking must be configured for the eventual production integration.
- Facebook and Instagram icon links in the footer and shared homepage contact block currently point to facebook.com and instagram.com as requested placeholders. Replace the hrefs in index.html with agency profile links, then rebuild property pages.
- The preview form does not send data or open an email app. It shows a demonstration notice on submit. The production WordPress form will send email through a server mail handler.
- Broker emails use the requested giedre@solidi.lt and lina@solidi.lt addresses; mailbox provisioning is separate.
- Reference site baltiberzai.lt could not be retrieved. Phone numbers were not invented.
- Privacy text is explicitly a draft for review, informed by the structure of https://kanoestate.lt/privatumo-pareiskimas-es/ rather than copying its company details. Confirm controllers, processors, retention periods and final policy before launch.
- Logo remains a provisional wordmark.

## Validation

JavaScript syntax, generated homepage, all ten standalone property pages, extension-free HTTP responses, local asset/link targets, category order, map controls and contact consistency checked programmatically. Browser automation is unavailable in this session, so a visual desktop/mobile check is still needed.

## Gallery gestures

On mobile, pinch inside the open gallery to zoom the photo up to 4×, then drag to pan. Changing the photo resets its zoom. The overlay prevents page pinch/scroll while open; normal browser zoom remains available outside the gallery. Double-clicking the photo toggles 2× zoom.

Swipe left/right in the gallery to change photos. When zoomed, dragging pans the photo first; continuing past a horizontal edge changes to the next/previous photo on release. Short, vertical, cancelled and multi-touch gestures do not navigate.
