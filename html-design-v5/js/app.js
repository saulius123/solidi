/* Solidi v5: homepage sections and individual property pages.
   #/parduodame, #/parduodame/namai|butai|kitas, #/projektai and #/nuoma
   select the corresponding homepage category; there are no listing pages. */

const $ = (sel, root = document) => root.querySelector(sel);
const app = $("#app");
const SITE_ROOT = document.body.dataset.property ? "../../" : document.body.dataset.page ? "../" : "";
const propertyHref = (id) => `${SITE_ROOT}objektai/${encodeURIComponent(id)}/`;

/* ---------- helpers ---------- */
const fmtNum = new Intl.NumberFormat("lt-LT", { maximumFractionDigits: 2 });
const fmtPrice = (p) =>
  `${p.priceFrom ? "nuo " : ""}${fmtNum.format(p.price)} €${p.deal === "nuoma" ? "/mėn." : ""}`;

// Lietuviškos daugiskaitos formos: [1, 2–9, 0/10–20]
function plural(n, [one, few, many]) {
  const n10 = n % 10, n100 = n % 100;
  if (n10 === 1 && n100 !== 11) return one;
  if (n10 >= 2 && n10 <= 9 && (n100 < 10 || n100 > 20)) return few;
  return many;
}
const roomsLabel = (n) => `${n} ${plural(n, ["kambarys", "kambariai", "kambarių"])}`;

const TYPE_LABEL = { namas: "Namas", butas: "Butas", kitas: "Kitas NT" };
const DEAL_LABEL = { pardavimas: "Parduodama", nuoma: "Nuoma", projektas: "Projektas" };
const SUBTYPE_SLUG = { namai: "namas", butai: "butas", kitas: "kitas" };

const initials = (name) => name.split(" ").map((w) => w[0]).join("").slice(0, 2);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const ICON = {
  area: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l9 9-9 9-9-9z"/><path d="M8 12l4-4"/></svg>',
  rooms: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16v16H4z"/><path d="M12 4v7H4M14 20v-5h6"/></svg>',
  floor: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 21V4h9v17M14 9h5v12M3 21h18M8 8h3M8 12h3M8 16h3"/></svg>',
  plot: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7l6-3 6 3 6-3v13l-6 3-6-3-6 3z"/><path d="M9 4v13M15 7v13"/></svg>',
  phone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3h4l2 5-2.5 1.5a11 11 0 005 5L15 12l5 2v4a2 2 0 01-2 2A16 16 0 013 5a2 2 0 012-2"/></svg>',
  mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5h18v14H3z"/><path d="M3 6l9 7 9-7"/></svg>',
  pin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-6.2-7-12a7 7 0 0114 0c0 5.8-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h16M14 6l6 6-6 6"/></svg>',
  leaf: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19c0-8 5-14 15-14 0 10-6 15-14 15"/><path d="M5 19l8-8"/></svg>',
  grid: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z"/></svg>'
};

/* Trečias rodiklis kortelėje priklauso nuo tipo */
function thirdSpec(p) {
  const s = (icon, value, label) => ({ icon, value, label, text: `${value} ${label}` });
  if (p.floor) return s(ICON.floor, `${p.floor}/${p.floors}`, "aukštas");
  if (p.type === "butas" && p.floors) return s(ICON.floor, p.floors, `${plural(p.floors, ["aukšto", "aukštų", "aukštų"])} namas`);
  if (p.plot) return s(ICON.plot, `${fmtNum.format(p.plot)} a`, "sklypas");
  if (p.floors) return s(ICON.floor, p.floors, plural(p.floors, ["aukštas", "aukštai", "aukštų"]));
  return null;
}

function agentAvatar(a, cls = "avatar") {
  return a.photo
    ? `<span class="${cls} portrait" data-broker="${esc(a.email.split("@")[0])}"><img src="${esc(a.photo)}" alt="" loading="lazy"></span>`
    : `<span class="${cls}" aria-hidden="true">${initials(a.name)}</span>`;
}

