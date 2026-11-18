function renderPrivacy() {
 document.title = 'Privatumo politika - Solidi';
 return `<section class="section"><div class="wrap privacy-copy"><p class="eyebrow">Informacija</p><h1>Privatumo politika</h1><p class="draft-notice">Pradinis tekstas derinimui. Prieš skelbiant svetainę reikia patvirtinti duomenų valdytojų rekvizitus, paslaugų teikėjus ir saugojimo terminus.</p><h2>Užklausos ir kontaktai</h2><p>Susisiekus su Solidi naudojami jūsų pateikti kontaktiniai duomenys ir žinutė, kad galėtume atsakyti į užklausą. Dėl duomenų tvarkymo galite rašyti giedre@solidi.lt arba lina@solidi.lt. Šioje HTML peržiūroje forma duomenų nesiunčia. Veikiančioje svetainėje užklausos bus siunčiamos per serverį.</p><h2>Analitika ir rinkodara</h2><p>Google Analytics ir Meta Pixel gali būti naudojami lankomumo analizei ir reklamos rezultatams vertinti tik gavus atitinkamą jūsų pasirinkimą. Šioje peržiūroje jie išjungti, kol nėra įvesti paskyrų identifikatoriai. Pasirinkimus galite pakeisti puslapio apačioje.</p><h2>Žemėlapiai ir kitas išorinis turinys</h2><p>Google Maps automatiškai įkeliamas objekto puslapyje. Jį atidarius jūsų naršyklė prisijungia prie Google serverių. Iliustracinės objektų nuotraukos šioje peržiūroje įkeliamos iš Unsplash.</p><h2>Jūsų duomenys</h2><p>Galite kreiptis dėl informacijos apie tvarkomus duomenis, jų tikslinimo, ištrynimo ar sutikimo atšaukimo. Galutinėje politikoje bus detalizuoti duomenų tvarkymo pagrindai, gavėjai, perdavimas, saugojimo terminai ir teisių įgyvendinimo tvarka.</p><a class="link-arrow" href="#/">Grįžti į pradžią →</a></div></section>`;
}

document.addEventListener('DOMContentLoaded', () => {
 let consent; try { consent = JSON.parse(localStorage.getItem('solidi-consent-v1')); } catch {}
 const panel = document.createElement('section');
 panel.className = 'cookie-panel'; panel.setAttribute('aria-label','Slapukų pasirinkimai'); panel.hidden = Boolean(consent);
 panel.innerHTML = '<div><h2>Jūsų privatumas</h2><p>Būtinus nustatymus išsaugome naršyklėje. Analitiką ir rinkodarą įjungsime tik jums pasirinkus. <a href="#/privatumas">Plačiau</a></p><div class="cookie-options"><label><input type="checkbox" name="analytics"> Analitika</label><label><input type="checkbox" name="marketing"> Rinkodara</label></div></div><div class="cookie-actions"><button class="btn btn-outline" data-consent="none">Tik būtini</button><button class="btn btn-outline" data-consent="selected">Išsaugoti pasirinkimus</button><button class="btn btn-dark" data-consent="all">Priimti visus</button></div>';
 if (document.body.dataset.property) panel.querySelector('a').href = '../../index.html#/privatumas';
 document.body.append(panel);
 const apply = c => {
  if(c?.analytics && /^G-[A-Z0-9]+$/.test(SOLIDI_SETTINGS.googleAnalyticsId) && !window.solidiGaLoaded) {
   window.solidiGaLoaded = true; window.dataLayer = window.dataLayer || []; window.gtag = function(){window.dataLayer.push(arguments)};
   window.gtag('js',new Date()); window.gtag('config',SOLIDI_SETTINGS.googleAnalyticsId);
   const script = document.createElement('script'); script.async = true; script.src = 'https://www.googletagmanager.com/gtag/js?id=' + SOLIDI_SETTINGS.googleAnalyticsId; document.head.append(script);
  }
  if(c?.marketing && /^\d+$/.test(SOLIDI_SETTINGS.metaPixelId) && !window.fbq) {
   const fbq = window.fbq = function(){fbq.callMethod ? fbq.callMethod.apply(fbq,arguments) : fbq.queue.push(arguments)}; fbq.queue=[]; fbq.loaded=true; fbq.version='2.0';
   const script=document.createElement('script'); script.async=true; script.src='https://connect.facebook.net/en_US/fbevents.js'; document.head.append(script); fbq('init',SOLIDI_SETTINGS.metaPixelId); fbq('track','PageView');
  }
 };
 document.querySelector('.cookie-settings').addEventListener('click', () => { panel.hidden = false; panel.querySelector('[name="analytics"]').checked = Boolean(consent?.analytics); panel.querySelector('[name="marketing"]').checked = Boolean(consent?.marketing); panel.querySelector('button').focus(); });
 panel.querySelectorAll('[data-consent]').forEach(b => b.addEventListener('click', () => {
  const value = b.dataset.consent; const next = {analytics:value === 'all' || (value === 'selected' && panel.querySelector('[name="analytics"]').checked),marketing:value === 'all' || (value === 'selected' && panel.querySelector('[name="marketing"]').checked)};
  const revoked = (consent?.analytics && !next.analytics) || (consent?.marketing && !next.marketing);
  try {localStorage.setItem('solidi-consent-v1', JSON.stringify(next));} catch {}
  consent = next; panel.hidden = true;
  if(revoked) { document.cookie.split(';').forEach(cookie => { const name=cookie.split('=')[0].trim(); if(/^(_ga|_gid|_fbp|_fbc)/.test(name)) { for(const domain of [null,location.hostname,'.'+location.hostname]) document.cookie=name+'=; Max-Age=0; path=/' + (domain ? '; domain='+domain : ''); } }); location.reload(); return; }
  apply(consent);
 }));
 apply(consent);
});
