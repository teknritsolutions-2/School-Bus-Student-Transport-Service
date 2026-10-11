// KinderRide Student Transit Service - Parent Dashboard JavaScript
import { routes, students, plans, initialLogs, initialNotifications, money, storeGet, storeSet, BRAND } from './main.js';

// --- Telemetry & Map Tracking Simulation ---
let map;
let routeLine;
let busMarker;
let stopLayer;
let timer;
let progress = 0;
let route = routes[0];
let direction = 'pickup';
let emittedStops = new Set();

function points() {
  return route.stops.map(stop => [stop.lat, stop.lng]);
}

function interpolate(list, ratio) {
  const scaled = Math.min(0.9999, Math.max(0, ratio)) * (list.length - 1);
  const index = Math.floor(scaled);
  const part = scaled - index;
  const next = list[Math.min(index + 1, list.length - 1)];
  const here = list[index];
  return [here[0] + (next[0] - here[0]) * part, here[1] + (next[1] - here[1]) * part];
}

function renderStatus() {
  document.querySelectorAll('[data-trip-route]').forEach(el => (el.textContent = `${route.id} · ${route.name}`));
  document.querySelectorAll('[data-trip-direction]').forEach(el => (el.textContent = direction === 'pickup' ? 'Morning pickup' : 'Afternoon drop-off'));
  document.querySelectorAll('[data-trip-progress]').forEach(el => (el.style.width = `${progress}%`));
  document.querySelectorAll('[data-trip-percent]').forEach(el => (el.textContent = `${Math.round(progress)}%`));
  const eta = Math.max(0, Math.round(route.duration * (1 - progress / 100)));
  document.querySelectorAll('[data-trip-eta]').forEach(el => (el.textContent = progress >= 100 ? 'Arrived' : `${eta} min`));
}

function drawRoute() {
  if (!map || !window.L) return;
  const latlngs = points();
  routeLine?.remove();
  busMarker?.remove();
  stopLayer?.remove();
  routeLine = window.L.polyline(latlngs, { color: '#24557a', weight: 6, opacity: 0.92 }).addTo(map);
  stopLayer = window.L.layerGroup(
    route.stops.map(stop =>
      window.L.circleMarker([stop.lat, stop.lng], { radius: 7, color: '#17324d', weight: 3, fillColor: '#fff', fillOpacity: 1 }).bindPopup(
        `<strong>${stop.name}</strong><br>${direction === 'pickup' ? stop.pickup : stop.drop}`
      )
    )
  ).addTo(map);
  busMarker = window.L.circleMarker(interpolate(latlngs, progress / 100), { radius: 11, color: '#fff', weight: 4, fillColor: '#e2a32b', fillOpacity: 1 })
    .addTo(map)
    .bindTooltip('KinderRide bus', { permanent: false });
  map.fitBounds(routeLine.getBounds(), { padding: [34, 34] });
}

function notifyStop(index) {
  if (emittedStops.has(index)) return;
  emittedStops.add(index);
  const stop = route.stops[index];
  const student = students.find(item => item.routeId === route.id) || students[0];
  const notifications = storeGet('notifications', initialNotifications);
  notifications.unshift({ id: Date.now(), title: `Bus reached ${stop.name}`, body: `${route.id} checked in at ${stop.name}.`, time: 'Just now', unread: true });
  storeSet('notifications', notifications.slice(0, 12));
  const logs = storeGet('logs', initialLogs);
  logs.unshift({
    date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    student: student.name,
    route: route.id,
    event: `Bus reached ${stop.name}`,
    time: new Date().toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })
  });
  storeSet('logs', logs.slice(0, 30));
}

function update() {
  renderStatus();
  if (busMarker) busMarker.setLatLng(interpolate(points(), progress / 100));
  route.stops.forEach((_, index) => {
    if (progress >= (index / (route.stops.length - 1)) * 100) notifyStop(index);
  });
  if (progress >= 100) pauseTrip();
}

function buildMap() {
  if (map || !document.querySelector('[data-map]') || !window.L) return;
  map = window.L.map(document.querySelector('[data-map]'), { scrollWheelZoom: false });
  window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap contributors' }).addTo(map);
  drawRoute();
  renderStatus();
}

export function showTracking() {
  buildMap();
  setTimeout(() => map?.invalidateSize(), 50);
}

export function startTrip() {
  if (timer || progress >= 100) return;
  timer = setInterval(() => {
    progress = Math.min(100, progress + 1.2);
    update();
  }, 650);
}

export function pauseTrip() {
  clearInterval(timer);
  timer = undefined;
}

export function resetTrip() {
  pauseTrip();
  progress = 0;
  emittedStops = new Set();
  update();
  drawRoute();
}