/* ---------- komponentai ---------- */
function card(p) {
  const a = AGENTS[p.agent];
  const third = thirdSpec(p);
  return `
  <a class="card" href="${propertyHref(p.id)}">
    <div class="card-media">
      <img src="${esc(p.images[0].replace("w=1600", "w=800"))}" alt="${esc(p.title)}" loading="lazy">
      <span class="badge">${p.deal === "pardavimas" ? TYPE_LABEL[p.type] : DEAL_LABEL[p.deal]}</span>
    </div>
    <div class="card-body">
      <div class="card-top">
        <span class="agent">${agentAvatar(a)}${esc(a.name)}</span>
        <span class="price">${fmtPrice(p)}</span>
      </div>
      <p class="card-title">${esc(p.title)}, ${fmtNum.format(p.area)} kv. m ploto</p>
      <ul class="specs">
        <li>${ICON.area}${fmtNum.format(p.area)} m²</li>
        ${p.rooms ? `<li>${ICON.rooms}${roomsLabel(p.rooms)}</li>` : ""}
        ${third ? `<li>${third.icon}${third.text}</li>` : ""}
      </ul>
    </div>
  </a>`;
}

const grid = (list) =>
  list.length
    ? `<div class="cards">${list.map(card).join("")}</div>`
    : `<p class="empty">Šiuo metu objektų nėra. <a href="#/kontaktai">Susisiekite</a> – pranešime, kai atsiras.</p>`;

function contactForm({ message = "", compact = false } = {}) {
  return `
  <form class="form ${compact ? "form--compact" : ""}" data-form>
    <div class="form-row">
      <label><span>Vardas</span><input name="name" required autocomplete="name"></label>
      <label><span>Telefonas</span><input name="phone" type="tel" autocomplete="tel"></label>
    </div>
    <label><span>El. paštas</span><input name="email" type="email" required autocomplete="email"></label>
    <label><span>Žinutė</span><textarea name="message" rows="${compact ? 3 : 4}">${esc(message)}</textarea></label>
    <p class="form-privacy">Pateikdami užklausą susipažinkite su <a href="${SITE_ROOT}privatumo-politika/" target="_blank" rel="noopener noreferrer">privatumo politika</a>.</p>
    <button class="btn btn-dark" type="submit">Siųsti laišką ${ICON.arrow}</button>
    <p class="form-ok" role="status" hidden>Tai demonstracinė forma. Laiškų siuntimas bus prijungtas veikiančioje svetainėje.</p>
  </form>`;
}

/* =========================================================
   PUSLAPIAI
   ========================================================= */

