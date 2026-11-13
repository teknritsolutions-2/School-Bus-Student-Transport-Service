import { pageUrl, storeSet } from "./site-config.js";
import { initRouteFinders } from "./route-finder.js";
import { initForms } from "./forms.js";

const page = document.body.dataset.page;
export const brand = () =>
  `<span class="brand-symbol" aria-hidden="true"><i></i><i></i><i></i></span><span>KinderRide<small>TRANSIT</small></span>`;
const link = (label, file, ids = []) =>
  `<a href="${pageUrl(file)}"${ids.includes(page) ? ' aria-current="page"' : ""}>${label}</a>`;
const themeButton = () =>
  '<button class="icon-button" data-theme-toggle aria-label="Switch color theme"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 15A8 8 0 0 1 9 4a8.5 8.5 0 1 0 11 11Z"/></svg></button>';
const dirButton = () =>
  '<button class="icon-button direction-button" data-dir-toggle aria-label="Switch text direction">RTL</button>';
const menuLinks = () =>
  `${link("About", "about.html", ["about"])}${link("Services", "services.html", ["services", "transport"])}${link("Routes", "routes.html", ["routes"])}${link("Safety", "safety-fleet.html", ["fleet", "safety"])}${link("Pricing", "pricing-policies.html", ["pricing", "plans"])}${link("Contact", "contact.html", ["contact"])}`;
