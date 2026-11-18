/* Generate standalone property and privacy documents. Run: node build-pages.cjs */
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
const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
function writePage({directory, prefix, bodyAttributes, content, title, description}) {
  const html = shell
    .replace('<body>', '<body ' + bodyAttributes + '>')
    .replace(/<title>[^<]*<\/title>/, '<title>' + escape(title) + '</title>')
    .replace(/<meta name="description" content="[^"]*">/, '<meta name="description" content="' + escape(description) + '">')
    .replace('<!-- ============ PAGE CONTENT (rendered by js/app.js) ============ -->', '<!-- Standalone page. Rebuild with node build-pages.cjs. -->')
    .replace('<main id="app" tabindex="-1"></main>', '<main id="app" tabindex="-1">' + content + '</main>')
    .replace(/(href|src)="([^"]+)"/g, (match, attribute, value) => {
      if (value.startsWith('#/')) return attribute + '="' + prefix + 'index.html' + value + '"';
      if (value.startsWith('index.html#') || /^(assets|css|js|objektai|privatumo-politika)\//.test(value)) {
        return attribute + '="' + prefix + value + '"';
      }
      return match;
    });
  const output = path.join(root, directory);
  fs.mkdirSync(output, {recursive: true});
  fs.writeFileSync(path.join(output, 'index.html'), html);
}
for (const property of properties) {
  if (!/^[a-z0-9-]+$/.test(property.id)) throw new Error('Invalid property slug: ' + property.id);
  context.propertyId = property.id;
  const content = vm.runInContext('renderProperty(propertyId)', context);
  writePage({directory: path.join('objektai', property.id), prefix: '../../',
    bodyAttributes: 'data-property="' + property.id + '"', content,
    title: context.document.title, description: property.description[0]});
}
const privacyContent = vm.runInContext('renderPrivacy()', context);
writePage({directory: 'privatumo-politika', prefix: '../', bodyAttributes: 'data-page="privacy"',
  content: privacyContent, title: context.document.title,
  description: 'Solidi privatumo politika: kontaktinės užklausos, analitika, rinkodara ir jūsų duomenys.'});
console.log('Generated ' + properties.length + ' property pages and the privacy policy page.');
