/* Generate standalone property documents. Run: node build-pages.cjs */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = __dirname;
const noop = () => {};
const element = {dataset: {}, style: {}, classList: {toggle: noop, remove: noop}, addEventListener: noop, setAttribute: noop, querySelector: () => element, querySelectorAll: () => []};
const context = vm.createContext({
  SOLIDI_BUILD: true, Intl, URLSearchParams,
  document: {body: element, querySelector: () => element, querySelectorAll: () => [], addEventListener: noop},
  window: {addEventListener: noop}
});
for (const file of ['settings.js', 'privacy.js', 'data.js', 'app.js']) {
  vm.runInContext(fs.readFileSync(path.join(root, 'js', file), 'utf8'), context, {filename: file});
}
const shell = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const properties = vm.runInContext('PROPERTIES', context);
for (const property of properties) {
  if (!/^[a-z0-9-]+$/.test(property.id)) throw new Error('Invalid property slug: ' + property.id);
  context.propertyId = property.id;
  const content = vm.runInContext('renderProperty(propertyId)', context);
  const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const title = escape(context.document.title);
  const description = escape(property.description[0]);
  let html = shell
    .replace('<body>', '<body data-property="' + property.id + '">')
    .replace(/<title>[^<]*<\/title>/, '<title>' + title + '</title>')
    .replace(/<meta name="description" content="[^"]*">/, '<meta name="description" content="' + description + '">')
    .replace('<!-- ============ PAGE CONTENT (rendered by js/app.js) ============ -->', '<!-- Standalone property page. Rebuild with node build-pages.cjs. -->')
    .replace('<main id="app" tabindex="-1"></main>', '<main id="app" tabindex="-1">' + content + '</main>')
    .replace(/(href|src)="([^"]+)"/g, (match, attribute, value) => {
      if (value.startsWith('#/')) return attribute + '="../../index.html' + value + '"';
      if (/^(assets|css|js|objektai)\//.test(value)) return attribute + '="../../' + value + '"';
      return match;
    });
  const directory = path.join(root, 'objektai', property.id);
  fs.mkdirSync(directory, {recursive: true});
  fs.writeFileSync(path.join(directory, 'index.html'), html);
}
console.log('Generated ' + properties.length + ' standalone property pages.');
