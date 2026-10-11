import { BRAND } from './data.js';

const scriptUrl = import.meta.url;
export const siteRoot = new URL('../../', scriptUrl);
export const pageUrl = file => new URL(`pages/${file}`, siteRoot).href;
export const assetUrl = path => new URL(`assets/${path}`, siteRoot).href;

const page = document.body.dataset.page || '';

const icons = {
  chevron: '<path d="m7 10 5 5 5-5"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M20.2 15.3A8.4 8.4 0 0 1 8.7 3.8 8.5 8.5 0 1 0 20.2 15.3Z"/>',
  direction: '<path d="M4 7h13M14 4l3 3-3 3M20 17H7M10 14l-3 3 3 3"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  up: '<path d="m6 14 6-6 6 6"/>'
};

const icon = name => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${icons[name]}</svg>`;
const isActive = ids => ids.includes(page);
const activeClass = ids => isActive(ids) ? ' active' : '';
const current = ids => isActive(ids) ? ' aria-current="page"' : '';

function brandMarkup(white = false) {
  if (white) return `<img src="${assetUrl('brand/logo-white.svg')}" alt="${BRAND.name}">`;
  return `<img class="brand-logo brand-logo-light" src="${assetUrl('brand/logo.svg')}" alt="${BRAND.name}"><img class="brand-logo brand-logo-dark" src="${assetUrl('brand/logo-white.svg')}" alt="" aria-hidden="true">`;
}

function navLink(label, file, ids) {
  return `<a class="nav-link${activeClass(ids)}" href="${pageUrl(file)}"${current(ids)}>${label}</a>`;
}

function dropdownLink(label, file, id) {
  return `<a class="${page === id ? 'active' : ''}" href="${pageUrl(file)}"${page === id ? ' aria-current="page"' : ''}>${label}</a>`;
}

function renderHeader() {
  const target = document.querySelector('[data-site-header]');
  if (!target) return;
  if (['login', 'signin', 'register'].includes(page)) {
    target.style.display = 'none';
    return;
  }

  target.innerHTML = `
    <a class="skip-link" href="#main-content">Skip to content</a>
    <header class="site-header" data-header>
      <div class="container nav-wrap">
        <a class="brand" href="${pageUrl('index.html')}" aria-label="${BRAND.name} home">${brandMarkup()}</a>
        <nav class="desktop-nav" aria-label="Primary navigation">
          <div class="nav-drop${activeClass(['home', 'home2'])}">
            <button type="button" aria-haspopup="true" aria-expanded="false" aria-controls="home-navigation">Home ${icon('chevron')}</button>
            <div class="dropdown" id="home-navigation">
              ${dropdownLink('Home 1', 'index.html', 'home')}
              ${dropdownLink('Home 2', 'home2.html', 'home2')}
            </div>
          </div>
          ${navLink('About', 'about.html', ['about'])}
          <div class="nav-drop${activeClass(['services', 'routes', 'how'])}">
            <button type="button" aria-haspopup="true" aria-expanded="false" aria-controls="services-navigation">Services ${icon('chevron')}</button>
            <div class="dropdown" id="services-navigation">
              ${dropdownLink('Services', 'services.html', 'services')}
              ${dropdownLink('Routes', 'routes.html', 'routes')}
              ${dropdownLink('How It Works', 'how-it-works.html', 'how')}
            </div>
          </div>
          ${navLink('Safety Features', 'safety-features.html', ['safety'])}
          ${navLink('Subscription Plans', 'subscription-plans.html', ['plans'])}
          ${navLink('Contact', 'contact.html', ['contact'])}
          ${navLink('Dashboard', 'parent-dashboard.html', ['dashboard'])}
        </nav>
        <div class="nav-tools">
          <button class="icon-btn" type="button" data-theme-toggle aria-label="Switch to dark mode">${icon('moon')}</button>
          <button class="icon-btn dir-toggle-btn" type="button" data-dir-toggle aria-label="Switch to right-to-left text"><span class="dir-badge">RTL</span></button>
          <a class="btn btn-sm login-btn" href="${pageUrl('login.html')}">Log In</a>
          <button class="icon-btn menu-btn" type="button" data-drawer-open aria-label="Open menu" aria-expanded="false">${icon('menu')}</button>
        </div>
      </div>
    </header>
    <div class="drawer-scrim" data-drawer-scrim hidden></div>
    <aside class="mobile-drawer" data-drawer aria-hidden="true" aria-label="Mobile navigation" inert>
      <div class="mobile-drawer-head">
        <a class="brand" href="${pageUrl('index.html')}">${brandMarkup()}</a>
        <button class="icon-btn" type="button" data-drawer-close aria-label="Close menu">${icon('close')}</button>
      </div>
      <nav class="mobile-links">
        ${dropdownLink('Home 1', 'index.html', 'home')}
        ${dropdownLink('Home 2', 'home2.html', 'home2')}
        ${dropdownLink('About', 'about.html', 'about')}
        ${dropdownLink('Services', 'services.html', 'services')}
        ${dropdownLink('Routes', 'routes.html', 'routes')}
        ${dropdownLink('How It Works', 'how-it-works.html', 'how')}
        ${dropdownLink('Safety Features', 'safety-features.html', 'safety')}
        ${dropdownLink('Subscription Plans', 'subscription-plans.html', 'plans')}
        ${dropdownLink('Contact', 'contact.html', 'contact')}
        <a href="${pageUrl('parent-dashboard.html')}">Dashboard</a>
      </nav>
      <div class="mobile-drawer-footer">
        <a class="btn mobile-drawer-login" href="${pageUrl('login.html')}">Log In</a>
        <div class="mobile-controls">
          <button class="icon-btn" type="button" data-theme-toggle aria-label="Switch to dark mode">${icon('moon')}</button>
          <button class="icon-btn dir-toggle-btn" type="button" data-dir-toggle aria-label="Switch to right-to-left text"><span class="dir-badge">RTL</span></button>
        </div>
      </div>
    </aside>`;
}

function renderFooter() {
  const target = document.querySelector('[data-site-footer]');
  if (!target) return;
  if (['login', 'signin', 'register'].includes(page)) {
    target.style.display = 'none';
    return;
  }

  target.innerHTML = `
    <footer class="site-footer">
      <div class="container footer-main">
        <div class="footer-brand">${brandMarkup(true)}<p>Clear route information, practical school-day planning, and useful parent tools in one connected service.</p></div>
        <div><h3>Explore</h3><a href="${pageUrl('index.html')}">Home 1</a><a href="${pageUrl('home2.html')}">Home 2</a><a href="${pageUrl('about.html')}">About</a><a href="${pageUrl('contact.html')}">Contact</a></div>
        <div><h3>Transport</h3><a href="${pageUrl('services.html')}">Services</a><a href="${pageUrl('routes.html')}">Routes</a><a href="${pageUrl('safety-features.html')}">Safety Features</a><a href="${pageUrl('how-it-works.html')}">How It Works</a></div>
        <div><h3>Parents</h3><a href="${pageUrl('parent-dashboard.html')}">Dashboard</a><a href="${pageUrl('subscription-plans.html')}">Subscription Plans</a><a href="${pageUrl('faq.html')}">FAQ</a><a href="${pageUrl('login.html')}">Login</a><a href="${pageUrl('signin.html')}">Sign In</a></div>
        <div><h3>Legal</h3><a href="${pageUrl('privacy.html')}">Privacy</a><a href="${pageUrl('terms.html')}">Terms</a></div>
      </div>
      <div class="container footer-bottom"><span>© <span data-year></span> ${BRAND.name}</span><span>${BRAND.fullName}</span></div>
    </footer>
    <button class="back-top" data-back-top type="button" aria-label="Back to top">${icon('up')}</button>`;
}

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem('schoolTransport:theme', theme);
  syncThemeControls();
}

function setDirection(direction) {
  document.documentElement.dir = direction;
  localStorage.setItem('schoolTransport:dir', direction);
  syncDirectionControls();
}

function syncThemeControls() {
  const isDark = document.documentElement.dataset.theme === 'dark';
  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';
  const actionIcon = isDark ? 'sun' : 'moon';
  document.querySelectorAll('[data-theme-toggle]').forEach(button => {
    button.setAttribute('aria-label', label);
    button.title = label;
    button.innerHTML = icon(actionIcon);
  });
}

function syncDirectionControls() {
  const isRtl = document.documentElement.dir === 'rtl';
  const label = isRtl ? 'Switch to left-to-right text' : 'Switch to right-to-left text';
  const badgeText = isRtl ? 'LTR' : 'RTL';
  document.querySelectorAll('[data-dir-toggle]').forEach(button => {
    button.setAttribute('aria-label', label);
    button.title = label;
    button.innerHTML = `<span class="dir-badge">${badgeText}</span>`;
  });
}

function initDropdowns() {
  const drops = [...document.querySelectorAll('.nav-drop')];
  const hoverInput = matchMedia('(hover: hover) and (pointer: fine)');

  const closeDrop = (drop, restoreFocus = false) => {
    drop.classList.remove('open');
    delete drop.dataset.pinned;
    const trigger = drop.querySelector(':scope > button');
    trigger?.setAttribute('aria-expanded', 'false');
    if (restoreFocus) trigger?.focus();
  };

  const closeDrops = (except, restoreFocus = false) => {
    drops.forEach(drop => {
      if (drop !== except) closeDrop(drop, restoreFocus);
    });
  };

  const openDrop = (drop, pinned = false) => {
    closeDrops(drop);
    drop.classList.add('open');
    if (pinned) drop.dataset.pinned = 'true';
    drop.querySelector(':scope > button')?.setAttribute('aria-expanded', 'true');
  };

  drops.forEach(drop => {
    const trigger = drop.querySelector(':scope > button');
    trigger.addEventListener('click', event => {
      event.stopPropagation();
      if (drop.classList.contains('open') && drop.dataset.pinned) {
        closeDrop(drop);
      } else {
        openDrop(drop, true);
      }
    });
    drop.addEventListener('pointerenter', event => {
      if (hoverInput.matches && event.pointerType !== 'touch') openDrop(drop, Boolean(drop.dataset.pinned));
    });
    drop.addEventListener('pointerleave', event => {
      if (hoverInput.matches && event.pointerType !== 'touch' && !drop.dataset.pinned && !drop.contains(document.activeElement)) closeDrop(drop);
    });
    drop.addEventListener('focusin', () => {
      if (!drop.classList.contains('open')) openDrop(drop);
    });
    drop.addEventListener('focusout', () => {
      requestAnimationFrame(() => {
        if (!drop.dataset.pinned && !drop.contains(document.activeElement)) closeDrop(drop);
      });
    });
  });

  document.addEventListener('click', () => closeDrops());
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    const open = drops.find(drop => drop.classList.contains('open'));
    if (open) closeDrop(open, true);
  });
}

function initDrawer() {
  const drawer = document.querySelector('[data-drawer]');
  const scrim = document.querySelector('[data-drawer-scrim]');
  const opener = document.querySelector('[data-drawer-open]');
  const closeButton = document.querySelector('[data-drawer-close]');
  if (!drawer || !scrim || !opener) return;
  let scrimHideTimer;

  const close = (restoreFocus = true) => {
    clearTimeout(scrimHideTimer);
    drawer.classList.remove('open');
    scrim.classList.remove('open');
    document.body.classList.remove('nav-open');
    drawer.setAttribute('aria-hidden', 'true');
    drawer.inert = true;
    opener.setAttribute('aria-expanded', 'false');
    scrimHideTimer = setTimeout(() => { scrim.hidden = true; }, 240);
    if (restoreFocus) opener.focus();
  };

  const open = () => {
    clearTimeout(scrimHideTimer);
    scrim.hidden = false;
    requestAnimationFrame(() => {
      drawer.classList.add('open');
      scrim.classList.add('open');
    });
    document.body.classList.add('nav-open');
    drawer.removeAttribute('inert');
    drawer.setAttribute('aria-hidden', 'false');
    opener.setAttribute('aria-expanded', 'true');
    closeButton?.focus();
  };

  opener.addEventListener('click', open);
  closeButton?.addEventListener('click', () => close());
  scrim.addEventListener('click', () => close());
  drawer.querySelectorAll('a').forEach(link => link.addEventListener('click', () => close(false)));

  document.addEventListener('keydown', event => {
    if (!drawer.classList.contains('open')) return;
    if (event.key === 'Escape') {
      close();
      return;
    }
    if (event.key !== 'Tab') return;
    const focusable = [...drawer.querySelectorAll('a, button:not([disabled])')];
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  matchMedia('(min-width: 1101px)').addEventListener('change', event => {
    if (event.matches && drawer.classList.contains('open')) close(false);
  });
}

function initInteractions() {
  document.querySelectorAll('[data-year]').forEach(element => {
    element.textContent = new Date().getFullYear();
  });
  document.querySelectorAll('[data-theme-toggle]').forEach(button => {
    button.addEventListener('click', () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'));
  });
  document.querySelectorAll('[data-dir-toggle]').forEach(button => {
    button.addEventListener('click', () => setDirection(document.documentElement.dir === 'rtl' ? 'ltr' : 'rtl'));
  });
  syncThemeControls();
  syncDirectionControls();

  const header = document.querySelector('[data-header]');
  const backTop = document.querySelector('[data-back-top]');
  const onScroll = () => {
    header?.classList.toggle('scrolled', scrollY > 8);
    backTop?.classList.toggle('visible', scrollY > 500);
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  backTop?.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

  initDropdowns();
  initDrawer();

  document.querySelectorAll('.faq-item > button').forEach(button => {
    button.addEventListener('click', () => {
      const answer = button.nextElementSibling;
      const isOpen = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!isOpen));
      answer.hidden = isOpen;
    });
  });

  document.querySelectorAll('[data-tab-group]').forEach(group => {
    group.querySelectorAll('[data-tab]').forEach(button => {
      button.addEventListener('click', () => {
        group.querySelectorAll('[data-tab]').forEach(item => {
          const selected = item === button;
          item.classList.toggle('active', selected);
          item.setAttribute('aria-selected', String(selected));
        });
        group.querySelectorAll('[data-tab-panel]').forEach(panel => {
          panel.hidden = panel.dataset.tabPanel !== button.dataset.tab;
        });
      });
    });
  });
}

function injectSeo() {
  if (!document.querySelector('link[rel="canonical"]')) {
    const link = document.createElement('link');
    link.rel = 'canonical';
    link.href = location.href.split(/[?#]/)[0];
    document.head.append(link);
  }
  if (!document.querySelector('script[type="application/ld+json"]')) {
    const node = document.createElement('script');
    node.type = 'application/ld+json';
    node.textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebSite', name: BRAND.fullName, url: siteRoot.href });
    document.head.append(node);
  }
}

renderHeader();
renderFooter();
initInteractions();
injectSeo();
