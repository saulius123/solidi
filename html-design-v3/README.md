# Solidi version 3

Dark edition using the original five-color palette from struktura.docx:

- Warm white: #F8F6F2
- Anthracite: #30332F
- Sand: #EAE3D8
- Sage: #919B8B
- Terracotta: #B8836C

The homepage has a full-width, centered photographic hero inspired by the supplied reference. It uses the original document's headline and supporting copy. Three photos change automatically with a gentle fade every 6.5 seconds. There are no visible slideshow controls. Rotation pauses while the hero is hovered, focused, or the page is hidden, and respects reduced-motion preferences.

Version 1 and version 2 remain separate and unchanged.

## View locally

Open index.html, or run `node preview.cjs` in this folder and visit http://127.0.0.1:4175/.

## Upload

Extract solidi-v3-hosting.zip and upload its contents to your host's website directory. index.html must be at the root of that directory, with assets and properties beside it. No installation, build step, PHP, WordPress, or database is required.

Google Maps and Facebook embeds require an internet connection. The contact form is a demo; connect a form service to receive actual enquiries. Replace illustrative listings, gallery photos, map locations, and contact placeholders before launch.

## Edit

- index.html: homepage content and slideshow photos.
- night.css: dark edition styles and responsive layouts.
- styles.css: shared component foundation.
- assets/slideshow.js: automatic homepage photo rotation.
- assets/header.js: compact sticky header.
- assets/gallery.js: property gallery and horizontal thumbnails; its controls remain available.
- properties.json: listing data, galleries, optional Google Maps, and video.
- build-pages.cjs: run `node build-pages.cjs` to regenerate the 15 detail pages and homepage listing cards.

The existing eight-photo property gallery, pinned Google map, Facebook reel, consultant block below the map, and ordinary HTML property links are retained. Four properties have optional maps; eleven have none.
