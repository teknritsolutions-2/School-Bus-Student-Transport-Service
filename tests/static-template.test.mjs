import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const pagesDir = join(root, 'pages');
const expectedPages = ['index','home2','about','services','routes','safety-features','subscription-plans','how-it-works','contact','faq','login','register','parent-dashboard','privacy','terms','coming-soon','404'].map(name=>`${name}.html`);
const expectedDocs = ['INSTALLATION.md','DEPLOYMENT.md','CUSTOMIZATION.md','CONTENT-GUIDE.md','FORM-INTEGRATION.md','ATTRIBUTION.md','REQUIREMENTS-CHECKLIST.md'];

test('required template files exist', () => {
  for (const file of expectedPages) assert.ok(existsSync(join(pagesDir,file)), `missing pages/${file}`);
  for (const file of expectedDocs) assert.ok(existsSync(join(root,'documentation',file)), `missing documentation/${file}`);
  for (const file of ['index.html','404.html','robots.txt','sitemap.xml','README.md','assets/css/style.css','assets/css/dark-mode.css','assets/css/rtl.css','assets/js/main.js','assets/js/dashboard.js','assets/js/tracking.js','assets/js/data.js','assets/js/forms.js','assets/js/receipts.js']) assert.ok(existsSync(join(root,file)), `missing ${file}`);
});

test('content pages have metadata, ordered styles, and exactly one H1', () => {
  for (const file of expectedPages) {
    const html = readFileSync(join(pagesDir,file),'utf8');
    assert.match(html, /<title>[^<]+<\/title>/i, `${file} needs title`);
    assert.match(html, /<meta name="description"/i, `${file} needs description`);
    assert.equal((html.match(/<h1\b/gi)||[]).length, 1, `${file} must have one H1`);
    const base = html.indexOf('../assets/css/style.css'); const dark = html.indexOf('../assets/css/dark-mode.css'); const rtl = html.indexOf('../assets/css/rtl.css');
    assert.ok(base > -1 && dark > base && rtl > dark, `${file} stylesheet order`);
  }
});

test('local page links and assets resolve', () => {
  for (const file of expectedPages) {
    const full = join(pagesDir,file); const html = readFileSync(full,'utf8');
    for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      const value = match[1];
      if (/^(?:https?:|mailto:|tel:|#|data:)/.test(value)) continue;
      const clean = value.split(/[?#]/)[0]; if (!clean) continue;
      assert.ok(existsSync(resolve(dirname(full),clean)), `${file}: broken ${value}`);
    }
  }
});

test('dashboard includes all nine views without duplicate ids', () => {
  const html = readFileSync(join(pagesDir,'parent-dashboard.html'),'utf8');
  for (const view of ['overview','track','students','subscription','receipts','logs','notifications','settings','help']) assert.match(html,new RegExp(`data-view="${view}"`));
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(match=>match[1]);
  assert.equal(ids.length,new Set(ids).size,'duplicate dashboard ids');
});

test('no framework references exist in deliverable source', () => {
  const sourceDirs = ['assets','pages','documentation'];
  const files = [];
  const walk = dir => readdirSync(dir).forEach(name => { const path=join(dir,name); if(statSync(path).isDirectory()) walk(path); else files.push(path); });
  sourceDirs.forEach(dir=>walk(join(root,dir)));
  for (const file of files.filter(path=>/\.(?:html|css|js|md)$/.test(path))) {
    const value=readFileSync(file,'utf8');
    assert.doesNotMatch(value,/sveltekit|vite\.config|\.svelte\b/i,`framework reference in ${file}`);
  }
});