function shell() {
  const host = document.querySelector("[data-site-header]");
  if (host)
    host.innerHTML = `<a class="skip-link" href="#main-content">Skip to content</a><header class="site-header"><div class="container navigation"><a class="brand" href="${pageUrl("index.html")}" aria-label="KinderRide Transit home">${brand()}</a><nav class="desktop-navigation" aria-label="Main navigation"><details class="home-menu"><summary${["home", "home2"].includes(page) ? ' class="current"' : ""}>Home <span aria-hidden="true">⌄</span></summary><div class="dropdown">${link("Home 1", "index.html", ["home"])}${link("Home 2", "home2.html", ["home2"])}</div></details>${menuLinks()}</nav><div class="header-tools">${themeButton()}${dirButton()}<a class="login-link" href="${pageUrl("login.html")}">Login</a><a class="dashboard-link" href="${pageUrl("parent-dashboard.html")}">Dashboard ↗</a></div><button class="icon-button menu-toggle" data-menu-open aria-label="Open navigation" aria-expanded="false"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button></div></header><div class="drawer-backdrop" data-backdrop hidden></div><aside class="site-drawer" data-drawer aria-label="Mobile navigation" inert><div class="drawer-heading"><a class="brand" href="${pageUrl("index.html")}">${brand()}</a><button class="icon-button" data-menu-close aria-label="Close navigation">✕</button></div><nav><details open><summary>Home</summary>${link("Home 1", "index.html", ["home"])}${link("Home 2", "home2.html", ["home2"])}</details>${menuLinks()}${link("Parent Dashboard ↗", "parent-dashboard.html")}</nav><div class="drawer-tools">${themeButton()}${dirButton()}<a class="button small" href="${pageUrl("login.html")}">Login</a></div></aside>`;
  const footer = document.querySelector("[data-site-footer]");
  if (footer)
    footer.innerHTML = `<footer class="site-footer"><div class="container footer-top"><a class="brand" href="${pageUrl("index.html")}">${brand()}</a><p>Safe journeys. Clear routes.<br>Confident school mornings.</p><a class="text-link" href="${pageUrl("contact.html")}">Let’s plan the journey →</a></div><div class="container footer-links"><div><h2>Explore</h2>${link("Home 1", "index.html")}${link("Home 2", "home2.html")}${link("About us", "about.html")}${link("How it works", "how-it-works.html")}</div><div><h2>Transport services</h2>${link("All services", "services.html")}${link("School & group transport", "transport-services.html")}${link("Routes & stops", "routes.html")}${link("Safety & fleet", "safety-fleet.html")}</div><div><h2>Parent resources</h2>${link("Registration guide", "parent-portal-registration.html")}${link("Pricing & policies", "pricing-policies.html")}${link("FAQs", "faq.html")}${link("Journal & scenarios", "blog.html")}</div><div><h2>Account & support</h2>${link("Parent Dashboard", "parent-dashboard.html")}${link("Login", "login.html")}${link("Create account", "register.html")}${link("Contact & dispatch", "contact.html")}</div></div><div class="container footer-bottom"><span>© ${new Date().getFullYear()} KinderRide Transit</span><div>${link("Privacy", "privacy.html")}${link("Terms", "terms.html")}</div></div></footer><button class="back-top icon-button" data-back-top aria-label="Back to top" hidden>↑</button>`;
}
function preferences() {
  const sync = () => {
    document
      .querySelectorAll("[data-theme-toggle]")
      .forEach((b) =>
        b.setAttribute(
          "aria-label",
          `Switch to ${document.documentElement.dataset.theme === "dark" ? "light" : "dark"} mode`,
        ),
      );
    document
      .querySelectorAll("[data-dir-toggle]")
      .forEach(
        (b) =>
          (b.textContent =
            document.documentElement.dir === "rtl" ? "LTR" : "RTL"),
      );
  };
  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-theme-toggle]")) {
      const t =
        document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = t;
      storeSet("theme", t);
    }
    if (e.target.closest("[data-dir-toggle]")) {
      const d = document.documentElement.dir === "rtl" ? "ltr" : "rtl";
      document.documentElement.dir = d;
      storeSet("dir", d);
    }
    sync();
  });
  sync();
}
export function setupDrawer({ drawer, open, close, backdrop }) {
  if (!drawer || !open) return;
  let lastFocus;
  const shut = () => {
    drawer.classList.remove("is-open");
    drawer.inert = true;
    backdrop.hidden = true;
    open.setAttribute("aria-expanded", "false");
    document.body.classList.remove("drawer-open");
    lastFocus?.focus();
  };
  open.addEventListener("click", () => {
    lastFocus = document.activeElement;
    drawer.inert = false;
    drawer.classList.add("is-open");
    backdrop.hidden = false;
    open.setAttribute("aria-expanded", "true");
    document.body.classList.add("drawer-open");
    close.focus();
  });
  close.addEventListener("click", shut);
  backdrop.addEventListener("click", shut);
  document.addEventListener("keydown", (e) => {
    if (!drawer.classList.contains("is-open")) return;
    if (e.key === "Escape") shut();
    if (e.key === "Tab") {
      const items = [
        ...drawer.querySelectorAll("a,button,summary,input"),
      ].filter((x) => x.getBoundingClientRect().height);
      const first = items[0],
        last = items.at(-1);
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
  return shut;
}
const stages = [
  {
    label: "Morning pickup",
    title: "Ready at the right stop.",
    body: "Review the assigned stop, school timetable and collection arrangement before leaving home.",
    items: [
      "Check the agreed pickup window",
      "Wait away from the vehicle approach",
      "Keep guardian contact details current",
    ],
  },
  {
    label: "School arrival",
    title: "One clear handoff at the school gate.",
    body: "School teams and transport staff coordinate where students leave the vehicle and enter the school.",
    items: [
      "Follow the agreed arrival routine",
      "Wait until the vehicle is stationary",
      "Keep the aisle and exit clear",
    ],
  },
  {
    label: "Afternoon return",
    title: "A familiar way home.",
    body: "Confirm dismissal time, the return stop and who is authorized to collect the student.",
    items: [
      "Review afternoon service notices",
      "Use the confirmed collection point",
      "Report changes through the operator",
    ],
  },
];
function journeySelector() {
  document.querySelectorAll("[data-journey-selector]").forEach((root) => {
    const render = (i) => {
      root.querySelectorAll("[data-stage]").forEach((b, j) => {
        b.setAttribute("aria-selected", String(j === i));
        b.tabIndex = j === i ? 0 : -1;
      });
      const s = stages[i];
      root.querySelector("[data-stage-content]").innerHTML =
        `<span class="eyebrow">${s.label}</span><h2>${s.title}</h2><p>${s.body}</p><ul class="check-list">${s.items.map((v) => `<li>${v}</li>`).join("")}</ul>`;
      root
        .querySelectorAll(".journey-rail li")
        .forEach((el, j) => el.classList.toggle("is-current", i === j));
    };
    root.addEventListener("click", (e) => {
      const b = e.target.closest("[data-stage]");
      if (b) render(Number(b.dataset.stage));
    });
    root.addEventListener("keydown", (e) => {
      if (
        !e.target.matches("[data-stage]") ||
        !["ArrowRight", "ArrowLeft", "Home", "End"].includes(e.key)
      )
        return;
      e.preventDefault();
      let i = Number(e.target.dataset.stage);
      i =
        e.key === "Home"
          ? 0
          : e.key === "End"
            ? 2
            : (i + (e.key === "ArrowRight" ? 1 : 2)) % 3;
      render(i);
      root.querySelector(`[data-stage="${i}"]`).focus();
    });
    render(0);
  });
}
function searchContent() {
  document.querySelectorAll("[data-search-group]").forEach((root) => {
    const input = root.querySelector('input[type="search"]'),
      buttons = [...root.querySelectorAll("[data-category]")],
      cards = [...root.querySelectorAll("[data-search-item]")];
    let category = "all";
    const run = () => {
      let count = 0;
      cards.forEach((c) => {
        c.hidden = !(
          (category === "all" || c.dataset.searchItem === category) &&
          c.textContent.toLowerCase().includes(input.value.toLowerCase().trim())
        );
        if (!c.hidden) count++;
      });
      root.querySelector("[data-search-empty]").hidden = count > 0;
    };
    input.addEventListener("input", run);
    buttons.forEach((b) =>
      b.addEventListener("click", () => {
        category = b.dataset.category;
        buttons.forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
        run();
      }),
    );
  });
}
function serviceSelector() {
  const root = document.querySelector("[data-service-selector]");
  if (!root) return;
  const tabs = [...root.querySelectorAll("[data-service-tab]")];
  const panels = [...root.querySelectorAll("[data-service-panel]")];
  function select(index, focus = false, updateURL = true) {
    tabs.forEach((tab, i) => {
      tab.setAttribute("aria-selected", String(i === index));
      tab.tabIndex = i === index ? 0 : -1;
    });
    panels.forEach((panel, i) => {
      panel.hidden = i !== index;
    });
    if (focus) tabs[index].focus();
    if (updateURL) history.replaceState(null, "", `#${panels[index].id}`);
  }
  tabs.forEach((tab, index) =>
    tab.addEventListener("click", () => select(index)),
  );
  root.addEventListener("keydown", (event) => {
    const index = tabs.indexOf(event.target);
    if (
      index < 0 ||
      !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)
    )
      return;
    event.preventDefault();
    const forward =
      document.documentElement.dir === "rtl" ? "ArrowLeft" : "ArrowRight";
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? tabs.length - 1
          : (index + (event.key === forward ? 1 : tabs.length - 1)) %
            tabs.length;
    select(next, true);
  });
  const fromHash = () =>
    Math.max(
      0,
      panels.findIndex((panel) => panel.id === location.hash.slice(1)),
    );
  addEventListener("hashchange", () => select(fromHash(), false, false));
  select(fromHash(), false, false);
}
shell();
preferences();
initRouteFinders();
initForms();
journeySelector();
searchContent();
serviceSelector();
const closePublicDrawer = setupDrawer({
  drawer: document.querySelector("[data-drawer]"),
  open: document.querySelector("[data-menu-open]"),
  close: document.querySelector("[data-menu-close]"),
  backdrop: document.querySelector("[data-backdrop]"),
});
matchMedia("(min-width:1241px)").addEventListener("change", (event) => {
  if (event.matches && document.querySelector("[data-drawer].is-open"))
    closePublicDrawer?.();
});
document.addEventListener("click", (e) => {
  const d = document.querySelector(".home-menu");
  if (d && !e.target.closest(".home-menu")) d.open = false;
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const menu = document.querySelector(".home-menu");
    if (menu?.open) {
      menu.open = false;
      menu.querySelector("summary").focus();
    }
  }
});
const top = document.querySelector("[data-back-top]");
if (top) {
  addEventListener(
    "scroll",
    () => {
      top.hidden = scrollY < 500;
    },
    { passive: true },
  );
  top.addEventListener("click", () =>
    scrollTo({
      top: 0,
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    }),
  );
}