function renderHome() {
  const forSale = PROPERTIES.filter((p) => p.deal !== "nuoma");
  const heroVariant = "overlay";

  return `
  <section class="hero hero--${esc(heroVariant)}">
    <div class="hero-media hero-slideshow" aria-hidden="true">
      <img class="hero-slide" src="assets/hero.png" alt="" fetchpriority="high">
      <img class="hero-slide" src="assets/hero/house.jpg" alt="" decoding="async">
      <img class="hero-slide" src="assets/hero/villa.jpg" alt="" decoding="async">
    </div>
    <div class="hero-content wrap">
      <div class="hero-text">
        <p class="eyebrow">- Nekilnojamasis turtas - Vilnius</p>
        <h1>Suprantame Jūsų<br>namų <em>vertę.</em></h1>
        <p class="lead">Ir atskleidžiame ją pirkėjams.<br>Mes dirbame Jums, kad kartu pasiektume<br>maksimalaus rezultato.</p>
        <div class="hero-actions">
          <a class="btn btn-light" href="#/kontaktai">Planuojate parduoti? ${ICON.arrow}</a>
        </div>
      </div>
    </div>
    <div class="hero-bottom"><span>Nekilnojamojo turto paslaugos Vilniuje ir jo priemiesčiuose.</span><a href="#/apie">Pažinkite Solidi ↓</a></div>
    <span class="hero-side" aria-hidden="true">NAMAI. VERTĖ. ŽMONĖS.</span>
  </section>

  <section class="section about" id="apie">
    <div class="wrap about-grid">
      <div>
        <p class="eyebrow">Apie mus</p>
        <h2 class="statement"><em>Solidi</em> – tai šiuolaikiška nekilnojamojo turto agentūra, kurioje sprendimai priimami remiantis duomenimis, patirtimi ir rinkos analize, o ne nuojauta.</h2>
      </div>
      <div class="about-side">
        <p>Deriname profesionalią rinkodarą, stiprias derybas ir kruopščiai valdomą procesą, kad mūsų klientai priimtų užtikrintus sprendimus ir pasiektų geriausią rezultatą.</p>
        <a class="link-arrow" href="#/kontaktai">Pasikalbėkime ${ICON.arrow}</a>
      </div>
    </div>
  </section>

  <section class="section services" id="paslaugos">
    <div class="wrap">
      <div class="section-head">
        <div>
          <p class="eyebrow">Paslaugos</p>
          <h2>Nekilnojamojo turto pardavimas</h2>
        </div>
        <p class="section-sub">Būsto pardavimo paslaugos Vilniuje ir jo priemiesčiuose.</p>
      </div>
      <ol class="steps">
        <li>
          <span class="step-no">01</span>
          <h3>Įsigiliname</h3>
          <p>Sėkmingas pardavimas prasideda gerokai anksčiau nei pirmoji apžiūra. Išklausome jūsų poreikius, įsigiliname į situaciją ir susitariame dėl pardavimo tikslų. Atstovaujame jums.</p>
        </li>
        <li>
          <span class="step-no">02</span>
          <h3>Atskleidžiame vertę</h3>
          <p>Analizuojame rinką, pagrindžiame siūlomą kainą ir išryškiname būsto privalumus. Padedame paruošti jį pardavimui ir apgalvojame, kaip pristatyti pirkėjams.</p>
        </li>
        <li>
          <span class="step-no">03</span>
          <h3>Lydime iki sandorio</h3>
          <p>Organizuojame apžiūras, vedame derybas ir koordinuojame pardavimo procesą. Kiekviename etape žinote, kas vyksta ir kokie žingsniai laukia toliau.</p>
        </li>
      </ol>
    </div>
  </section>

  <section class="section listings-preview" id="objektai">
    <div class="wrap">
      <div class="section-head">
        <div>
          <p class="eyebrow">Parduodame</p>
          <h2>Erdvė Jūsų gyvenimui.</h2>
        </div>

      </div>
      <div class="chips home-categories" aria-label="Objektų kategorijos">${[["all","Visi objektai"],["projektas","Projektai"],["namas","Namai"],["butas","Butai"],["kitas","Kitas NT"]].map(([key,label])=>`<button type="button" class="chip ${key === "all" ? "is-active" : ""}" data-category="${key}" aria-pressed="${key === "all"}">${label}</button>`).join("")}</div>
      <div data-home-grid>${grid(forSale)}</div>
      <p class="demo-note">Pavyzdiniai objektai ir iliustracinės nuotraukos.</p>
    </div>
  </section>

  <section class="section contact" id="kontaktai">
    <div class="wrap contact-grid">
      <div>
        <p class="eyebrow">Susisiekti</p>
        <h2>Planuojate parduoti ar ieškote namų?</h2>
        <p class="section-sub">Parašykite arba paskambinkite – nemokamai įvertinsime jūsų būsto vertę ir pasiūlysime pardavimo planą.</p>
        <div class="contact-people">${Object.values(AGENTS).map(a => {
          const phone = a.phone || "+370 600 00000";
          return `<div><strong>${esc(a.name)}</strong>
            <a class="contact-method" href="tel:${phone.replace(/\s/g, "")}">${ICON.phone}<span>${esc(phone)}</span></a>
            <a class="contact-method" href="mailto:${esc(a.email)}">${ICON.mail}<span>${esc(a.email)}</span></a>
          </div>`;
        }).join("")}</div>
        <div class="contact-social" role="group" aria-label="Solidi socialiniai tinklai">
          <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook (atsidaro naujame skirtuke)">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 21v-8h3l.5-4H14V7c0-1 .3-2 2-2h2V1.5A26 26 0 0 0 15 1c-3 0-5 1.8-5 5v3H7v4h3v8"/></svg>
          </a>
          <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram (atsidaro naujame skirtuke)">
            <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none"/></svg>
          </a>
        </div>
      </div>
      <div class="contact-card">${contactForm()}</div>
    </div>
  </section>`;
}

