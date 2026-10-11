// KinderRide Student Transit Service - Main JavaScript
export const BRAND = {
  name: 'KINDERRIDE',
  fullName: 'KinderRide Student Transit Service',
  shortDescription: 'Safe, connected school journeys for families.'
};

export const routes = [
  {
    id: 'ST-12',
    name: 'Cedar Loop',
    area: 'Lakeside & Cedar Park',
    school: 'Northfield Academy',
    duration: 42,
    journeys: ['Morning pickup', 'Afternoon return'],
    stops: [
      { name: 'Lakeside Gate', lat: 17.4483, lng: 78.3915, pickup: '7:05 AM', drop: '4:18 PM' },
      { name: 'Cedar Park', lat: 17.4448, lng: 78.3994, pickup: '7:14 AM', drop: '4:09 PM' },
      { name: 'Orchard Junction', lat: 17.4398, lng: 78.4078, pickup: '7:24 AM', drop: '3:59 PM' },
      { name: 'Northfield Academy', lat: 17.4328, lng: 78.4168, pickup: '7:38 AM', drop: '3:45 PM', school: true }
    ]
  },
  {
    id: 'ST-24',
    name: 'Meadow Line',
    area: 'Meadow View & Hillcrest',
    school: 'Riverside Public School',
    duration: 38,
    journeys: ['Morning pickup', 'Afternoon return'],
    stops: [
      { name: 'Meadow View', lat: 17.4204, lng: 78.4358, pickup: '7:20 AM', drop: '4:25 PM' },
      { name: 'Hillcrest Circle', lat: 17.4265, lng: 78.4425, pickup: '7:29 AM', drop: '4:16 PM' },
      { name: 'Library Corner', lat: 17.4332, lng: 78.4484, pickup: '7:38 AM', drop: '4:07 PM' },
      { name: 'Riverside School', lat: 17.4412, lng: 78.4548, pickup: '7:52 AM', drop: '3:53 PM', school: true }
    ]
  }
];

export const students = [
  { id: 'anaya', name: 'Anaya Rao', initials: 'AR', grade: 'Grade 5', routeId: 'ST-12', stop: 'Cedar Park' },
  { id: 'vihaan', name: 'Vihaan Rao', initials: 'VR', grade: 'Grade 2', routeId: 'ST-24', stop: 'Meadow View' }
];

export const plans = [
  { id: 'single', name: 'Single Journey', price: 1850, note: 'Morning or afternoon transport for one student' },
  { id: 'daily', name: 'Daily Return', price: 2950, note: 'Morning pickup and afternoon return for one student' },
  { id: 'family', name: 'Family Return', price: 4950, note: 'Daily return transport for two students' }
];

export const initialLogs = [
  { date: '09 Oct 2026', student: 'Anaya Rao', route: 'ST-12', event: 'Alighted at Cedar Park', time: '4:09 PM', type: 'alighting' },
  { date: '09 Oct 2026', student: 'Vihaan Rao', route: 'ST-24', event: 'School arrival preview', time: '7:52 AM', type: 'arrival' },
  { date: '08 Oct 2026', student: 'Anaya Rao', route: 'ST-12', event: 'Boarded at Cedar Park', time: '7:14 AM', type: 'boarding' }
];

export const initialNotifications = [
  { id: 1, title: 'School arrival preview', body: 'ST-12 reached Northfield Academy in the route playback.', time: 'Today, 7:38 AM', unread: true },
  { id: 2, title: 'Timing notice', body: 'ST-24 is shown five minutes earlier in tomorrow’s illustrative schedule.', time: 'Yesterday, 6:20 PM', unread: true },
  { id: 3, title: 'Example receipt available', body: 'A sample Daily Return receipt can be downloaded from Receipts.', time: '01 Oct, 10:15 AM', unread: false }
];

export const money = amount => `₹${Number(amount).toLocaleString('en-IN')}`;

const prefix = 'schoolTransport:';
export function storeGet(key, fallback) {
  try {
    const current = localStorage.getItem(prefix + key);
    return current !== null ? JSON.parse(current) : fallback;
  } catch {
    return fallback;
  }
}

export function storeSet(key, value) {
  localStorage.setItem(prefix + key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent('schooltransport:state', { detail: { key, value } }));
}

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
const activeClass = ids => (isActive(ids) ? ' active' : '');
const current = ids => (isActive(ids) ? ' aria-current="page"' : '');