export function setTrip(routeId, nextDirection = 'pickup') {
  pauseTrip();
  route = routes.find(item => item.id === routeId) || routes[0];
  direction = nextDirection;
  progress = 0;
  emittedStops = new Set();
  drawRoute();
  update();
}

// --- Example Receipt PDF Generation ---
export function createReceipt(record) {
  const api = window.jspdf;
  if (!api?.jsPDF) {
    alert('The PDF library could not be loaded.');
    return;
  }
  const doc = new api.jsPDF();
  doc.setFillColor(23, 50, 77);
  doc.rect(0, 0, 210, 39, 'F');
  doc.setTextColor(215, 229, 237);
  doc.setFontSize(20);
  doc.text('KINDERRIDE TRANSIT', 18, 24);
  doc.setTextColor(36, 85, 122);
  doc.setFontSize(17);
  doc.text('EXAMPLE RECEIPT', 18, 59);
  doc.setFontSize(10);
  doc.setTextColor(104, 107, 104);
  const rows = [
    ['Reference', record.id],
    ['Example date', record.date],
    ['Plan', record.plan],
    ['Student', record.student],
    ['Illustrative amount', money(record.amount)],
    ['Status', 'Example only — no payment processed']
  ];
  rows.forEach(([label, value], index) => {
    const y = 76 + index * 13;
    doc.setFont(undefined, 'bold');
    doc.text(label, 18, y);
    doc.setFont(undefined, 'normal');
    doc.text(String(value), 70, y);
  });
  doc.setDrawColor(223, 225, 219);
  doc.line(18, 160, 192, 160);
  doc.text('Generated locally for interface preview. This is not proof of payment.', 18, 175);
  doc.save(`${record.id}-example.pdf`);
}

// --- Dashboard Shell & Navigation ---
const titles = {
  overview: 'Dashboard overview',
  track: 'Track the route',
  students: 'Students',
  logs: 'Travel logs',
  notifications: 'Notifications',
  subscription: 'Subscription',
  receipts: 'Receipts',
  settings: 'Settings',
  help: 'Help & support'
};

const exampleReceipt = { id: 'ST-EXAMPLE-1001', date: '01 Oct 2026', plan: 'Daily Return', student: 'Anaya Rao', amount: 2950 };
let selected = students.find(item => item.id === storeGet('student', 'anaya')) || students[0];
const iconBell = `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9a6 6 0 0 1 12 0c0 7 3 7 3 7H3s3 0 3-7M10 20h4"/></svg>`;

function studentRoute(student = selected) {
  return routes.find(item => item.id === student.routeId) || routes[0];
}

function showView(name, push = true) {
  if (!titles[name]) name = 'overview';
  document.querySelectorAll('.dashboard-view').forEach(view => (view.hidden = view.dataset.view !== name));
  document.querySelectorAll('[data-view-target]').forEach(button => button.classList.toggle('active', button.dataset.viewTarget === name));
  document.querySelector('[data-dash-title]').textContent = titles[name];
  if (push) history.replaceState(null, '', `#${name}`);
  if (typeof dashMobile !== 'undefined' && dashMobile.matches) closeDashNavigation(false);
  if (name === 'track') showTracking();
}

function renderStudentSwitcher() {
  document.querySelector('[data-student-switcher]').innerHTML = students
    .map(
      student =>
        `<button class="${student.id === selected.id ? 'active' : ''}" data-student-id="${student.id}" type="button"><span class="avatar">${student.initials}</span><span>${student.name}</span></button>`
    )
    .join('');
  document.querySelectorAll('[data-selected-name]').forEach(node => (node.textContent = selected.name));
  document.querySelector('[data-profile-avatar]').textContent = selected.initials;
}

function renderOverview() {
  const route = studentRoute();
  const stop = route.stops.find(item => item.name === selected.stop) || route.stops[0];
  const school = route.stops.at(-1);
  document.querySelector('[data-overview-route]').textContent = `${route.id} · ${route.name}`;
  document.querySelector('[data-overview-time]').textContent = `Pickup at ${stop.pickup}`;
  document.querySelector('[data-overview-detail]').textContent = `${selected.name} · ${selected.stop} · ${route.school}`;
  document.querySelectorAll('[data-overview-stop]').forEach(node => (node.textContent = selected.stop));
  document.querySelectorAll('[data-overview-time-short]').forEach(node => (node.textContent = stop.pickup.replace(/\s[AP]M$/, '')));
  document.querySelector('[data-overview-arrival]').textContent = school.pickup;
  document.querySelector('[data-overview-events]').innerHTML = `<div class="mini-event"><strong>${stop.pickup} · Assigned pickup</strong><br><small>${selected.stop}</small></div><div class="mini-event"><strong>${school.pickup} · School arrival</strong><br><small>${route.school}</small></div>`;
}