function renderProperty(id) {
  const p = PROPERTIES.find((x) => x.id === id);
  if (!p) return renderNotFound();
  const a = AGENTS[p.agent];
  document.title = `${p.title} – Solidi`;

  const back = {
    pardavimas: ["#/parduodame", "Parduodame"],
    nuoma: ["#/nuoma", "Nuoma"],
    projektas: ["#/projektai", "Projektai"]
  }[p.deal];
  const subLink =
    p.deal === "pardavimas"
      ? { namas: ["#/parduodame/namai", "Namai"], butas: ["#/parduodame/butai", "Butai"], kitas: ["#/parduodame/kitas", "Kitas NT"] }[p.type]
      : null;

  const info = [
    ["Kaina", fmtPrice(p)],
    p.deal !== "nuoma" && !p.priceFrom ? ["Kaina už m²", `${fmtNum.format(Math.round(p.price / p.area))} €`] : null,
    ["Tipas", TYPE_LABEL[p.type]],
    ["Plotas", `${fmtNum.format(p.area)} m²`],
    p.rooms ? ["Kambarių sk.", p.rooms] : null,
    p.floor ? ["Aukštas", `${p.floor} iš ${p.floors}`] : p.floors ? ["Aukštų sk.", p.floors] : null,
    p.plot ? ["Sklypo plotas", `${fmtNum.format(p.plot)} a`] : null,
    p.units ? ["Objektų projekte", p.units] : null,
    [p.deal === "projektas" ? "Statybų pabaiga" : "Statybos metai", p.year + (p.renovated ? ` (renovuota ${p.renovated})` : "")],
    ["Šildymas", p.heating],
    ["Įrengimas", p.finish],
    ["Energinė klasė", p.energy]
  ].filter(Boolean);

  const imgs = p.images;
  const galleryCls = imgs.length >= 5 ? "gallery--5" : imgs.length >= 3 ? "gallery--3" : "gallery--1";
  const shown = imgs.slice(0, imgs.length >= 5 ? 5 : imgs.length >= 3 ? 3 : 1);

  const similar = PROPERTIES.filter((x) => x.id !== p.id && x.deal === p.deal)
    .sort((x, y) => (y.type === p.type) - (x.type === p.type))
    .slice(0, 3);

  const [lat, lon] = p.coords || [];
  const map = p.coords ? `<div class="map"><iframe title="Google Maps - ${esc(p.address)}" src="https://maps.google.com/maps?q=${encodeURIComponent(`${lat},${lon}`)}&amp;z=15&amp;output=embed" loading="eager" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe></div>` : "";

  const third = thirdSpec(p);

  return `
  <section class="property">
    <div class="wrap">
      <nav class="crumbs">
        <a href="#/">Pradžia</a><span>/</span>
        <a href="${back[0]}">${back[1]}</a><span>/</span>
        ${subLink ? `<a href="${subLink[0]}">${subLink[1]}</a><span>/</span>` : ""}
        <span>${esc(p.title)}</span>
      </nav>

      <div class="gallery ${galleryCls}">
        ${shown.map((src, i) => `<button class="g-item" data-open="${i}" aria-label="Atidaryti nuotrauką ${i + 1}"><img src="${esc(src)}" alt="${esc(p.title)} – nuotrauka ${i + 1}" ${i ? 'loading="lazy"' : ""}></button>`).join("")}
        <button class="btn btn-light btn-sm g-all" data-open="0">${ICON.grid} Visos nuotraukos (${imgs.length})</button>
      </div>

      <div class="property-grid">
        <article class="property-main">
          <span class="badge badge--inline">${p.deal === "pardavimas" ? TYPE_LABEL[p.type] : DEAL_LABEL[p.deal]}</span>
          <h1>${esc(p.title)}</h1>
          ${map ? `<a class="address address-link" href="#vieta">${ICON.pin}${esc(p.address)}</a>` : `<p class="address">${ICON.pin}${esc(p.address)}</p>`}

          <ul class="specs specs--lg">
            <li>${ICON.area}<span><strong>${fmtNum.format(p.area)} m²</strong>Plotas</span></li>
            ${p.rooms ? `<li>${ICON.rooms}<span><strong>${p.rooms}</strong>${plural(p.rooms, ["Kambarys", "Kambariai", "Kambarių"])}</span></li>` : ""}
            ${third ? `<li>${third.icon}<span><strong>${third.value}</strong>${third.label}</span></li>` : ""}
            ${p.energy ? `<li>${ICON.leaf}<span><strong>${esc(p.energy)}</strong>Energinė klasė</span></li>` : ""}
          </ul>

          <h2 class="h-sm">Aprašymas</h2>
          <div class="prose">${p.description.map((d) => `<p>${esc(d)}</p>`).join("")}</div>

          <h2 class="h-sm">Pagrindinė informacija</h2>
          <dl class="info">${info.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>

          ${p.features?.length ? `<h2 class="h-sm">Ypatybės</h2><ul class="features">${p.features.map((f) => `<li>${esc(f)}</li>`).join("")}</ul>` : ""}

          ${map ? `<h2 class="h-sm" id="vieta">Vieta</h2>${map}` : ""}
        </article>

        <aside class="property-aside">
          <div class="price-card">
            <p class="price price--lg">${fmtPrice(p)}</p>
            ${p.deal !== "nuoma" && !p.priceFrom ? `<p class="muted">${fmtNum.format(Math.round(p.price / p.area))} €/m²</p>` : ""}
            <div class="agent-card">
              ${agentAvatar(a, "avatar avatar--lg")}
              <div><strong>${esc(a.name)}</strong><span>${esc(a.role)}</span></div>
            </div>
            <div class="agent-actions">
              <a class="btn btn-outline" href="tel:${(a.phone || "+370 600 00000").replace(/\s/g, "")}">${ICON.phone} ${esc(a.phone || "+370 600 00000")}</a>
              <a class="btn btn-outline" href="mailto:${a.email}?subject=${encodeURIComponent(p.title)}">${ICON.mail} ${esc(a.email)}</a>
            </div>
            <h3 class="h-xs">Užsiregistruoti apžiūrai</h3>
            ${contactForm({ message: `Sveiki, domina objektas: ${p.title.replace(/\.$/, "")}.`, compact: true })}
          </div>
        </aside>
      </div>
    </div>
  </section>

  ${similar.length ? `
  <section class="section section--sand">
    <div class="wrap">
      <div class="section-head">
        <h2>Panašūs objektai</h2>

      </div>
      ${grid(similar)}
    </div>
  </section>` : ""}`;
}