function brandMarkup(white = false) {
  if (white) return `<img src="${assetUrl('images/brand/logo-white.svg')}" alt="${BRAND.name}">`;
  return `<img class="brand-logo brand-logo-light" src="${assetUrl('images/brand/logo.svg')}" alt="${BRAND.name}"><img class="brand-logo brand-logo-dark" src="${assetUrl('images/brand/logo-white.svg')}" alt="" aria-hidden="true">`;
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
          ${navLink('Blog', 'blog.html', ['blog'])}
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
        ${dropdownLink('Blog', 'blog.html', 'blog')}
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
        <div><h3>Explore</h3><a href="${pageUrl('index.html')}">Home 1</a><a href="${pageUrl('home2.html')}">Home 2</a><a href="${pageUrl('about.html')}">About</a><a href="${pageUrl('blog.html')}">Blog</a><a href="${pageUrl('contact.html')}">Contact</a></div>
        <div><h3>Transport</h3><a href="${pageUrl('services.html')}">Services</a><a href="${pageUrl('routes.html')}">Routes</a><a href="${pageUrl('safety-features.html')}">Safety Features</a><a href="${pageUrl('how-it-works.html')}">How It Works</a></div>
        <div><h3>Parents</h3><a href="${pageUrl('parent-dashboard.html')}">Dashboard</a><a href="${pageUrl('subscription-plans.html')}">Subscription Plans</a><a href="${pageUrl('faq.html')}">FAQ</a><a href="${pageUrl('login.html')}">Login</a></div>
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
  document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
    btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    btn.innerHTML = icon(isDark ? 'sun' : 'moon');
  });
}

function syncDirectionControls() {
  const isRtl = document.documentElement.dir === 'rtl';
  document.querySelectorAll('[data-dir-toggle]').forEach(btn => {
    btn.setAttribute('aria-label', isRtl ? 'Switch to left-to-right text' : 'Switch to right-to-left text');
    const badge = btn.querySelector('.dir-badge');
    if (badge) {
      badge.textContent = isRtl ? 'LTR' : 'RTL';
    } else {
      btn.innerHTML = `<span class="dir-badge">${isRtl ? 'LTR' : 'RTL'}</span>`;
    }
  });
}

function initThemeAndDirection() {
  const storedTheme = localStorage.getItem('schoolTransport:theme');
  const storedDir = localStorage.getItem('schoolTransport:dir');
  if (storedTheme) document.documentElement.dataset.theme = storedTheme;
  if (storedDir) document.documentElement.dir = storedDir;

  document.addEventListener('click', event => {
    const themeBtn = event.target.closest('[data-theme-toggle]');
    if (themeBtn) {
      const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      setTheme(nextTheme);
    }
    const dirBtn = event.target.closest('[data-dir-toggle]');
    if (dirBtn) {
      const nextDir = document.documentElement.dir === 'rtl' ? 'ltr' : 'rtl';
      setDirection(nextDir);
    }
  });

  syncThemeControls();
  syncDirectionControls();
}

function initDrawer() {
  const drawer = document.querySelector('[data-drawer]');
  const scrim = document.querySelector('[data-drawer-scrim]');
  const openBtn = document.querySelector('[data-drawer-open]');
  const closeBtn = document.querySelector('[data-drawer-close]');
  if (!drawer || !scrim) return;

  const closeDrawer = () => {
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    drawer.setAttribute('inert', '');
    scrim.hidden = true;
    document.body.classList.remove('drawer-open');
    openBtn?.setAttribute('aria-expanded', 'false');
    openBtn?.focus();
  };

  const openDrawer = () => {
    drawer.classList.add('open');
    drawer.removeAttribute('aria-hidden');
    drawer.removeAttribute('inert');
    scrim.hidden = false;
    document.body.classList.add('drawer-open');
    openBtn?.setAttribute('aria-expanded', 'true');
    closeBtn?.focus();
  };

  openBtn?.addEventListener('click', openDrawer);
  closeBtn?.addEventListener('click', closeDrawer);
  scrim.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) closeDrawer();
  });
}

function initDropdowns() {
  document.querySelectorAll('.nav-drop').forEach(drop => {
    const btn = drop.querySelector('button');
    btn?.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      document.querySelectorAll('.nav-drop button').forEach(b => b.setAttribute('aria-expanded', 'false'));
      btn.setAttribute('aria-expanded', String(!expanded));
    });
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('.nav-drop')) {
      document.querySelectorAll('.nav-drop button').forEach(b => b.setAttribute('aria-expanded', 'false'));
    }
  });
}