function renderStudents() {
  document.querySelector('[data-student-cards]').innerHTML = students
    .map(student => {
      const route = studentRoute(student);
      const stop = route.stops.find(item => item.name === student.stop) || route.stops[0];
      return `<article class="dash-panel"><span class="avatar">${student.initials}</span><h2>${student.name}</h2><p>${student.grade}</p><div class="editorial-rule"><strong>${route.id} · ${route.name}</strong><br><span class="muted">${student.stop} · ${stop.pickup}<br>${route.school}</span></div><button class="btn btn-sm ${student.id === selected.id ? '' : 'btn-outline'}" data-student-id="${student.id}" type="button">${student.id === selected.id ? 'Selected' : 'Select Student'}</button></article>`;
    })
    .join('');
}

function renderPlan() {
  const planId = storeGet('plan', 'daily');
  const current = plans.find(item => item.id === planId) || plans[1];
  document.querySelector('[data-current-plan]').innerHTML = `<h2>${current.name}</h2><p class="price">${money(current.price)} <small>/ month</small></p><p class="muted">${current.note}</p>`;
  document.querySelector('[data-plan-list]').innerHTML = plans
    .map(
      plan =>
        `<article class="plan${plan.id === current.id ? ' featured' : ''}"><span class="tag">${plan.id === current.id ? 'Selected' : 'Available'}</span><h3>${plan.name}</h3><p class="price">${money(plan.price)} <small>/ month</small></p><p>${plan.note}</p><button class="btn ${plan.id === current.id ? 'btn-outline' : ''}" data-select-plan="${plan.id}" type="button">${plan.id === current.id ? 'Selected' : 'Choose Preference'}</button></article>`
    )
    .join('');
}

function renderReceipts() {
  document.querySelector('[data-receipt-body]').innerHTML = `<tr><td>${exampleReceipt.id}</td><td>${exampleReceipt.date}</td><td>${exampleReceipt.plan}</td><td>${money(exampleReceipt.amount)}</td><td><button class="btn btn-sm btn-outline" data-receipt type="button">Download Example PDF</button></td></tr>`;
}

function renderLogs() {
  const logs = storeGet('logs', initialLogs).filter(log => log.student === selected.name);
  document.querySelector('[data-log-body]').innerHTML =
    logs.map(log => `<tr><td>${log.date}</td><td>${log.student}</td><td>${log.route}</td><td>${log.event}</td><td>${log.time}</td></tr>`).join('') ||
    '<tr><td class="empty" colspan="5">No local journey entries for this student.</td></tr>';
}

function renderNotifications() {
  const notes = storeGet('notifications', initialNotifications);
  document.querySelector('[data-notification-list]').innerHTML = notes
    .map(
      note =>
        `<article class="notification${note.unread ? ' unread' : ''}"><span class="notification-icon">${iconBell}</span><div><h3>${note.title}</h3><p>${note.body}</p></div><time class="muted">${note.time}</time></article>`
    )
    .join('');
  document.querySelector('[data-note-count]').textContent = notes.filter(item => item.unread).length;
}

function selectStudent(id) {
  selected = students.find(item => item.id === id) || students[0];
  storeSet('student', selected.id);
  const route = studentRoute();
  document.querySelector('[data-route-select]').value = route.id;
  setTrip(route.id, document.querySelector('[data-direction-select]').value);
  renderStudentSwitcher();
  renderOverview();
  renderStudents();
  renderLogs();
}

document.addEventListener('click', event => {
  const view = event.target.closest('[data-view-target]');
  if (view) showView(view.dataset.viewTarget);
  const student = event.target.closest('[data-student-id]');
  if (student) selectStudent(student.dataset.studentId);
  const plan = event.target.closest('[data-select-plan]');
  if (plan) {
    storeSet('plan', plan.dataset.selectPlan);
    renderPlan();
  }
  if (event.target.closest('[data-receipt]')) createReceipt(exampleReceipt);
});

const dashSidebar = document.querySelector('[data-dash-sidebar]');
const dashMenu = document.querySelector('[data-dash-menu]');
const dashClose = document.querySelector('[data-dash-close]');
const dashScrim = document.querySelector('[data-dash-scrim]');
const dashMobile = matchMedia('(max-width: 1180px)');
let dashScrimTimer;

function syncDashNavigation() {
  if (!dashSidebar) return;
  const hidden = dashMobile.matches && !dashSidebar.classList.contains('open');
  dashSidebar.toggleAttribute('inert', hidden);
  dashSidebar.setAttribute('aria-hidden', String(hidden));
}