function renderNotFound() {
  document.title = "Puslapis nerastas – Solidi";
  return `
  <section class="page-head page-head--center">
    <div class="wrap">
      <h1>Puslapis nerastas</h1>
      <p class="section-sub">Objektas galėjo būti parduotas arba nuoroda pasikeitė.</p>
      <a class="btn btn-dark" href="#/">Grįžti į pradžią ${ICON.arrow}</a>
    </div>
  </section>`;
}

/* =========================================================
   ROUTER
   ========================================================= */
let lastPage = null;

function router() {
  const hash = location.hash.replace(/^#/, "") || "/";
  const parts = hash.split("/").filter(Boolean);
  let html, after = () => {}, page, scrollTarget = null;

  if (parts.length === 0) {
    page = "home"; html = renderHome();
  } else if (["apie", "paslaugos", "kontaktai"].includes(parts[0])) {
    page = "home"; scrollTarget = parts[0];
    html = lastPage === "home" ? null : renderHome();
  } else if (["privatumas", "privatumo-politika"].includes(parts[0])) {
    location.replace(`${SITE_ROOT}privatumo-politika/`);
    return;
  } else if (parts[0] === "parduodame" && (!parts[1] || SUBTYPE_SLUG[parts[1]])) {
    page = "home"; scrollTarget = "objektai";
    html = renderHome();
    after = () => selectHomeCategory(SUBTYPE_SLUG[parts[1]] || "all");
  } else if (parts[0] === "nuoma") {
    page = "home"; scrollTarget = "objektai"; html = renderHome();
    after = () => selectHomeCategory("all", true);
  } else if (parts[0] === "projektai") {
    page = "home"; scrollTarget = "objektai"; html = renderHome();
    after = () => selectHomeCategory("projektas");
  } else if (parts[0] === "objektas" && parts[1]) {
    if (PROPERTIES.some(p => p.id === parts[1])) {
      location.replace(propertyHref(parts[1]));
      return;
    }
    page = "404"; html = renderNotFound();
  } else {
    page = "404"; html = renderNotFound();
  }

  if (page === "home") document.title = "Solidi – nekilnojamojo turto agentūra Vilniuje";

  if (html !== null) {
    app.innerHTML = html;
    after();
    bindForms();
    bindHomeCategories();

  }
  lastPage = page;

  if (scrollTarget) {
    requestAnimationFrame(() => document.getElementById(scrollTarget)?.scrollIntoView({ behavior: html === null ? "smooth" : "auto" }));
  } else {
    window.scrollTo(0, 0);
  }

  setActiveNav(parts);
  closeMobileNav();
}

function setActiveNav(parts) {
  const key = parts[0] === "objektas"
    ? ({ pardavimas: "parduodame", nuoma: "nuoma", projektas: "projektai" }[PROPERTIES.find((p) => p.id === parts[1])?.deal])
    : parts[0];
  document.querySelectorAll("[data-nav]").forEach((el) => {
    const nav = el.dataset.nav;
    el.classList.toggle("is-active", nav === key || nav === parts.join("/"));
  });
}

/* ---------- formos (be backend – tik demonstracija) ---------- */
function bindForms() {
  document.querySelectorAll("[data-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      // The WordPress implementation will submit to the server mail handler.
      form.querySelector(".form-ok").hidden = false;
    });
  });
}

