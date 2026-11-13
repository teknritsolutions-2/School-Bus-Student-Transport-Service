import { brand, setupDrawer } from "./main.js";
import {
  routes,
  students,
  plans,
  initialLogs,
  initialNotifications,
} from "./transport-data.js";
import {
  pageUrl,
  storeGet,
  storeSet,
  storagePrefix,
  money,
  escapeHTML as e,
} from "./site-config.js";
import { stopDiagram } from "./route-finder.js";
import { createPlayback } from "./tracking.js";

const views = {
  overview: "Your school-day overview",
  track: "Route playback",
  students: "Student information",
  logs: "Journey records",
  notifications: "Notices & reminders",
  subscription: "Transport coverage",
  receipts: "Receipt documents",
  settings: "Workspace preferences",
  help: "Help & support",
};
const labels = [
  "Overview",
  "Track Bus",
  "Students",
  "Travel Logs",
  "Notifications",
  "Subscription",
  "Receipts",
  "Settings",
  "Help",
];
let selected =
  students.find((s) => s.id === storeGet("student", "student-a")) ||
  students[0];
let view = Object.hasOwn(views, location.hash.slice(1))
  ? location.hash.slice(1)
  : "overview";
let playbackEvents = [];
const route = () => routes.find((r) => r.id === selected.routeId);
const currentPlan = () =>
  plans.find((p) => p.id === storeGet("plan", "daily")) || plans[1];
const notes = () =>
  initialNotifications.map((n) => ({
    ...n,
    unread: !storeGet("read-notices", []).includes(n.id),
  }));
const button = (text, attr, secondary = false) =>
  `<button class="button small${secondary ? " secondary" : ""}" ${attr} type="button">${text}</button>`;
