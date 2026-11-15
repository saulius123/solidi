# Solidi HTML design template

Open `index.html` in a browser. No build, framework, or installation is required.

- `index.html`: Lithuanian page content and semantic sections.
- `styles.css`: responsive layout and the document's exact five-color palette.
- `script.js`: sale/rental/category filters, mobile navigation, and demo form feedback.
- `assets/hero-house.png`: original house photograph embedded in struktura.docx.
- `assets/apartment.jpg` and `assets/interior.jpg`: illustrative Unsplash interior photographs; replace with actual property photographs before production.
- `reference/`: images extracted from the supplied document for design reference.

The page follows the supplied navigation, hero copy, agency description, and three sales stages. The logo is a code-based interpretation of the supplied concept. Project copy and listing data are illustrative additions. No contact details, team members, or testimonials have been invented.

The contact form validates input and displays an explicit demo message. It does not send or store personal information. Connect a form handler and replace example properties before production. Homepage navigation targets page sections. Every property has its own static HTML detail page linked with standard anchors.

The catalog contains 15 illustrative properties: 9 for sale and 6 for rent. Houses, apartments, and commercial properties are available in both modes. Additional house, villa, living-room, and office images are illustrative Unsplash photographs.


## Property pages

All 15 standalone detail pages are in properties/. Photos, titles, and arrows use ordinary HTML links. Each detail page works without JavaScript, including related-property and return links. The homepage also contains all property cards in its HTML; JavaScript only filters them. With JavaScript disabled, all listings remain visible.

Edit properties.json and run node build-pages.cjs from this folder to regenerate the pages and homepage cards. No build is needed to view the delivered files.


## Maps

Location is optional. Only properties with a map object embed an interactive OpenStreetMap and include a full-map link. Four sample properties (IDs 1, 2, 5, 11) have maps; the other 11 omit the entire map section. The homepage has no map. Map centers are configured per listing in properties.json (map.latitude, map.longitude, map.label). Current coordinates are illustrative areas, not verified property addresses; the pages clearly say so. Maps require internet access. Update the coordinates and labels and regenerate pages when actual addresses are supplied.


Pinned maps use a local Leaflet map (property-map.html and assets/property-map.js) with a charcoal house SVG marker. Leaflet's license is included in assets. Property navigation still uses ordinary HTML links.

Property SOL-001 now uses the user-supplied Google Maps iframe. Its provider and embed URL are stored in properties.json. Other optional maps keep their existing providers.

All four mapped properties now use the same user-supplied Google area embed. Properties without a map object continue to omit the map section. Replace each embed URL with its own Google location when available.

## Photo gallery

SOL-001 has a eight-photo illustrative gallery. Clicking its main image or thumbnails opens the viewer, with previous/next buttons, arrow-key navigation, Escape to close, and swipe support. Edit its gallery array in properties.json to replace the example photos, then regenerate pages. Other properties retain their single photograph. Without JavaScript, gallery links open the image directly.


The property's thumbnail row scrolls horizontally with touch/trackpad, keyboard focus, or side arrow buttons. The lightbox thumbnail strip also scrolls. A shared sticky header on the homepage and all property pages becomes more compact after scrolling and returns to its full size near the top.

SOL-001 includes a Solidi contact block beneath its gallery and summary, with a team name and explicit phone/email placeholders. Replace these with actual consultant details before publication.

SOL-001 embeds the supplied public Facebook reel within its description, using Meta's video player and a direct Facebook fallback link. The video URL is configured in properties.json. Playback was checked in the browser.
