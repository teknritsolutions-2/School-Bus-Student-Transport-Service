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

test('priority pages keep their required editorial section depth', () => {
  const minimums = { 'index.html':11, 'home2.html':9, 'how-it-works.html':8, 'subscription-plans.html':8, 'services.html':8, 'routes.html':9, 'safety-features.html':9, 'about.html':8, 'contact.html':6 };
  for (const [file,minimum] of Object.entries(minimums)) {
    const html = readFileSync(join(pagesDir,file),'utf8');
    assert.ok((html.match(/<section\b/gi)||[]).length >= minimum, `${file} needs at least ${minimum} sections`);
  }
});

test('retired brand and placeholder deployment origin are absent', () => {
  const files = [join(root,'index.html'),join(root,'404.html'),join(root,'robots.txt'),join(root,'sitemap.xml'),join(root,'README.md')];
  expectedPages.forEach(file=>files.push(join(pagesDir,file)));
  for (const file of files) {
    const value=readFileSync(file,'utf8');
    assert.doesNotMatch(value,/waybell/i,`retired brand in ${file}`);
    assert.doesNotMatch(value,/your-domain\.example/i,`placeholder origin in ${file}`);
  }
});

test('shared navigation exposes the required customer paths and direct dashboard link', () => {
  const main=readFileSync(join(root,'assets/js/main.js'),'utf8');
  for (const label of ['Home 1','Home 2','Services','Routes','Safety Features','How It Works','Subscription Plans','About','Contact','Dashboard']) assert.match(main,new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
  assert.match(main,/href="\$\{pageUrl\('parent-dashboard\.html'\)\}"/);
  assert.doesNotMatch(main,/register\.html'\)\}">Dashboard/);
  assert.match(main,/pointerenter/);
  assert.match(main,/data-drawer[^>]+inert/);
  assert.match(main,/aria-current="page"/);
});

test('navigation has one authoritative open state and correct sticky ownership', () => {
  const css=readFileSync(join(root,'assets/css/style.css'),'utf8');
  const main=readFileSync(join(root,'assets/js/main.js'),'utf8');
  assert.match(css,/\[data-site-header\]\s*\{[^}]*position:\s*sticky/s);
  assert.match(css,/\.site-header\s*\{[^}]*position:\s*relative/s);
  assert.doesNotMatch(css,/\.nav-drop:(?:hover|focus-within)\s+\.dropdown/);
  assert.match(css,/\.nav-drop\.open\s+\.dropdown/);
  assert.match(css,/@media\s*\(max-width:\s*1100px\)/);
  assert.match(main,/\(hover:\s*hover\) and \(pointer:\s*fine\)/);
  assert.match(main,/aria-expanded/);
  assert.match(main,/Switch to light mode/);
  assert.match(main,/Switch to dark mode/);
});

test('dark surfaces and expanded editorial sections remain readable', () => {
  const css=readFileSync(join(root,'assets/css/style.css'),'utf8');
  for (const selector of ['.dark-surface .faq-item > button','.dark-surface .journey-stop h3','.hero-wide .eyebrow','.service-tile.media .eyebrow']) {
    assert.ok(css.includes(selector),`missing visibility rule for ${selector}`);
  }
  for (const file of ['index.html','home2.html','about.html','services.html','how-it-works.html']) {
    assert.match(readFileSync(join(pagesDir,file),'utf8'),/assurance-grid/,`${file} needs the expanded transport guidance section`);
  }
});

test('public pages share the central header and footer', () => {
  for (const file of expectedPages.filter(file=>file!=='parent-dashboard.html')) {
    const html=readFileSync(join(pagesDir,file),'utf8');
    assert.match(html,/data-site-header/,`${file} needs shared header`);
    assert.match(html,/data-site-footer/,`${file} needs shared footer`);
  }
});

test('brand palette, fonts, map, and honest receipt behavior are present', () => {
  const css=readFileSync(join(root,'assets/css/style.css'),'utf8');
  for (const color of ['#24557a','#17324d','#4f7892','#d7e5ed','#eff5f8','#e2a32b','#fff4d6','#faf9f7','#252625','#686b68','#dfdfdc']) assert.match(css,new RegExp(color,'i'));
  for (const color of ['#704447','#482b30','#91676a','#e7d9da','#f6eff0']) assert.doesNotMatch(css,new RegExp(color,'i'));
  assert.match(css,/family=DM\+Sans/);
  assert.match(css,/family=Outfit/);
  assert.match(css,/--font-heading:\s*"Outfit"/);
  assert.match(css,/--font-body:\s*"DM Sans"/);
  for (const breakpoint of ['1180px','820px','768px','430px','360px']) assert.match(css,new RegExp(`max-width:\\s*${breakpoint}`));
  const routes=readFileSync(join(pagesDir,'routes.html'),'utf8');
  assert.match(routes,/data-public-map/);
  for (const pageName of ['index.html','home2.html','how-it-works.html','services.html','safety-features.html','parent-dashboard.html']) {
    assert.doesNotMatch(readFileSync(join(pagesDir,pageName),'utf8'),/map-preview|route-path|map-pin/,`ornamental map remains in ${pageName}`);
  }
  const receipts=readFileSync(join(root,'assets/js/receipts.js'),'utf8');
  assert.match(receipts,/EXAMPLE RECEIPT/);
  assert.match(receipts,/no payment processed/i);
  assert.doesNotMatch(receipts,/addPayment/);
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