function openDashNavigation() {
  clearTimeout(dashScrimTimer);
  dashSidebar?.classList.add('open');
  if (dashScrim) {
    dashScrim.hidden = false;
    requestAnimationFrame(() => dashScrim.classList.add('open'));
  }
  document.body.classList.add('nav-open');
  dashMenu?.setAttribute('aria-expanded', 'true');
  syncDashNavigation();
  dashClose?.focus();
}

function closeDashNavigation(restore = true) {
  clearTimeout(dashScrimTimer);
  dashSidebar?.classList.remove('open');
  dashScrim?.classList.remove('open');
  document.body.classList.remove('nav-open');
  dashMenu?.setAttribute('aria-expanded', 'false');
  dashScrimTimer = setTimeout(() => {
    if (dashScrim) dashScrim.hidden = true;
  }, 200);
  syncDashNavigation();
  if (restore) dashMenu?.focus();
}

dashMenu?.addEventListener('click', openDashNavigation);
dashClose?.addEventListener('click', () => closeDashNavigation());
dashScrim?.addEventListener('click', () => closeDashNavigation());
dashMobile.addEventListener('change', () => {
  if (!dashMobile.matches) closeDashNavigation(false);
  syncDashNavigation();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && dashSidebar?.classList.contains('open')) closeDashNavigation();
});
syncDashNavigation();

document.addEventListener('keydown', event => {
  if (event.key !== 'Tab' || !dashSidebar?.classList.contains('open')) return;
  const focusable = [...dashSidebar.querySelectorAll('a, button:not([disabled])')];
  const first = focusable[0];
  const last = focusable.at(-1);
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last?.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first?.focus();
  }
});

const dashThemeToggle = document.querySelector('[data-theme-toggle]');
const dashDirToggle = document.querySelector('[data-dir-toggle]');

function syncDashControls() {
  const isDark = document.documentElement.dataset.theme === 'dark';
  if (dashThemeToggle) {
    const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';
    dashThemeToggle.setAttribute('aria-label', label);
    dashThemeToggle.title = label;
    dashThemeToggle.innerHTML = isDark
      ? '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>'
      : '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.2 15.3A8.4 8.4 0 0 1 8.7 3.8 8.5 8.5 0 1 0 20.2 15.3Z"/></svg>';
  }
  if (dashDirToggle) {
    const isRtl = document.documentElement.dir === 'rtl';
    const label = isRtl ? 'Switch to left-to-right text' : 'Switch to right-to-left text';
    dashDirToggle.setAttribute('aria-label', label);
    dashDirToggle.title = label;
    const badge = dashDirToggle.querySelector('.dir-badge');
    if (badge) {
      badge.textContent = isRtl ? 'LTR' : 'RTL';
    } else {
      dashDirToggle.innerHTML = `<span class="dir-badge">${isRtl ? 'LTR' : 'RTL'}</span>`;
    }
  }
}

dashThemeToggle?.addEventListener('click', () => {
  const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = theme;
  localStorage.setItem('schoolTransport:theme', theme);
  syncDashControls();
});

dashDirToggle?.addEventListener('click', () => {
  const dir = document.documentElement.dir === 'rtl' ? 'ltr' : 'rtl';
  document.documentElement.dir = dir;
  localStorage.setItem('schoolTransport:dir', dir);
  syncDashControls();
});
syncDashControls();

document.querySelector('[data-trip-start]')?.addEventListener('click', startTrip);
document.querySelector('[data-trip-pause]')?.addEventListener('click', pauseTrip);
document.querySelector('[data-trip-reset]')?.addEventListener('click', resetTrip);

document.querySelector('[data-route-select]')?.addEventListener('change', event =>
  setTrip(event.target.value, document.querySelector('[data-direction-select]').value)
);
document.querySelector('[data-direction-select]')?.addEventListener('change', event =>
  setTrip(document.querySelector('[data-route-select]').value, event.target.value)
);

document.querySelector('[data-mark-read]')?.addEventListener('click', () => {
  storeSet('notifications', storeGet('notifications', initialNotifications).map(item => ({ ...item, unread: false })));
  renderNotifications();
});

document.querySelectorAll('.switch').forEach(button =>
  button.addEventListener('click', () => button.setAttribute('aria-checked', button.getAttribute('aria-checked') === 'true' ? 'false' : 'true'))
);

addEventListener('schooltransport:state', event => {
  if (event.detail.key === 'notifications') renderNotifications();
  if (event.detail.key === 'logs') renderLogs();
});

addEventListener('hashchange', () => showView(location.hash.slice(1) || 'overview', false));

renderStudentSwitcher();
renderOverview();
renderStudents();
renderPlan();
renderReceipts();
renderLogs();
renderNotifications();

const initialRoute = studentRoute();
document.querySelector('[data-route-select]').value = initialRoute.id;
setTrip(initialRoute.id);
showView(location.hash.slice(1) || 'overview', false);
