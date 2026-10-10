const scriptUrl = import.meta.url;
export const siteRoot = new URL('../../', scriptUrl);
export const pageUrl = (file) => new URL(`pages/${file}`, siteRoot).href;
export const assetUrl = (path) => new URL(`assets/${path}`, siteRoot).href;

const page = document.body.dataset.page || '';
const navItems = [
  ['Home', 'index.html', ['home','home2']],
  ['Routes', 'routes.html', ['routes']],
  ['Safety', 'safety-features.html', ['safety']],
  ['Plans', 'subscription-plans.html', ['plans']],
  ['About', 'about.html', ['about']],
  ['Contact', 'contact.html', ['contact']]
];
const active = (ids) => ids.includes(page) ? ' active' : '';

function renderHeader() {
  const target = document.querySelector('[data-site-header]');
  if (!target) return;
  target.innerHTML = `
    <a class="skip-link" href="#main-content">Skip to content</a>
    <header class="site-header${page !== 'home' ? ' solid' : ''}" data-header>
      <div class="container nav-wrap">
        <a class="brand" href="${pageUrl('index.html')}" aria-label="WAYBELL home"><img src="${assetUrl('brand/logo.svg')}" alt="WAYBELL"></a>
        <nav class="desktop-nav" aria-label="Primary">
          <div class="nav-drop${active(['home','home2'])}"><button type="button" aria-haspopup="true" aria-expanded="false">Home⌄</button><div class="dropdown"><a href="${pageUrl('index.html')}" class="${page==='home'?'active':''}">Home One</a><a href="${pageUrl('home2.html')}" class="${page==='home2'?'active':''}">Home Two</a></div></div>
          <div class="nav-drop${active(['services','how','faq'])}"><button type="button" aria-haspopup="true" aria-expanded="false">Services⌄</button><div class="dropdown"><a href="${pageUrl('services.html')}">Our Services</a><a href="${pageUrl('how-it-works.html')}">How It Works</a><a href="${pageUrl('faq.html')}">FAQ</a></div></div>
          ${navItems.slice(1).map(([label,file,ids])=>`<a class="nav-link${active(ids)}" href="${pageUrl(file)}">${label}</a>`).join('')}
        </nav>
        <div class="nav-tools">
          <button class="icon-btn" type="button" data-theme-toggle aria-label="Switch color theme">◐</button>
          <button class="icon-btn" type="button" data-dir-toggle aria-label="Switch text direction">↔</button>
          <a class="btn btn-sm btn-secondary portal-button" href="${pageUrl('login.html')}">Parent Portal</a>
          <button class="icon-btn menu-btn" type="button" data-drawer-open aria-label="Open menu" aria-expanded="false">☰</button>
        </div>
      </div>
    </header>
    <div class="drawer-scrim" data-drawer-scrim></div>
    <aside class="mobile-drawer" data-drawer aria-hidden="true" aria-label="Mobile navigation">
      <div class="mobile-drawer-head"><img src="${assetUrl('brand/logo.svg')}" alt="WAYBELL" width="150"><button class="icon-btn" type="button" data-drawer-close aria-label="Close menu">×</button></div>
      <nav class="mobile-links">
        <a href="${pageUrl('index.html')}">Home One</a><a href="${pageUrl('home2.html')}">Home Two</a><a href="${pageUrl('services.html')}">Services</a><a href="${pageUrl('routes.html')}">Routes</a><a href="${pageUrl('safety-features.html')}">Safety</a><a href="${pageUrl('subscription-plans.html')}">Plans</a><a href="${pageUrl('how-it-works.html')}">How It Works</a><a href="${pageUrl('about.html')}">About</a><a href="${pageUrl('faq.html')}">FAQ</a><a href="${pageUrl('contact.html')}">Contact</a><a href="${pageUrl('login.html')}">Parent Portal</a>
      </nav>
    </aside>`;
}