function initForms() {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  function validate(form) {
    let okay = true;
    form.querySelectorAll('[required]').forEach(input => {
      const error = input.closest('.field')?.querySelector('.field-error');
      const value = input.value.trim();
      const message = !value ? 'This field is required.' : input.type === 'email' && !emailPattern.test(value) ? 'Enter a valid email address.' : '';
      input.setAttribute('aria-invalid', String(Boolean(message)));
      if (error) error.textContent = message;
      if (message) okay = false;
    });
    return okay;
  }

  document.querySelectorAll('form[data-local-form]').forEach(form =>
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!validate(form)) return;
      const status = form.querySelector('.form-status');
      if (status) status.textContent = form.dataset.success || 'Your details are ready. Connect a form service to send this request.';
      form.reset();
    })
  );

  document.querySelectorAll('[data-route-finder]').forEach(form =>
    form.addEventListener('submit', event => {
      event.preventDefault();
      const area = form.elements.area?.value;
      const school = form.elements.school?.value;
      const type = form.elements.journey?.value;
      const match = routes.find(route => (!area || route.area === area) && (!school || route.school === school)) || routes[0];
      const result = form.querySelector('[data-route-result]');
      result.innerHTML = `<strong>${match.id} · ${match.name}</strong><br>${match.area} to ${match.school}<br><span class="muted">${type || 'Morning pickup'} · approximately ${match.duration} minutes · ${match.stops.length} stops</span>`;
      result.hidden = false;
    })
  );

  document.querySelector('[data-cost-calculator]')?.addEventListener('input', event => {
    const form = event.currentTarget;
    const plan = plans.find(item => item.id === form.elements.plan.value) || plans[1];
    const studentsCount = Math.max(1, Number(form.elements.students.value) || 1);
    const months = Math.max(1, Number(form.elements.months.value) || 1);
    const base = plan.id === 'family' ? plan.price : plan.price * studentsCount;
    form.querySelector('[data-calc-total]').textContent = money(base * months);
    form.querySelector('[data-calc-note]').textContent = `${plan.name} · ${studentsCount} student${studentsCount > 1 ? 's' : ''} · ${months} month${months > 1 ? 's' : ''}`;
  });

  const search = document.querySelector('[data-faq-search]');
  const filters = [...document.querySelectorAll('[data-faq-filter]')];
  function filterFaq() {
    if (!search) return;
    const term = search.value.toLowerCase();
    const category = document.querySelector('[data-faq-filter].active')?.dataset.faqFilter || 'all';
    document.querySelectorAll('.faq-item').forEach(item => {
      item.hidden = !((category === 'all' || item.dataset.category === category) && item.textContent.toLowerCase().includes(term));
    });
  }
  search?.addEventListener('input', filterFaq);
  filters.forEach(btn =>
    btn.addEventListener('click', () => {
      filters.forEach(item => item.classList.remove('active'));
      btn.classList.add('active');
      filterFaq();
    })
  );

  const blogSearch = document.querySelector('#blog-search');
  const blogFilters = [...document.querySelectorAll('[data-blog-category]')];
  function filterBlog() {
    if (!blogSearch && !blogFilters.length) return;
    const term = (blogSearch?.value || '').toLowerCase();
    const category = document.querySelector('[data-blog-category].active')?.dataset.blogCategory || 'all';
    document.querySelectorAll('.blog-card').forEach(item => {
      const matchCat = category === 'all' || item.dataset.category === category;
      const matchTerm = !term || item.textContent.toLowerCase().includes(term);
      item.hidden = !(matchCat && matchTerm);
    });
  }
  blogSearch?.addEventListener('input', filterBlog);
  blogFilters.forEach(btn =>
    btn.addEventListener('click', () => {
      blogFilters.forEach(item => item.classList.remove('active'));
      btn.classList.add('active');
      filterBlog();
    })
  );

  document.querySelectorAll('[data-login-form], [data-signin-form]').forEach(form =>
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!validate(event.currentTarget)) return;
      location.href = pageUrl('parent-dashboard.html');
    })
  );

  document.querySelector('[data-register-form]')?.addEventListener('submit', event => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!validate(form)) return;
    storeSet('profile', { name: form.elements.name.value.trim() });
    location.href = pageUrl('parent-dashboard.html');
  });

  document.querySelectorAll('[data-password-toggle]').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.closest('.password-input-wrap')?.querySelector('input');
      if (!input) return;
      const isPass = input.type === 'password';
      input.type = isPass ? 'text' : 'password';
      btn.setAttribute('aria-label', isPass ? 'Hide password' : 'Show password');
      btn.classList.toggle('showing', isPass);
    });
  });

  document.querySelectorAll('[data-forgot-trigger]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const email = document.querySelector('#login-email, #signin-email')?.value.trim();
      if (email) {
        alert(`Password reset instructions have been sent to ${email}.`);
      } else {
        alert('Please enter your registered email address above first, then click Forgot Password.');
      }
    });
  });
}

function buildPublicMap() {
  const target = document.querySelector('[data-public-map]');
  if (!target || !window.L) return;
  const publicMap = window.L.map(target, { scrollWheelZoom: false });
  window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap contributors' }).addTo(publicMap);
  const colors = ['#24557a', '#4f7892'];
  const bounds = [];
  routes.forEach((item, index) => {
    const latlngs = item.stops.map(stop => [stop.lat, stop.lng]);
    bounds.push(...latlngs);
    window.L.polyline(latlngs, { color: colors[index], weight: 6, opacity: 0.9 }).addTo(publicMap).bindTooltip(`${item.id} · ${item.name}`);
    item.stops.forEach(stop =>
      window.L.circleMarker([stop.lat, stop.lng], { radius: 6, color: colors[index], weight: 3, fillColor: '#fff', fillOpacity: 1 }).addTo(publicMap).bindPopup(`<strong>${stop.name}</strong><br>${item.id} · ${stop.pickup}`)
    );
  });
  if (bounds.length) publicMap.fitBounds(bounds, { padding: [38, 38] });
}

function initInteractions() {
  const year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();

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
  initForms();
  buildPublicMap();

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

initThemeAndDirection();
renderHeader();
renderFooter();
initInteractions();
injectSeo();
