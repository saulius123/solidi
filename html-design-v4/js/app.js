/* =========================================================
   SOLIDI – vieno puslapio šablonas (hash routing)
   Maršrutai:
     #/                      – pradžia
     #/parduodame            – visi parduodami objektai
     #/parduodame/namai|butai|kitas
     #/nuoma, #/projektai
     #/objektas/<id>         – atskiras objekto puslapis
     #/apie, #/paslaugos, #/kontaktai – pradžios puslapio skiltys
   Hash maršrutai veikia GitHub Pages be jokių papildomų nustatymų.
   ========================================================= */

const $ = (sel, root = document) => root.querySelector(sel);
const app = $("#app");

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
    ? `<img class="${cls}" src="${esc(a.photo)}" alt="">`
    : `<span class="${cls}" aria-hidden="true">${initials(a.name)}</span>`;
}

/* ---------- komponentai ---------- */
function card(p) {
  const a = AGENTS[p.agent];
  const third = thirdSpec(p);
  return `
  <a class="card" href="#/objektas/${p.id}">
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
    <button class="btn btn-dark" type="submit">Siųsti užklausą</button>
    <p class="form-ok" hidden>Ačiū! Susisieksime su jumis artimiausiu metu.</p>
  </form>`;
}

/* =========================================================
   PUSLAPIAI
   ========================================================= */

function renderHome() {
  const forSale = PROPERTIES.filter((p) => p.deal === "pardavimas").slice(0, 6);
  // Hero variantas: overlay (tekstas ant nuotraukos) | side (šone) | below (po nuotrauka)
  // Galima keisti čia arba per URL: index.html?hero=side
  const heroVariant = new URLSearchParams(location.search).get("hero") || "overlay";

  return `
  <section class="hero hero--${esc(heroVariant)}">
    <div class="hero-media"><img src="assets/hero.png" alt="Solidi parduodamas objektas" fetchpriority="high"></div>
    <div class="hero-content wrap">
      <div class="hero-text">
        <p class="eyebrow">Nekilnojamojo turto agentūra</p>
        <h1>Suprantame Jūsų namų vertę ir atskleidžiame ją pirkėjams.</h1>
        <p class="lead">Mes dirbame Jums, kad kartu pasiektume maksimalaus rezultato. Nekilnojamojo turto paslaugos Vilniuje ir jo priemiesčiuose.</p>
        <div class="hero-actions">
          <a class="btn btn-light" href="#/parduodame">Peržiūrėti objektus ${ICON.arrow}</a>
          <a class="btn btn-ghost" href="#/kontaktai">Parduoti su mumis</a>
        </div>
      </div>
    </div>
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

  <section class="section listings-preview">
    <div class="wrap">
      <div class="section-head">
        <div>
          <p class="eyebrow">Parduodame</p>
          <h2>Naujausi objektai</h2>
        </div>
        <a class="link-arrow" href="#/parduodame">Visi objektai ${ICON.arrow}</a>
      </div>
      ${grid(forSale)}
    </div>
  </section>

  <section class="section contact" id="kontaktai">
    <div class="wrap contact-grid">
      <div>
        <p class="eyebrow">Susisiekti</p>
        <h2>Planuojate parduoti ar ieškote namų?</h2>
        <p class="section-sub">Parašykite arba paskambinkite – nemokamai įvertinsime jūsų būsto vertę ir pasiūlysime pardavimo planą.</p>
        <ul class="contact-list">
          <li>${ICON.phone}<a href="tel:+37060000000">+370 600 00000</a></li>
          <li>${ICON.mail}<a href="mailto:info@solidi.lt">info@solidi.lt</a></li>
          <li>${ICON.pin}<span>Gedimino pr. 1, Vilnius</span></li>
        </ul>
      </div>
      <div class="contact-card">${contactForm()}</div>
    </div>
  </section>`;
}

function renderList(deal, sub) {
  let list = PROPERTIES.filter((p) => p.deal === deal);
  if (sub) list = list.filter((p) => p.type === SUBTYPE_SLUG[sub]);

  const titles = {
    pardavimas: { "": "Parduodame", namai: "Parduodami namai", butai: "Parduodami butai", kitas: "Kitas NT" },
    nuoma: { "": "Nuoma" },
    projektas: { "": "Projektai" }
  };
  const intro = {
    pardavimas: "Atrinkti namai, butai ir komercinės patalpos Vilniuje ir jo priemiesčiuose.",
    nuoma: "Ilgalaikės nuomos butai ir namai Vilniuje.",
    projektas: "Naujos statybos projektai, kuriuos atstovaujame."
  };
  const title = titles[deal][sub || ""];

  const chips =
    deal === "pardavimas"
      ? `<div class="chips" role="tablist">
          ${[["", "Visi"], ["namai", "Namai"], ["butai", "Butai"], ["kitas", "Kitas NT"]]
            .map(([s, l]) => `<a class="chip ${(sub || "") === s ? "is-active" : ""}" href="#/parduodame${s ? "/" + s : ""}">${l}</a>`)
            .join("")}
        </div>`
      : "<div></div>";

  document.title = `${title} – Solidi`;

  return `
  <section class="page-head">
    <div class="wrap">
      <nav class="crumbs"><a href="#/">Pradžia</a><span>/</span>${sub ? `<a href="#/parduodame">Parduodame</a><span>/</span>` : ""}<span>${title}</span></nav>
      <h1>${title}</h1>
      <p class="section-sub">${intro[deal]}</p>
    </div>
  </section>
  <section class="section section--tight">
    <div class="wrap">
      <div class="toolbar">
        ${chips}
        <div class="toolbar-right">
          <span class="count">${list.length} ${plural(list.length, ["objektas", "objektai", "objektų"])}</span>
          <label class="sort"><span class="sr-only">Rikiuoti</span>
            <select data-sort>
              <option value="new">Naujausi</option>
              <option value="price-asc">Kaina: nuo mažiausios</option>
              <option value="price-desc">Kaina: nuo didžiausios</option>
              <option value="area-desc">Plotas: didžiausias</option>
            </select>
          </label>
        </div>
      </div>
      <div data-grid>${grid(list)}</div>
    </div>
  </section>`;
}