const fact = (label, value) => `<div><dt>${label}</dt><dd>${value}</dd></div>`;
function shell() {
  document.querySelector("[data-dashboard-root]").innerHTML =
    `<div class="workspace-shell"><aside class="workspace-sidebar" data-workspace-sidebar><div class="drawer-heading"><a class="brand" href="${pageUrl("index.html")}">${brand()}</a><button class="icon-button workspace-close" data-workspace-close aria-label="Close dashboard navigation">✕</button></div><span class="sidebar-label">PARENT WORKSPACE</span><nav aria-label="Dashboard sections">${Object.keys(
      views,
    )
      .map(
        (id, i) =>
          `<a href="#${id}" data-view="${id}"><span class="nav-index">0${i + 1}</span>${labels[i]}${id === "notifications" ? '<span class="notice-count" data-notice-count></span>' : ""}</a>`,
      )
      .join(
        "",
      )}</nav><div class="sidebar-bottom"><a href="${pageUrl("index.html")}">← Back to the website</a><span>Reference family workspace</span></div></aside><div class="drawer-backdrop" data-workspace-backdrop hidden></div><div class="workspace-main"><header class="workspace-topbar"><button class="icon-button workspace-menu" data-workspace-menu aria-label="Open dashboard navigation" aria-expanded="false">☰</button><div><span class="meta muted">KinderRide Transit</span><strong>Parent workspace</strong></div><div class="workspace-tools"><button class="icon-button" data-theme-toggle aria-label="Switch color theme"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 15A8 8 0 0 1 9 4a8.5 8.5 0 1 0 11 11Z"/></svg></button><button class="icon-button direction-button" data-dir-toggle aria-label="Switch text direction">RTL</button><a class="avatar" href="#settings" aria-label="Open preferences">P</a></div></header><div class="workspace-content"><div class="workspace-heading"><div><span class="eyebrow">Your family’s wayfinder</span><h1 data-workspace-title></h1></div><div class="student-select"><label for="selected-student">Selected student</label><select id="selected-student">${students.map((s) => `<option value="${s.id}"${s.id === selected.id ? " selected" : ""}>${s.name} · ${s.grade}</option>`).join("")}</select></div></div><p class="workspace-boundary">Fictional reference records. No live location, real student database or payment service is connected.</p><div data-workspace-content></div><p role="status" class="workspace-status" data-workspace-status></p></div></div></div>`;
}
function overview() {
  const r = route(),
    stop = r.stops.find((s) => s.name === selected.stop);
  return `<div class="overview-grid"><article class="workspace-panel assignment-panel"><div class="panel-heading"><span class="status">Next reference journey</span><span class="route-code">${r.id}</span></div><h2>${r.name}</h2><p>${selected.name} · ${r.school}</p><div class="pickup-time">${stop.pickup}<span>Scheduled reference pickup</span></div><dl class="facts">${fact("Assigned stop", selected.stop)}${fact("Return time", stop.drop)}${fact("School arrival", r.stops.at(-1).pickup)}${fact("Journey direction", "Morning / return")}</dl><a class="button small" href="#track">Explore route playback →</a></article><article class="workspace-panel"><span class="eyebrow">Latest reference record</span><h2>School arrival</h2><p class="record-time">${r.stops.at(-1).pickup}</p><p>${r.school}</p><div class="record-note">Reference day · Scheduled journey information</div><a class="text-link" href="#logs">View records ↗</a></article><article class="workspace-panel"><div class="panel-heading"><h2>Important notices</h2><a href="#notifications">View all</a></div>${notes()
    .map(
      (n) =>
        `<div class="notice-compact"><strong>${n.title}</strong><p>${n.body}</p></div>`,
    )
    .join(
      "",
    )}</article><article class="workspace-panel"><span class="eyebrow">Coverage preference</span><h2>${currentPlan().name}</h2><p>${currentPlan().note}</p><p class="meta muted">Locally selected reference coverage. No active paid subscription.</p><a class="text-link" href="#subscription">Review coverage ↗</a></article></div>`;
}
function tracking() {
  const r = route();
  return `<div class="tracking-layout"><article class="workspace-panel route-canvas"><div class="panel-heading"><div><span class="eyebrow">Reference route schematic</span><h2>${r.name}</h2></div><span class="route-code">${r.id}</span></div><p class="meta muted">Stop order only, not geographic navigation or a live vehicle map.</p><div data-playback-stops>${stopDiagram(r)}</div><div class="playback-progress" role="progressbar" aria-label="Playback progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><span data-playback-progress></span></div><p class="meta"><strong data-playback-percent>0%</strong> playback progress</p></article><aside><article class="workspace-panel"><h2>Playback controls</h2><p class="meta muted">An isolated simulation. Playback does not add historical records or send notices.</p><div class="field"><label for="playback-direction">Journey direction</label><select id="playback-direction"><option>Morning pickup</option><option>Afternoon return</option></select></div><dl class="facts">${fact("Student", selected.name)}${fact("Assigned stop", selected.stop)}</dl><div class="playback-buttons">${button("Start", 'data-playback="start"')}${button("Pause", 'data-playback="pause"', true)}${button("Reset", 'data-playback="reset"', true)}</div><p role="status" class="meta" data-playback-status>Ready to explore the route.</p></article><article class="workspace-panel playback-events"><h3>Playback events</h3><ul data-playback-events><li>No simulation events yet.</li></ul></article></aside></div>`;
}
function studentCards() {
  return `<div class="workspace-grid">${students
    .map((s) => {
      const r = routes.find((x) => x.id === s.routeId);
      return `<article class="workspace-panel student-card"><span class="avatar">${s.initials}</span><h2>${s.name}</h2><p>${s.grade} · Fictional reference profile</p><dl class="facts">${fact("School", r.school)}${fact("Route", r.name)}${fact("Assigned stop", s.stop)}${fact("Plan category", currentPlan().name)}</dl>${button(s.id === selected.id ? "Selected" : "Select student", `data-select-student="${s.id}"`, s.id !== selected.id)}</article>`;
    })
    .join("")}</div>`;
}
function logs() {
  return `<article class="workspace-panel"><div class="panel-heading"><h2>Records for ${selected.name}</h2><span class="status">Reference history</span></div><div class="table-scroll"><table><thead><tr><th>Date</th><th>Direction</th><th>Event</th><th>Route</th><th>Time</th><th>Source</th></tr></thead><tbody>${initialLogs
    .filter((l) => l.student === selected.id)
    .map(
      (l) =>
        `<tr><td data-label="Date">${l.date}</td><td data-label="Direction">${l.direction}</td><td data-label="Event">${l.event}</td><td data-label="Route">${l.route}</td><td data-label="Time">${l.time}</td><td data-label="Source">${l.source}</td></tr>`,
    )
    .join(
      "",
    )}</tbody></table></div><p class="meta muted">Route playback is kept separate from these records.</p></article>`;
}
function notifications() {
  return `<div class="panel-heading"><p class="muted">Reference reminders and preparation information.</p>${button("Mark all read", "data-read-all", true)}</div><div class="notification-feed">${notes()
    .map(
      (n) =>
        `<article class="workspace-panel notification-item${n.unread ? " unread" : ""}"><span class="notice-dot" role="img" aria-label="${n.unread ? "Unread" : "Read"}"></span><div><span class="meta muted">${n.category}</span><h2>${n.title}</h2><p>${n.body}</p></div></article>`,
    )
    .join("")}</div>`;
}
function subscriptions() {
  return `<p class="notice">These are local coverage preferences with illustrative amounts, not a paid subscription. Confirm actual rates and renewal terms with the operator.</p><div class="plan-grid">${plans.map((p) => `<article class="plan${p.id === currentPlan().id ? " featured" : ""}"><span class="status">${p.id === currentPlan().id ? "Selected preference" : "Coverage option"}</span><h3>${p.name}</h3><p>${p.note}</p><p class="price">${money(p.price)}<small> / example month</small></p>${button(p.id === currentPlan().id ? "Selected" : "Choose preference", `data-plan="${p.id}"`, p.id !== currentPlan().id)}</article>`).join("")}</div><article class="workspace-panel"><h3>Before renewal</h3><p>Confirm service days, current availability, the written quote and validity period. No renewal date or official payment status is available in this reference workspace.</p><a class="text-link" href="${pageUrl("contact.html")}">Ask about renewal ↗</a></article>`;
}
export function createReceipt() {
  const api = window.jspdf;
  if (!api?.jsPDF) {
    status("The PDF library did not load. Please try again.");
    return;
  }
  const doc = new api.jsPDF();
  doc.setFillColor(24, 92, 86);
  doc.rect(0, 0, 210, 42, "F");
  doc.setTextColor(248, 249, 244);
  doc.setFontSize(21);
  doc.text("KinderRide Transit", 18, 25);
  doc.setTextColor(24, 92, 86);
  doc.setFontSize(17);
  doc.text("DRAFT - NOT PROOF OF PAYMENT", 18, 60);
  doc.setFontSize(11);
  const rows = [
    ["Reference", "KR-REFERENCE-1001"],
    ["Student", selected.name + " (fictional)"],
    ["Coverage", currentPlan().name],
    ["Example amount", "INR " + currentPlan().price],
    ["Payment status", "No payment processed"],
    ["Date", "Reference document"],
  ];
  rows.forEach(([l, v], i) => {
    doc.text(l, 18, 82 + i * 14);
    doc.text(v, 70, 82 + i * 14);
  });
  doc.setFontSize(10);
  doc.text(
    "Generated locally from reference data. Not an official receipt.",
    18,
    190,
  );
  doc.save("kinderride-draft-receipt.pdf");
}
function receipts() {
  return `<article class="workspace-panel"><span class="eyebrow">Document center</span><h2>Keep the document’s purpose clear.</h2><p>Download a reference receipt for the selected student and coverage preference. It is visibly marked as a draft, with no payment processed.</p><dl class="facts">${fact("Document", "KR-REFERENCE-1001")}${fact("Student", selected.name)}${fact("Coverage", currentPlan().name)}${fact("Example amount", money(currentPlan().price))}</dl>${button("Download draft PDF", "data-receipt")}<p class="meta muted">Official receipts require verified billing and payment records.</p></article>`;
}
function settings() {
  const prefs = storeGet("notice-preferences", {
    journey: true,
    plan: true,
    service: false,
  });
  return `<div class="workspace-grid"><article class="workspace-panel"><h2>Profile preference</h2><form data-profile-form><div class="field"><label for="display-name">Workspace display name</label><input id="display-name" name="displayName" maxlength="50" value="${e(storeGet("display-name", "Parent"))}"></div><p class="meta muted">Stored on this device only. Do not use this form for student personal data.</p><button class="button small" type="submit">Save preference</button></form></article><article class="workspace-panel"><h2>Notification preferences</h2>${[
    ["journey", "Journey notices"],
    ["plan", "Plan reminders"],
    ["service", "Service information"],
  ]
    .map(
      ([key, label]) =>
        `<label class="preference-row"><span>${label}</span><input type="checkbox" data-notice-pref="${key}"${prefs[key] ? " checked" : ""}></label>`,
    )
    .join(
      "",
    )}</article><article class="workspace-panel"><h2>Display preferences</h2><p>Set the theme and text direction for this browser.</p><div class="button-row"><button class="button small secondary" data-theme-toggle>Switch theme</button><button class="button small secondary" data-dir-toggle>RTL</button></div></article><article class="workspace-panel"><h2>Local reference data</h2><p>Reset selected students, coverage and preferences for this workspace. This does not affect any operator system.</p>${button("Reset local workspace", "data-reset-local", true)}</article></div>`;
}
function help() {
  return `<div class="workspace-grid">${[
    [
      "Route or stop question",
      "Check school, area and direction, then prepare a route enquiry.",
      "routes.html",
      "Explore routes",
    ],
    [
      "Preparing for travel",
      "Review the waiting, boarding, seating and collection routine.",
      "safety-features.html",
      "Read safety guidance",
    ],
    [
      "Plans and billing",
      "Confirm actual rates, cancellation terms and official receipts with the operator.",
      "pricing-policies.html",
      "Review policies",
    ],
    [
      "Active journey concern",
      "Use your operator’s verified dispatch channel. For immediate danger, contact local emergency services.",
      "contact.html",
      "Contact information",
    ],
  ]
    .map(
      ([t, p, u, l]) =>
        `<article class="workspace-panel"><h2>${t}</h2><p>${p}</p><a class="text-link" href="${pageUrl(u)}">${l} ↗</a></article>`,
    )
    .join("")}</div>`;
}
const renderers = {
  overview,
  track: tracking,
  students: studentCards,
  logs,
  notifications,
  subscription: subscriptions,
  receipts,
  settings,
  help,
};
const status = (text) =>
  (document.querySelector("[data-workspace-status]").textContent = text);