function renderFooter() {
  const target = document.querySelector('[data-site-footer]');
  if (!target) return;
  target.innerHTML = `
    <section class="cta-band"><div class="container split"><div><span class="eyebrow">Ready for calmer school runs?</span><h2>Find a route that fits your family.</h2></div><a class="btn" href="${pageUrl('routes.html')}">Explore routes</a></div></section>
    <footer class="site-footer"><div class="container footer-grid">
      <div><img class="footer-logo" src="${assetUrl('brand/logo-white.svg')}" alt="WAYBELL"><p>Thoughtful school transport with clear route information, safety-first operations, and a practical parent portal.</p><div class="socials" aria-label="Social links"><a href="#" aria-label="Facebook">f</a><a href="#" aria-label="Instagram">◎</a><a href="#" aria-label="LinkedIn">in</a></div></div>
      <div><h3>Explore</h3><a href="${pageUrl('about.html')}">About</a><a href="${pageUrl('services.html')}">Services</a><a href="${pageUrl('routes.html')}">Routes</a><a href="${pageUrl('safety-features.html')}">Safety</a></div>
      <div><h3>Parents</h3><a href="${pageUrl('how-it-works.html')}">How it works</a><a href="${pageUrl('subscription-plans.html')}">Plans</a><a href="${pageUrl('faq.html')}">FAQ</a><a href="${pageUrl('login.html')}">Portal</a></div>
      <div><h3>Support</h3><a href="${pageUrl('contact.html')}">Contact</a><a href="${pageUrl('privacy.html')}">Privacy</a><a href="${pageUrl('terms.html')}">Terms</a><a href="${pageUrl('coming-soon.html')}">Coming soon</a></div>
    </div><div class="container footer-bottom"><span>© <span data-year></span> WAYBELL. Demo content for template use.</span><span>Designed for dependable student journeys.</span></div></footer>
    <button class="back-top" data-back-top type="button" aria-label="Back to top">↑</button>`;
}

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem('waybell:theme', theme);
}
function setDirection(dir) {
  document.documentElement.dir = dir;
  localStorage.setItem('waybell:dir', dir);
}

function initShell() {
  renderHeader(); renderFooter();
  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
  document.querySelectorAll('[data-theme-toggle]').forEach(btn => btn.addEventListener('click', () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark')));
  document.querySelectorAll('[data-dir-toggle]').forEach(btn => btn.addEventListener('click', () => setDirection(document.documentElement.dir === 'rtl' ? 'ltr' : 'rtl')));
  const header = document.querySelector('[data-header]');
  const top = document.querySelector('[data-back-top]');
  const onScroll = () => { header?.classList.toggle('scrolled', scrollY > 24); top?.classList.toggle('visible', scrollY > 500); };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  top?.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));
  const drawer = document.querySelector('[data-drawer]'); const scrim = document.querySelector('[data-drawer-scrim]'); const opener = document.querySelector('[data-drawer-open]');
  const close = () => { drawer?.classList.remove('open'); scrim?.classList.remove('open'); document.body.classList.remove('nav-open'); drawer?.setAttribute('aria-hidden','true'); opener?.setAttribute('aria-expanded','false'); opener?.focus(); };
  const open = () => { drawer?.classList.add('open'); scrim?.classList.add('open'); document.body.classList.add('nav-open'); drawer?.setAttribute('aria-hidden','false'); opener?.setAttribute('aria-expanded','true'); drawer?.querySelector('button')?.focus(); };
  opener?.addEventListener('click', open); document.querySelector('[data-drawer-close]')?.addEventListener('click', close); scrim?.addEventListener('click', close);
  addEventListener('keydown', e => {
    if (!drawer?.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'Tab') {
      const focusable = [...drawer.querySelectorAll('a,button,[tabindex]:not([tabindex="-1"])')];
      const first = focusable[0]; const last = focusable.at(-1);
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
    }
  });
  document.querySelectorAll('.nav-drop > button').forEach(btn => btn.addEventListener('click', () => { const drop = btn.parentElement; const opened = drop.classList.toggle('open'); btn.setAttribute('aria-expanded', String(opened)); }));
  document.querySelectorAll('.faq-item button').forEach(btn => btn.addEventListener('click', () => { const answer = btn.nextElementSibling; const openNow = btn.getAttribute('aria-expanded') === 'true'; btn.setAttribute('aria-expanded', String(!openNow)); answer.hidden = openNow; }));
}

function injectSeo() {
  if (!document.querySelector('link[rel="canonical"]')) {
    const link = document.createElement('link'); link.rel = 'canonical'; link.href = location.href.split(/[?#]/)[0]; document.head.append(link);
  }
  if (!document.querySelector('script[type="application/ld+json"]')) {
    const node = document.createElement('script'); node.type = 'application/ld+json'; node.textContent = JSON.stringify({ '@context':'https://schema.org', '@type':'WebSite', name:'WAYBELL', url:siteRoot.href }); document.head.append(node);
  }
}

initShell(); injectSeo();