function bindListSort(deal, sub) {
  const sel = $("[data-sort]");
  if (!sel) return;
  sel.addEventListener("change", () => {
    let list = PROPERTIES.filter((p) => p.deal === deal && (!sub || p.type === SUBTYPE_SLUG[sub]));
    const sorters = {
      "price-asc": (a, b) => a.price - b.price,
      "price-desc": (a, b) => b.price - a.price,
      "area-desc": (a, b) => b.area - a.area
    };
    if (sorters[sel.value]) list = [...list].sort(sorters[sel.value]);
    $("[data-grid]").innerHTML = grid(list);
  });
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
  const map = p.coords
    ? `<div class="map"><iframe title="Žemėlapis" loading="lazy" src="https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.02}%2C${lat - 0.008}%2C${lon + 0.02}%2C${lat + 0.008}&layer=mapnik&marker=${lat}%2C${lon}"></iframe></div>`
    : "";

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
          <p class="address">${ICON.pin}${esc(p.address)}</p>

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

          ${map ? `<h2 class="h-sm">Vieta</h2>${map}` : ""}
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
              <a class="btn btn-dark" href="tel:${a.phone.replace(/\s/g, "")}">${ICON.phone} ${esc(a.phone)}</a>
              <a class="btn btn-outline" href="mailto:${a.email}?subject=${encodeURIComponent(p.title)}">${ICON.mail} Rašyti laišką</a>
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
        <a class="link-arrow" href="${back[0]}">Visi objektai ${ICON.arrow}</a>
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
      <a class="btn btn-dark" href="#/parduodame">Visi objektai ${ICON.arrow}</a>
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
  } else if (parts[0] === "parduodame" && (!parts[1] || SUBTYPE_SLUG[parts[1]])) {
    page = hash; html = renderList("pardavimas", parts[1]);
    after = () => bindListSort("pardavimas", parts[1]);
  } else if (parts[0] === "nuoma") {
    page = hash; html = renderList("nuoma"); after = () => bindListSort("nuoma");
  } else if (parts[0] === "projektai") {
    page = hash; html = renderList("projektas"); after = () => bindListSort("projektas");
  } else if (parts[0] === "objektas" && parts[1]) {
    page = hash; html = renderProperty(parts[1]);
    after = () => bindGallery(PROPERTIES.find((p) => p.id === parts[1]));
  } else {
    page = "404"; html = renderNotFound();
  }

  if (page === "home") document.title = "Solidi – nekilnojamojo turto agentūra Vilniuje";

  if (html !== null) {
    app.innerHTML = html;
    after();
    bindForms();
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
  document.querySelectorAll("[data-form]").forEach((f) =>
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      // TODO: prijunkite Formspree / Netlify Forms / savo API, pvz.:
      // fetch("https://formspree.io/f/XXXX", { method: "POST", body: new FormData(f), headers: { Accept: "application/json" } })
      f.querySelector(".form-ok").hidden = false;
      f.reset();
    })
  );
}

/* ---------- galerija / lightbox ---------- */
const lb = $("#lightbox");
let lbImages = [], lbIndex = 0;

function bindGallery(p) {
  if (!p) return;
  lbImages = p.images;
  document.querySelectorAll("[data-open]").forEach((b) =>
    b.addEventListener("click", () => openLightbox(+b.dataset.open))
  );
}
function openLightbox(i) {
  lbIndex = i;
  updateLightbox();
  lb.hidden = false;
  document.body.style.overflow = "hidden";
  $(".lb-close", lb).focus();
}
function closeLightbox() {
  lb.hidden = true;
  document.body.style.overflow = "";
}
function updateLightbox() {
  $("img", lb).src = lbImages[lbIndex];
  $(".lb-count", lb).textContent = `${lbIndex + 1} / ${lbImages.length}`;
}
const step = (d) => { lbIndex = (lbIndex + d + lbImages.length) % lbImages.length; updateLightbox(); };

$(".lb-close", lb).addEventListener("click", closeLightbox);
$(".lb-prev", lb).addEventListener("click", () => step(-1));
$(".lb-next", lb).addEventListener("click", () => step(1));
lb.addEventListener("click", (e) => { if (e.target === lb) closeLightbox(); });
document.addEventListener("keydown", (e) => {
  if (lb.hidden) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") step(-1);
  if (e.key === "ArrowRight") step(1);
});

/* ---------- mobilus meniu ---------- */
const toggle = $(".nav-toggle");
toggle.addEventListener("click", () => {
  const open = toggle.getAttribute("aria-expanded") !== "true";
  toggle.setAttribute("aria-expanded", open);
  document.body.classList.toggle("nav-open", open);
});
function closeMobileNav() {
  toggle.setAttribute("aria-expanded", "false");
  document.body.classList.remove("nav-open");
}

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
  if (same && same.getAttribute("href") === location.hash) { e.preventDefault(); router(); }
});

$("#year").textContent = new Date().getFullYear();
window.addEventListener("hashchange", router);
router();