const playback = createPlayback({
  onChange: (state) => {
    const bar = document.querySelector("[data-playback-progress]");
    if (bar) {
      bar.style.width = state.progress + "%";
      bar.parentElement.setAttribute(
        "aria-valuenow",
        String(Math.round(state.progress)),
      );
    }
    const percent = document.querySelector("[data-playback-percent]");
    if (percent) percent.textContent = Math.round(state.progress) + "%";
    const label = document.querySelector("[data-playback-status]");
    if (label)
      label.textContent = state.running
        ? "Playback running — not live tracking."
        : state.progress >= 100
          ? "Playback complete."
          : state.progress
            ? "Playback paused."
            : "Ready to explore the route.";
    document
      .querySelectorAll("[data-playback-stops] li")
      .forEach((li, i) =>
        li.classList.toggle(
          "passed",
          state.progress >= (i / (route().stops.length - 1)) * 100,
        ),
      );
  },
  onEvent: (event) => {
    playbackEvents.push(event);
    const ul = document.querySelector("[data-playback-events]");
    if (ul)
      ul.innerHTML = playbackEvents.map((v) => `<li>${v.label}</li>`).join("");
  },
});
function render() {
  document.querySelector("[data-workspace-title]").textContent = views[view];
  document.querySelector("[data-workspace-content]").innerHTML =
    renderers[view]();
  document.querySelectorAll("[data-view]").forEach((a) => {
    a.toggleAttribute("aria-current", a.dataset.view === view);
    if (a.hasAttribute("aria-current")) a.setAttribute("aria-current", "page");
  });
  document.querySelector("[data-notice-count]").textContent = notes().filter(
    (n) => n.unread,
  ).length;
  status("");
  if (view === "track") {
    playbackEvents = [];
    playback.select(route());
  }
  if (view === "settings")
    document
      .querySelector("[data-profile-form]")
      .addEventListener("submit", (ev) => {
        ev.preventDefault();
        storeSet(
          "display-name",
          ev.currentTarget.elements.displayName.value.trim(),
        );
        status("Display preference saved on this device.");
      });
}
shell();
document.querySelector("[data-dir-toggle]").textContent =
  document.documentElement.dir === "rtl" ? "LTR" : "RTL";
