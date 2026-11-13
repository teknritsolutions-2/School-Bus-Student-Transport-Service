import { routes } from "./transport-data.js";
import { pageUrl, escapeHTML as e } from "./site-config.js";
export function matchingRoutes({ area = "", school = "", journey = "" }) {
  return routes.filter(
    (r) =>
      (!area || r.area === area) &&
      (!school || r.school === school) &&
      (!journey || r.journeys.includes(journey)),
  );
}
export function stopDiagram(route, journey = "Morning pickup") {
  const stops =
    journey === "Afternoon return" ? [...route.stops].reverse() : route.stops;
  return `<ol class="stop-list">${stops.map((s, i) => `<li><span class="stop-dot">${i + 1}</span><div><strong>${e(s.name)}</strong><span>${e(journey === "Afternoon return" ? s.drop : s.pickup)}</span></div></li>`).join("")}</ol>`;
}
export function initRouteFinders() {
  document.querySelectorAll("[data-route-finder]").forEach((form) => {
    const area = form.elements.area,
      school = form.elements.school;
    [...new Set(routes.map((r) => r.area))].forEach((v) =>
      area.add(new Option(v, v)),
    );
    [...new Set(routes.map((r) => r.school))].forEach((v) =>
      school.add(new Option(v, v)),
    );
    const results = form.parentElement.querySelector("[data-route-results]");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const journey = form.elements.journey.value;
      const matches = matchingRoutes({
        area: area.value,
        school: school.value,
        journey,
      });
      results.innerHTML = matches.length
        ? `<p class="result-summary">${matches.length} reference route${matches.length === 1 ? "" : "s"} found</p><div class="route-results">${matches.map((r) => `<article class="route-result"><header><span class="route-code">${e(r.id)}</span><span>${e(journey)}</span></header><h3>${e(r.name)}</h3><p>${e(r.area)} → ${e(r.school)}</p>${stopDiagram(r, journey)}<div class="route-result-foot"><span>Approx. ${r.duration} minutes</span><a class="text-link" href="${pageUrl("contact.html")}">Enquire about coverage ↗</a></div></article>`).join("")}</div>`
        : `<div class="empty-state"><h3>No reference route matches these choices.</h3><p>Try a different school or area, or ask about coverage for your journey.</p><a class="button secondary" href="${pageUrl("contact.html")}">Request coverage</a></div>`;
      results.hidden = false;
    });
    if (form.closest("[data-route-auto]")) form.requestSubmit();
  });
}