/* ---------- galerija / lightbox ---------- */
const lb = $("#lightbox");
let lbImages = [], lbIndex = 0, lbTrigger = null;
let lbBackground = [];

function bindGallery(p) {
  if (!p) return;
  lbImages = p.images;
  document.querySelectorAll("[data-open]").forEach((b) =>
    b.addEventListener("click", () => openLightbox(+b.dataset.open))
  );
}
function openLightbox(i) {
  lbTrigger = document.activeElement;
  closeMobileNav();
  lbBackground = [app, $(".site-header"), $(".site-footer")].filter(Boolean).map(element => {
    const previous = element.inert;
    element.inert = true;
    return {element, previous};
  });
  lbIndex = i;
  updateLightbox();
  lb.hidden = false;
  document.body.style.overflow = "hidden";
  document.documentElement.classList.add("gallery-open");
  $(".lb-close", lb).focus();
}
function closeLightbox() {
  resetGalleryZoom();
  lb.hidden = true;
  document.documentElement.classList.remove("gallery-open");
  document.body.style.overflow = "";
  lbBackground.forEach(({element, previous}) => { element.inert = previous; });
  lbBackground = [];
  lbTrigger?.focus();
}
function updateLightbox() {
  resetGalleryZoom();
  $("img", lb).src = lbImages[lbIndex];
  $("img", lb).alt = `Objekto nuotrauka ${lbIndex + 1}`;
  $(".lb-count", lb).textContent = `${lbIndex + 1} / ${lbImages.length}`;
}
const step = (d) => { lbIndex = (lbIndex + d + lbImages.length) % lbImages.length; updateLightbox(); };