document
  .querySelector("[data-theme-toggle]")
  .setAttribute(
    "aria-label",
    `Switch to ${document.documentElement.dataset.theme === "dark" ? "light" : "dark"} mode`,
  );
const closeDrawer = setupDrawer({
  drawer: document.querySelector("[data-workspace-sidebar]"),
  open: document.querySelector("[data-workspace-menu]"),
  close: document.querySelector("[data-workspace-close]"),
  backdrop: document.querySelector("[data-workspace-backdrop]"),
});
const media = matchMedia("(max-width:1180px)");
function syncSidebar() {
  const sidebar = document.querySelector("[data-workspace-sidebar]");
  sidebar.inert = media.matches && !sidebar.classList.contains("is-open");
  if (!media.matches) {
    sidebar.classList.remove("is-open");
    document.querySelector("[data-workspace-backdrop]").hidden = true;
    document.body.classList.remove("drawer-open");
  }
}
media.addEventListener("change", syncSidebar);
syncSidebar();
document.querySelector("#selected-student").addEventListener("change", (ev) => {
  selected = students.find((s) => s.id === ev.target.value);
  storeSet("student", selected.id);
  playback.pause();
  render();
});
document.addEventListener("click", (ev) => {
  const s = ev.target.closest("[data-select-student]");
  if (s) {
    selected = students.find((x) => x.id === s.dataset.selectStudent);
    storeSet("student", selected.id);
    document.querySelector("#selected-student").value = selected.id;
    render();
  }
  const p = ev.target.closest("[data-plan]");
  if (p) {
    storeSet("plan", p.dataset.plan);
    render();
    status("Coverage preference saved locally. No payment was processed.");
  }
  const action = ev.target.closest("[data-playback]");
  if (action) {
    if (action.dataset.playback === "reset") {
      playbackEvents = [];
      document.querySelector("[data-playback-events]").innerHTML =
        "<li>No simulation events yet.</li>";
    }
    playback[action.dataset.playback]();
  }
  if (ev.target.closest("[data-receipt]")) createReceipt();
  if (ev.target.closest("[data-read-all]")) {
    storeSet(
      "read-notices",
      initialNotifications.map((n) => n.id),
    );
    render();
    status("Reference notices marked as read.");
  }
  if (
    ev.target.closest("[data-reset-local]") &&
    confirm("Reset this browser’s reference workspace preferences?")
  ) {
    [
      "student",
      "plan",
      "read-notices",
      "notice-preferences",
      "display-name",
    ].forEach((k) => localStorage.removeItem(storagePrefix + k));
    selected = students[0];
    document.querySelector("#selected-student").value = selected.id;
    render();
    status("Local workspace reset.");
  }
});
document.addEventListener("change", (ev) => {
  if (ev.target.id === "playback-direction") {
    playbackEvents = [];
    document.querySelector("[data-playback-stops]").innerHTML = stopDiagram(
      route(),
      ev.target.value,
    );
    document.querySelector("[data-playback-events]").innerHTML =
      "<li>No simulation events yet.</li>";
    playback.select(route(), ev.target.value);
  }
  if (ev.target.matches("[data-notice-pref]")) {
    const prefs = {
      journey: true,
      plan: true,
      service: false,
      ...storeGet("notice-preferences", {}),
    };
    prefs[ev.target.dataset.noticePref] = ev.target.checked;
    storeSet("notice-preferences", prefs);
    status("Notification preference saved locally.");
  }
});
addEventListener("hashchange", () => {
  playback.pause();
  view = Object.hasOwn(views, location.hash.slice(1))
    ? location.hash.slice(1)
    : "overview";
  render();
  if (media.matches) closeDrawer();
});
render();