$(".lb-close", lb).addEventListener("click", closeLightbox);
$(".lb-prev", lb).addEventListener("click", () => step(-1));
$(".lb-next", lb).addEventListener("click", () => step(1));
lb.addEventListener("click", (e) => { if (e.target === lb) closeLightbox(); });
document.addEventListener("keydown", (e) => {
  if (lb.hidden) return;
  if (e.key === "Tab") {
    const buttons = [...lb.querySelectorAll("button")];
    const first = buttons[0], last = buttons[buttons.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") step(-1);
  if (e.key === "ArrowRight") step(1);
});

/* Pinch and drag are scoped to the gallery; page zoom stays available outside it. */
const galleryStage = $(".lb-stage", lb);
const galleryImage = $("img", galleryStage);
const galleryPointers = new Map();
let galleryZoom = { scale: 1, x: 0, y: 0 };
let galleryGesture = null;
let gallerySwipe = null;

function resetGalleryZoom() {
  galleryPointers.clear();
  galleryGesture = null;
  gallerySwipe = null;
  galleryZoom = { scale: 1, x: 0, y: 0 };
  paintGalleryZoom();
}
function paintGalleryZoom() {
  const limitX = Math.max(0, (galleryImage.offsetWidth * galleryZoom.scale - galleryStage.clientWidth) / 2);
  const limitY = Math.max(0, (galleryImage.offsetHeight * galleryZoom.scale - galleryStage.clientHeight) / 2);
  galleryZoom.x = Math.max(-limitX, Math.min(limitX, galleryZoom.x));
  galleryZoom.y = Math.max(-limitY, Math.min(limitY, galleryZoom.y));
  galleryImage.style.transform = `translate(${galleryZoom.x}px, ${galleryZoom.y}px) scale(${galleryZoom.scale})`;
  galleryStage.classList.toggle("is-zoomed", galleryZoom.scale > 1);
}
function startGalleryGesture() {
  const points = [...galleryPointers.values()];
  if (!points.length) { galleryGesture = null; return; }
  const [a, b] = points;
  const rect = galleryStage.getBoundingClientRect();
  const midpoint = b ? {x: (a.x + b.x) / 2, y: (a.y + b.y) / 2} : a;
  galleryGesture = {
    count: b ? 2 : 1, start: {...galleryZoom},
    x: midpoint.x - rect.left - rect.width / 2,
    y: midpoint.y - rect.top - rect.height / 2,
    distance: b ? Math.max(1, Math.hypot(a.x - b.x, a.y - b.y)) : 0
  };
}
galleryStage.addEventListener("pointerdown", event => {
  if (event.pointerType === "mouse" && event.button !== 0) return;
  event.preventDefault();
  gallerySwipe = galleryPointers.size === 0
    ? {id: event.pointerId, x: event.clientX, y: event.clientY,
       panX: galleryZoom.x,
       limitX: Math.max(0, (galleryImage.offsetWidth * galleryZoom.scale - galleryStage.clientWidth) / 2)}
    : null;
  galleryPointers.set(event.pointerId, {x: event.clientX, y: event.clientY});
  galleryStage.setPointerCapture(event.pointerId);
  startGalleryGesture();
});
galleryStage.addEventListener("pointermove", event => {
  if (!galleryPointers.has(event.pointerId) || !galleryGesture) return;
  event.preventDefault();
  galleryPointers.set(event.pointerId, {x: event.clientX, y: event.clientY});
  const [a, b] = [...galleryPointers.values()];
  const rect = galleryStage.getBoundingClientRect();
  const midpoint = b ? {x: (a.x + b.x) / 2, y: (a.y + b.y) / 2} : a;
  const x = midpoint.x - rect.left - rect.width / 2;
  const y = midpoint.y - rect.top - rect.height / 2;
  const start = galleryGesture.start;
  if (b && galleryGesture.count === 2) {
    const scale = Math.max(1, Math.min(4, start.scale * Math.hypot(a.x - b.x, a.y - b.y) / galleryGesture.distance));
    galleryZoom = {scale, x: x - (galleryGesture.x - start.x) * scale / start.scale, y: y - (galleryGesture.y - start.y) * scale / start.scale};
  } else if (galleryGesture.count === 1 && start.scale > 1) {
    galleryZoom = {scale: start.scale, x: start.x + x - galleryGesture.x, y: start.y + y - galleryGesture.y};
  }
  paintGalleryZoom();
});
function endGalleryPointer(event) {
  if (!galleryPointers.has(event.pointerId)) return;
  const swipe = gallerySwipe;
  const canSwipe = event.type === "pointerup" && galleryPointers.size === 1
    && swipe?.id === event.pointerId;
  galleryPointers.delete(event.pointerId);
  gallerySwipe = null;
  if (canSwipe) {
    const dx = event.clientX - swipe.x;
    const dy = event.clientY - swipe.y;
    const threshold = Math.max(40, Math.min(80, galleryStage.clientWidth * 0.15));
    // Consume the movement available inside the photo before navigating.
    const availablePan = dx < 0 ? swipe.panX + swipe.limitX : swipe.limitX - swipe.panX;
    const pastEdge = Math.max(0, Math.abs(dx) - availablePan);
    if (pastEdge >= threshold && Math.abs(dx) > Math.abs(dy) * 1.3) {
      step(dx < 0 ? 1 : -1);
      return;
    }
  }
  startGalleryGesture();
}
for (const type of ["pointerup", "pointercancel", "lostpointercapture"]) {
  galleryStage.addEventListener(type, endGalleryPointer);
}
galleryStage.addEventListener("dblclick", event => {
  event.preventDefault();
  galleryZoom = {scale: galleryZoom.scale > 1 ? 1 : 2, x: 0, y: 0};
  paintGalleryZoom();
});
galleryImage.addEventListener("load", paintGalleryZoom);
window.addEventListener("resize", () => { if (!lb.hidden) resetGalleryZoom(); });

/* ---------- mobilus meniu ---------- */
const toggle = $(".nav-toggle");
const mobileNav = $("#main-nav");
function setMobileNav(open) {
  toggle.setAttribute("aria-expanded", String(open));
  document.body.classList.toggle("nav-open", open);
  mobileNav.inert = window.matchMedia("(max-width: 920px)").matches && !open;
}
toggle.addEventListener("click", () => {
  setMobileNav(toggle.getAttribute("aria-expanded") !== "true");
});
function closeMobileNav() { setMobileNav(false); }

/* ---------- header šešėlis slenkant ---------- */
window.addEventListener("scroll", () => {
  document.body.classList.toggle("scrolled", window.scrollY > 8);
}, { passive: true });

/* "Į viršų" nuoroda neturi keisti maršruto */
document.addEventListener("click", (e) => {
  const a = e.target.closest('a[href="#top"]');
  if (a) { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); return; }
  // Paspaudus tą pačią nuorodą (pvz. „Apie mus“ antrą kartą) – vis tiek nuslinkti
  const same = e.target.closest('a[href^="#/"]');
  if (same && same.target !== "_blank" && !e.ctrlKey && !e.metaKey && !e.shiftKey && same.getAttribute("href") === location.hash) { e.preventDefault(); router(); }
});

$("#year").textContent = new Date().getFullYear();
if (typeof SOLIDI_BUILD === "undefined") {
  window.matchMedia("(max-width: 920px)").addEventListener("change", closeMobileNav);
  closeMobileNav();
  const propertyId = document.body.dataset.property;
  if (propertyId) {
    bindGallery(PROPERTIES.find(p => p.id === propertyId));
    bindForms();

    setActiveNav(["objektas", propertyId]);
  } else if (!document.body.dataset.page) {
    window.addEventListener("hashchange", router);
    router();
  }
}

function selectHomeCategory(key, rental = false) {
  const container = document.querySelector('[data-home-grid]');
  if (!container) return;
  container.dataset.rental = String(rental);
  const heading = document.querySelector('.listings-preview h2');
  heading.textContent = rental ? 'Erdvė Jūsų gyvenimui. Nuoma.' : 'Erdvė Jūsų gyvenimui.';
  document.querySelectorAll('[data-category]').forEach(button => {
    const selected = button.dataset.category === key;
    button.classList.toggle('is-active', selected);
    button.setAttribute('aria-pressed', String(selected));
    button.hidden = rental && button.dataset.category === 'projektas';
  });
  container.innerHTML = grid(PROPERTIES.filter(p => {
    if (rental) return p.deal === 'nuoma' && (key === 'all' || p.type === key);
    return p.deal !== 'nuoma' && (key === 'all' || (key === 'projektas' ? p.deal === 'projektas' : p.type === key && p.deal !== 'projektas'));
  }));
}
function bindHomeCategories() {
  document.querySelectorAll('[data-category]').forEach(button => button.addEventListener('click', () => {
    selectHomeCategory(button.dataset.category, document.querySelector('[data-home-grid]').dataset.rental === 'true');
  }));
}
