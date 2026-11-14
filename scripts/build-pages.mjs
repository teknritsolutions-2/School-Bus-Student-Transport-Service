// Authoring helper. Output is ordinary physical HTML; no runtime build is required.
import fs from "node:fs";
import { ageRates } from "../assets/js/transport-data.js";
const version = "schoolday-age-3";
const imageDimensions = JSON.parse(
  fs.readFileSync(new URL("./image-dimensions.json", import.meta.url), "utf8"),
);
const imageSize = (
  src,
  sizes = "(max-width: 820px) calc(100vw - 40px), 640px",
) =>
  `width="${imageDimensions[src].width}" height="${imageDimensions[src].height}" srcset="../assets/images/${src}-640.webp 640w, ../assets/images/${src}-960.webp 960w, ../assets/images/${src}.webp ${imageDimensions[src].width}w" sizes="${sizes}" decoding="async"`;
export const photo = (src, alt, caption = "", extra = "", priority = false) =>
  `<figure class="editorial-photo ${imageDimensions[src].height > imageDimensions[src].width ? "photo-portrait" : "photo-landscape"} ${extra}"><img src="../assets/images/${src}.webp" ${imageSize(src)} alt="${alt}" ${priority ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"'}>${caption ? `<figcaption>${caption}</figcaption>` : ""}</figure>`;
export const button = (label, file, secondary = false) =>
  `<a class="button${secondary ? " secondary" : ""}" href="${file}">${label} <span aria-hidden="true">→</span></a>`;
export const rail = () =>
  `<ol class="journey-rail"><li><strong>Pickup stop</strong><p>A familiar place, an agreed time.</p></li><li><strong>Boarding</strong><p>Wait for the signal, then step aboard.</p></li><li><strong>School arrival</strong><p>A coordinated handoff at school.</p></li><li><strong>Afternoon return</strong><p>The same care on the way home.</p></li></ol>`;
export const routeTool = (id = "route", variant = "default") =>
  `<div class="route-tool route-tool--${variant}">${variant === "search" ? "" : `<div class="route-tool-head"><h2>Find your route.</h2><p>${variant === "compact" ? "Choose an area, school and journey direction." : "Explore reference routes to understand the journey. Actual schools, stops and availability are confirmed by the operator."}</p></div>`}<form data-route-finder aria-label="School route finder"><div class="finder-fields"><div class="field"><label for="${id}-area">Area</label><select name="area" id="${id}-area"><option value="">All reference areas</option></select></div><div class="field"><label for="${id}-school">School</label><select name="school" id="${id}-school"><option value="">All reference schools</option></select></div><div class="field"><label for="${id}-journey">Journey</label><select name="journey" id="${id}-journey"><option>Morning pickup</option><option>Afternoon return</option></select></div><button class="button" type="submit">Find a route →</button></div></form><div data-route-results aria-live="polite" hidden></div><small class="tool-note">Reference route data, not confirmed service coverage. <a href="contact.html">Request your area</a>.</small></div>`;
export const closing = (
  title = "Let’s plan a better school morning.",
  copy = "Start with the school, your area and the journeys you need.",
  label = "Make a route enquiry",
  href = "contact.html",
) =>
  `<section class="closing"><div class="container"><div><h2>${title}</h2><p>${copy}</p></div>${button(label, href)}</div></section>`;
export const scope = (items) =>
  `<div class="scope-grid">${items.map(([title, text]) => `<article><h3>${title}</h3><p>${text}</p></article>`).join("")}</div>`;
export const policies = (items) =>
  `<div class="policy-grid">${items.map(([title, text]) => `<article><h3>${title}</h3><p>${text}</p></article>`).join("")}</div>`;
export const intro = (tag, title, copy, img = "", alt = "") =>
  `<section class="page-intro${tag === "Pricing & policies" ? " pricing-intro" : ""}${img ? " has-banner" : " text-only"}"${img ? ` style="--banner-image:url('../images/${img}-960.webp');--banner-mobile:url('../images/${img}-640.webp')"` : ""}><div class="container${img ? " split" : ""}"><div><div class="breadcrumbs"><a href="../index.html">Home</a> / ${tag}</div><span class="eyebrow">${tag}</span><h1>${title}</h1><p class="lead">${copy}</p></div>${img ? photo(img, alt, "", "", true) : ""}</div></section>`;
export const section = (tag, title, body, theme = "") =>
  `<section class="section ${theme}"><div class="container"><div class="section-head"><div><span class="eyebrow">${tag}</span><h2>${title}</h2></div></div>${body}</div></section>`;
export const preview = () =>
  `<div class="workspace-preview"><div class="preview-head"><strong>Family workspace</strong><span class="status">Reference preview</span></div><div class="preview-assignment"><div><span class="meta muted">Student A · Grade 5</span><strong>North reference route</strong><span class="meta">Community stop → Reference school A</span></div><div class="time">7:14<small> AM</small></div></div><dl class="facts"><div><dt>Journey</dt><dd>Morning pickup</dd></div><div><dt>Latest reference record</dt><dd>School arrival · 7:38 AM</dd></div></dl><div class="preview-notice">Review the assigned stop before the next journey.</div><small class="tool-note">Fictional reference information. No live student or vehicle data.</small></div>`;
const pages = new Map();
export function add(file, id, title, description, content, kind = "public") {
  pages.set(file, { id, title, description, content, kind });
}

add(
  "index.html",
  "home",
  "A better school morning",
  "Clear routes, thoughtful school transport planning and useful parent information.",
  `
<section class="hero has-banner" style="--banner-image:url('../images/real/root-hero-960.webp');--banner-mobile:url('../images/real/root-hero-640.webp')"><div class="container"><div class="hero-grid"><div class="hero-copy"><span class="eyebrow">The school-day wayfinder</span><h1>The school day starts with a better journey.</h1><p class="lead">Clear routes, thoughtful transport planning, and the information families need from pickup to school arrival.</p><div class="button-row">${button("Explore routes", "routes.html")}${button("How it works", "how-it-works.html", true)}</div></div><div class="hero-picture"><img src="../assets/images/real/root-hero.webp" ${imageSize("real/root-hero")} alt="Complete yellow school bus waiting beside a curb" fetchpriority="high"><div class="photo-label"><span>Pickup point</span><i class="connection-line" aria-hidden="true"></i><span>School gate</span></div></div></div><div class="hero-foot"><a href="routes.html"><b class="marker">1</b> Find your route <span aria-hidden="true">↗</span></a><a href="parent-portal-registration.html"><b class="marker">2</b> Prepare for pickup <span aria-hidden="true">↗</span></a><a href="parent-dashboard.html"><b class="marker">3</b> Open parent workspace <span aria-hidden="true">↗</span></a></div></div></section>
<section class="section-sm subtle"><div class="container">${routeTool("home", "compact")}</div></section>
<section class="section"><div class="container home-services"><div><span class="eyebrow">A journey for every school day</span><h2>Different days.<br>The right kind of journey.</h2><p class="muted">Regular school travel, a later club finish or a day beyond the classroom.</p></div><div class="transport-directory">${[
    [
      "01",
      "Daily school transport",
      "Morning pickup and afternoon return.",
      "School days",
      "transport-services.html#daily-pickup",
    ],
    [
      "02",
      "After-school shuttles",
      "A clear plan for later departures.",
      "After dismissal",
      "transport-services.html#special-journeys",
    ],
    [
      "03",
      "Trips & group journeys",
      "Outbound, supervision and return planning.",
      "By arrangement",
      "transport-services.html#field-trips",
    ],
  ]
    .map(
      ([n, t, c, , url]) =>
        `<a href="${url}"><span class="number">${n}</span><div><h3>${t}</h3><p>${c}</p></div><span aria-hidden="true">↗</span></a>`,
    )
    .join("")}</div></div></section>
${section("The whole journey", "Four moments. One connected school day.", rail(), "ink")}
<section class="section"><div class="container split">${photo("real/boarding-routine", "Students boarding a bus from a paved waiting point", "A familiar waiting point and a clear boarding routine.")}<div><span class="eyebrow">Prepared before pickup</span><h2>Confidence comes from the details.</h2><p>Understand the checks and routines to discuss with your transport operator.</p><ul class="check-list"><li>Vehicle readiness and maintenance records</li><li>Driver verification and route preparation</li><li>Boarding and authorized handoff arrangements</li><li>Verified dispatch and emergency communication</li></ul><div class="button-row">${button("Explore safety", "safety-fleet.html", true)}</div></div></div></section>
<section class="section surface"><div class="container split"><div><span class="eyebrow">Your family, in the picture</span><h2>Less searching.<br>More useful information.</h2><p>Keep student, stop, schedule and journey notices together. Explore the parent workspace without signing in.</p>${button("Open Parent Dashboard", "parent-dashboard.html")}</div>${preview()}</div></section>
<section class="section"><div class="container split">${photo("real/fleet-depot", "School transport vehicles parked together at a depot")}<div><span class="eyebrow">Fleet &amp; environment</span><h2>The right vehicle for the journey.</h2><p>Vehicle suitability depends on passenger capacity, access, maintenance and the route itself. Ask your operator about vehicle checks and any environmental commitments.</p><p class="muted">Photography is representative stock imagery, not a claim about the KinderRide fleet.</p><a class="text-link" href="safety-fleet.html">What to ask about the fleet ↗</a></div></div></section>
${closing()}`,
);

add(
  "home2.html",
  "home2",
  "Your daily school journey",
  "Follow morning pickup, school arrival and afternoon return in a parent-focused journey.",
  `
<section class="page-intro has-banner" style="--banner-image:url('../images/premium/school-minibus-960.webp');--banner-mobile:url('../images/premium/school-minibus-640.webp')"><div class="container split"><div><div class="breadcrumbs"><a href="../index.html">Home</a> / Home 2</div><span class="eyebrow">For the everyday journey</span><h1>From the morning stop to the school gate.</h1><p class="lead">A clear view of what matters before pickup, at school arrival and on the way home.</p><div class="button-row">${button("Explore the journey", "#daily-journey")}${button("Find a route", "routes.html", true)}</div></div>${photo("premium/school-minibus", "Modern minibus ready for a group journey", "", "", true)}</div></section>
<section class="section" id="daily-journey"><div class="container"><div class="section-head"><div><span class="eyebrow">One day, three perspectives</span><h2>What happens next?</h2></div><p>Choose a stage to see the information and preparation that help the day run smoothly.</p></div><div class="journey-selector" data-journey-selector><div class="stage-tabs" role="tablist" aria-label="Journey stage" aria-orientation="horizontal">${["Morning pickup", "School arrival", "Afternoon return"].map((v, i) => `<button id="daily-tab-${i}" role="tab" data-stage="${i}" aria-selected="${i === 0}" aria-controls="daily-stage"><span class="stage-number" aria-hidden="true">0${i + 1}</span><span>${v}</span></button>`).join("")}</div><div class="stage-panel" id="daily-stage" role="tabpanel" data-stage-content aria-live="polite"></div></div></div></section>
<section class="section subtle"><div class="container split">${photo("real/school-arrival", "Students gathering beside school transport at a school entrance")}<div><span class="eyebrow">Boarding &amp; school handoff</span><h2>Small routines make the journey familiar.</h2><p>Practice the waiting point, boarding signal and collection arrangement together before the first school day.</p><ul class="check-list"><li>Use the agreed stop and school entrance</li><li>Keep belongings contained and aisles clear</li><li>Report changes through the confirmed contact</li></ul><a class="text-link" href="safety-features.html">The student safety guide ↗</a></div></div></section>
${section("Routes & stops", "See the sequence before you travel.", routeTool("home2"))}
<section class="section surface"><div class="container split">${preview()}<div><span class="eyebrow">Parent workspace</span><h2>The right context for each child.</h2><p>Switch between student profiles, review the assigned route, browse journey records and keep notices in one place.</p>${button("Visit the dashboard", "parent-dashboard.html")}</div></div></section>
${section(
  "Support along the way",
  "A clear next step when plans change.",
  policies([
    [
      "Before the journey",
      "Review service messages and confirm the school timetable.",
    ],
    [
      "During an active journey",
      "Use your operator’s verified dispatch channel. For immediate danger, contact local emergency services.",
    ],
  ]),
)}
${closing("Ready to plan your school routine?")}`,
);

const serviceOptions = [
  {
    id: "daily",
    name: "Daily school transport",
    tag: "01 / The school week",
    title: "A familiar route. Every school day.",
    description:
      "Morning pickup and afternoon return, planned around the school timetable and an agreed collection point.",
    image: "real/daily-route",
    alt: "A complete school bus travelling along a city street",
    facts: [
      ["Best for", "Regular school-day travel"],
      ["Plan ahead", "Area, school, travel days and direction"],
      ["Confirm together", "Pickup window and authorized collection"],
    ],
    cta: "Explore daily transport",
    href: "transport-services.html#daily-pickup",
  },
  {
    id: "activities",
    name: "After-school shuttles",
    tag: "02 / After the bell",
    title: "Make room for the rest of the day.",
    description:
      "Later travel for clubs, tutoring and supervised activities, with a clear departure and return arrangement.",
    image: "real/students-riding",
    alt: "Students travelling together inside a bus",
    facts: [
      ["Best for", "Clubs, activities and later dismissals"],
      ["Plan ahead", "Activity calendar and passenger list"],
      ["Confirm together", "Supervision and return collection"],
    ],
    cta: "Explore activity shuttles",
    href: "transport-services.html#special-journeys",
  },
  {
    id: "groups",
    name: "Trips & group journeys",
    tag: "03 / Beyond the classroom",
    title: "The return plan starts before you leave.",
    description:
      "School visits, sports and educational trips with the destination, passenger needs and return journey considered together.",
    image: "premium/group-coach",
    alt: "Modern coach and passenger luggage prepared for a group journey",
    facts: [
      ["Best for", "School visits, sports and group travel"],
      ["Plan ahead", "Date, destination and passenger count"],
      ["Confirm together", "Access, chaperones and dispatch contact"],
    ],
    cta: "Explore group transport",
    href: "transport-services.html#field-trips",
  },
];
add(
  "services.html",
  "services",
  "School transport services",
  "Choose daily school transport, after-school shuttles or group journeys and see the details that matter.",
  `
<section class="service-catalog"><div class="container"><div class="breadcrumbs"><a href="../index.html">Home</a> / Services</div><div class="service-heading"><div><span class="eyebrow">Three ways to get there</span><h1>School travel, built around your day.</h1></div><p>Every journey needs a different plan. Choose the service that fits your school routine.</p></div>
<div data-service-selector><div class="service-tabs" role="tablist" aria-label="Transport services">${serviceOptions.map((s, i) => `<button id="tab-${s.id}" role="tab" type="button" data-service-tab="${i}" aria-selected="${i === 0}" aria-controls="service-${s.id}"><span class="service-tab-index">0${i + 1}</span><span>${s.name}</span><span class="service-tab-arrow" aria-hidden="true">↗</span></button>`).join("")}</div>
${serviceOptions.map((s, i) => `<article class="service-panel" id="service-${s.id}" role="tabpanel" aria-labelledby="tab-${s.id}" data-service-panel="${i}"${i ? " hidden" : ""}><div class="service-panel-photo">${photo(s.image, s.alt, "", "", i === 0)}<div class="service-photo-caption"><span>${s.tag}</span><span>School transport</span></div></div><div class="service-panel-copy"><h2>${s.title}</h2><p>${s.description}</p><dl class="service-facts">${s.facts.map(([a, b]) => `<div><dt>${a}</dt><dd>${b}</dd></div>`).join("")}</dl>${button(s.cta, s.href)}</div></article>`).join("")}
</div></div></section>
<section class="section surface"><div class="container service-enquiry"><div><span class="eyebrow">Before we confirm</span><h2>Start with the journey.<br>We’ll help with the details.</h2><p>Have your school, pickup area, travel days and preferred start date ready. Availability, vehicle suitability and the final timetable are confirmed by the operator.</p>${button("Prepare a transport enquiry", "contact.html")}</div><div class="service-guide-links">${[
    ["Route coverage", "Find an area, school and stop.", "routes.html"],
    ["Safety & fleet", "Know what to ask before travel.", "safety-fleet.html"],
    [
      "Registration guide",
      "Prepare the right family information.",
      "parent-portal-registration.html",
    ],
    [
      "Pricing & policies",
      "Understand coverage and written terms.",
      "pricing-policies.html",
    ],
  ]
    .map(
      ([t, c, u]) =>
        `<a href="${u}"><strong>${t}</strong><span>${c}</span><b aria-hidden="true">↗</b></a>`,
    )
    .join("")}</div></div></section>`,
);

add(
  "transport-services.html",
  "transport",
  "Transport details",
  "Coverage, enrollment, schedules and suitability for each school transport service.",
  `
${intro("Transport details", "Plan the journey around the school day.", "A useful transport plan connects the service type, school, stop, schedule and collection arrangement.", "safety/bus-stop", "School bus on a tree-lined route")}
${section(
  "Daily pickup & drop-off",
  "Build a dependable school-week routine.",
  `<div id="daily-pickup">${scope([
    [
      "Coverage",
      "Confirm the home area, school, travel days and morning or return direction. Door-adjacent collection depends on safe access.",
    ],
    [
      "Enrollment",
      "Share guardian contacts, the requested start date and any accessibility or handoff needs.",
    ],
    [
      "Suitability",
      "A regular timetable works best when the school calendar and the assigned stop are consistent.",
    ],
  ])}</div>`,
)}
<section class="section subtle" id="special-journeys"><div class="container split">${photo("home/bus-forest", "School bus on a wooded road")}<div><span class="eyebrow">After-school activities</span><h2>The school day does not always end at the bell.</h2><p>Activity shuttles need a confirmed dismissal time, an approved passenger list and a return collection plan.</p><ul class="check-list"><li>Match travel days to the club or tutoring calendar</li><li>Confirm who supervises students before departure</li><li>Share late changes through the agreed contact</li></ul></div></div></section>
${section(
  "Field trips & groups",
  "Make the return plan part of the trip.",
  `<div id="field-trips">${policies([
    [
      "Journey brief",
      "Provide the date, destination, pickup and return windows, passenger count and trip lead.",
    ],
    [
      "Access & supervision",
      "Confirm suitable vehicle capacity, accessibility, destination parking, chaperones and emergency contacts.",
    ],
  ])}<div class="button-row">${button("Enquire about a school trip", "contact.html")}</div></div>`,
)}
${section("From request to assignment", "Confirm the practical details.", rail())}
${closing("Which school journey are you planning?")}`,
);

add(
  "routes.html",
  "routes",
  "Route Finder",
  "Find reference school routes, inspect stop sequences and ask about real coverage.",
  `
<section class="task-page"><div class="container"><div class="task-heading"><div class="breadcrumbs"><a href="../index.html">Home</a> / Routes & stops</div><span class="eyebrow">Routes & stops</span><h1>Find a route that fits the school day.</h1><p class="lead">Choose the area, school and journey direction. Then explore the stop sequence and timetable.</p></div><div class="routes-workbench"><div data-route-auto>${routeTool("routes", "search")}</div><aside class="coverage-aside">${photo("routes/bus-signal", "School bus travelling through a city neighborhood")}<div><h2>A different school or stop?</h2><p>Share the school, neighborhood and travel days to ask about coverage.</p><a class="text-link" href="contact.html">Request your area ↗</a></div></aside></div><div class="assignment-strip"><h2>Before you enroll</h2><p><strong>Route:</strong> School, direction and assigned stop.</p><p><strong>Timetable:</strong> Confirmed pickup and return windows.</p><p><strong>Handoff:</strong> Authorized collection and verified contact.</p></div></div></section>`,
);

add(
  "safety-fleet.html",
  "fleet",
  "Safety & fleet",
  "Understand vehicle readiness, driver preparation and transport safeguards.",
  `
${intro("Student safety & fleet", "Care begins before the journey.", "Ask about the people, vehicle checks and handoff routines behind your school transport service.", "real/fleet-detail", "School bus windscreen and warning light details")}
${section(
  "Readiness, not just reassurance",
  "Know what to ask about.",
  scope([
    [
      "Driver preparation",
      "Request information about licensing, screening, safeguarding and emergency training required in the operating area.",
    ],
    [
      "Vehicle condition",
      "Ask for maintenance and pre-trip inspection information, including exits, mirrors, lights and equipment.",
    ],
    [
      "School coordination",
      "Confirm the arrival entrance, dismissal arrangements and authorized student collection process.",
    ],
  ]),
)}
<section class="section surface"><div class="container split">${photo("common/bus-interior", "Rows of seats and an aisle inside a bus")}<div><span class="eyebrow">Onboard safeguards</span><h2>Useful technology needs clear procedures.</h2><div class="compact-list">${[
    [
      "GPS information",
      "Ask whether location sharing is available, who can access it and how a delay is communicated.",
    ],
    [
      "Security cameras",
      "Confirm whether cameras are installed and how footage access, retention and privacy are managed.",
    ],
    [
      "Emergency notices",
      "Use the operator’s verified communication and escalation arrangements.",
    ],
  ]
    .map(
      (a, i) =>
        `<article><span class="number">0${i + 1}</span><div><h3>${a[0]}</h3><p>${a[1]}</p></div></article>`,
    )
    .join("")}</div></div></div></section>
${closing("Prepare the student, too.", "Review waiting, boarding, seating and collection routines.", "Read the safety guide", "safety-features.html")}`,
);

add(
  "safety-features.html",
  "safety",
  "Student safety guide",
  "Practical school-bus routines for students and families.",
  `
${intro("The student safety guide", "Familiar habits. More confident journeys.", "Review the stop, boarding signal, seating instructions and collection arrangement together.", "routes/bus-parked", "School bus parked before departure")}
${section("From waiting to arrival", "Practice the whole journey.", rail())}
${section(
  "At the stop",
  "Wait where the driver can see you.",
  policies([
    [
      "Before boarding",
      "Use the assigned stop, arrive in time and stay away from the vehicle approach. Wait for the bus to stop and the driver or attendant to signal.",
    ],
    [
      "During the ride",
      "Use the assigned seat and any required restraint. Keep bags contained, the aisle clear and exits unobstructed.",
    ],
    [
      "When leaving",
      "Follow the handrail and exit instructions. Move to the agreed collection area and follow the authorized handoff.",
    ],
    [
      "If plans change",
      "Do not follow or approach a moving bus after a missed pickup. Use the operator’s confirmed support channel.",
    ],
  ]),
  "surface",
)}
${closing("Keep verified contacts close.", "For immediate danger, contact local emergency services first.", "Contact & dispatch")}`,
);

add(
  "parent-portal-registration.html",
  "portal",
  "Registration guide",
  "Prepare route eligibility, guardian details and the transport confirmation process.",
  `
${intro("Parent registration", "A clear first step for your family.", "Prepare the information needed to assess route eligibility and agree the right journey.", "real/school-entrance", "Students with backpacks arriving at a school entrance")}
${section(
  "Before you begin",
  "Only the information the journey needs.",
  policies([
    [
      "School & travel days",
      "School name, requested start date and morning, return or daily coverage.",
    ],
    [
      "Pickup & collection",
      "Home area, proposed stop and authorized collection arrangements.",
    ],
    [
      "Guardian contacts",
      "A reply contact and any approved alternative collector. Share sensitive details only through secure operator channels.",
    ],
    [
      "Journey support",
      "Discuss accessibility or assistance needs directly with the transport team.",
    ],
  ]),
)}
${section(
  "The registration sequence",
  "Request. Review. Confirm.",
  `<div class="compact-list">${[
    [
      "Check eligibility",
      "Confirm whether the school and area have suitable coverage.",
    ],
    [
      "Prepare the family details",
      "Gather student, guardian and collection information. Initial account creation does not need sensitive student data.",
    ],
    ["Agree the plan", "Review direction, service days, terms and any quote."],
    [
      "Receive the assignment",
      "Confirm route, stop, timetable and start date before travel.",
    ],
  ]
    .map(
      (a, i) =>
        `<article><span class="marker">${i + 1}</span><div><h3>${a[0]}</h3><p>${a[1]}</p></div></article>`,
    )
    .join("")}</div>`,
  "surface",
)}
${section(
  "Parent information",
  "Keep the assignment in context.",
  scope([
    [
      "Student & route",
      "Use the correct profile, school, stop and travel direction.",
    ],
    [
      "Digital pass & notices",
      "Availability of bus passes, GPS and emergency notices depends on the operator’s connected systems.",
    ],
    [
      "Plans & records",
      "Review coverage and journey records through the approved parent service.",
    ],
  ]),
)}
${closing("Have a registration question?", "Begin with the school and pickup area, without sharing sensitive student details.", "Prepare an enquiry")}`,
);

const planComparison = () =>
  `<p class="muted pricing-note">Example monthly fares per student for school-day return travel. These age bands and amounts are for review; the operator confirms route availability, final fares and eligibility.</p><div class="plan-grid">${ageRates.map((rate, i) => `<article class="plan${i === 1 ? " featured" : ""}"><span class="eyebrow">${rate.ages}</span><h3>${rate.label}</h3><p class="price">₹${rate.price.toLocaleString("en-IN")} <small>/ student / month</small></p><ul><li>Morning pickup and afternoon return</li><li>Travel from the assigned stop</li><li>School-calendar journeys</li></ul>${button("Check route availability", "routes.html", i !== 1)}</article>`).join("")}</div>`;
const estimator = () =>
  `<form class="estimator" data-estimator><div><h3>Explore an example estimate.</h3><p class="meta muted">Example age-based monthly fares: ₹500 for ages 3–5, ₹1,000 for ages 6–10, and ₹1,500 for ages 11–17, per student. Not an official quote. For siblings in different age bands, calculate each band separately.</p><div class="estimator-fields"><div class="field"><label for="estimate-age">Student age band</label><select id="estimate-age" name="ageBand">${ageRates.map((rate) => `<option value="${rate.id}"${rate.id === "primary" ? " selected" : ""}>${rate.ages} · ₹${rate.price.toLocaleString("en-IN")}</option>`).join("")}</select></div><div class="field"><label for="estimate-students">Students in this age band</label><input id="estimate-students" name="students" type="number" min="1" max="8" value="1"></div><div class="field"><label for="estimate-months">Months</label><input id="estimate-months" name="months" type="number" min="1" max="12" value="1"></div></div></div><div><span class="meta">Illustrative total</span><output aria-live="polite">₹1,000</output></div></form>`;
add(
  "pricing-policies.html",
  "pricing",
  "Pricing & policies",
  "Review example age-based school transport fares and the conditions to confirm before enrollment.",
  `
${intro("Pricing & policies", "Choose the journeys your week needs.", "Explore example monthly fares from ₹500 to ₹1,500 by student age. Confirm your route, final rate and service conditions before enrollment.", "premium/pricing-bus", "Complete yellow school bus parked beside trees")}
${section("Example monthly pricing", "A simple starting point for every age.", planComparison())}
${section(
  "Before you confirm",
  "The full picture, in plain language.",
  policies([
    [
      "Rates & sibling savings",
      "Request the full quote, including eligibility, taxes and any additional charges.",
    ],
    [
      "Changes & cancellation",
      "Confirm notice periods, effective dates and refund rules before committing.",
    ],
    [
      "Payments & receipts",
      "Use only approved payment channels. Ask about billing dates and official receipts. This website does not process payment.",
    ],
    [
      "Bus rules",
      "Use the assigned stop, follow seating instructions, keep aisles clear and respect the collection arrangement.",
    ],
  ]),
  "surface",
)}
${closing("Find the route for your school day?")}`,
);
add(
  "subscription-plans.html",
  "plans",
  "Coverage & estimates",
  "Explore how student age, the number of students and months affect an illustrative transport estimate.",
  `
<section class="task-page"><div class="container"><div class="task-heading"><div class="breadcrumbs"><a href="../index.html">Home</a> / Coverage & estimates</div><span class="eyebrow">Plan for the school week</span><h1>Understand the coverage before the cost.</h1><p class="lead">Choose an age band, the number of students in that band and the months you need.</p></div>${estimator()}<div class="assignment-strip"><h2>Choose the journey</h2><p><strong>Single Journey</strong>One daily direction, morning or afternoon.</p><p><strong>Daily Return</strong>Morning pickup and afternoon travel.</p><p><strong>Family Return</strong>Sibling coverage, with eligibility confirmed together.</p></div><div class="estimate-next"><div><h2>A useful estimate starts with the route.</h2><p>Actual rates depend on the school, pickup area, travel days, availability and the operator’s written terms.</p></div>${button("Compare coverage & policies", "pricing-policies.html", true)}</div></div></section>`,
);

add(
  "about.html",
  "about",
  "About KinderRide Transit",
  "A family-centered approach to connecting routes, schools and the everyday journey.",
  `
<section class="about-opening"><div class="container"><div class="breadcrumbs"><a href="../index.html">Home</a> / About us</div><div class="about-title"><div><span class="eyebrow">About KinderRide</span><h1>Good school days start with clear connections.</h1></div><p>Between home and the school gate, families need a familiar routine and information they can use.</p></div><div class="about-audiences">${photo("real/school-day", "Students with backpacks arriving together at school", "", "", true)}<div><span class="eyebrow">One connected school day</span>${[
    ["Families", "Know the stop, the schedule and what to prepare."],
    ["Schools", "Coordinate arrival, dismissal and the student handoff."],
    [
      "Transport teams",
      "Keep assignments, route information and communication together.",
    ],
  ]
    .map(
      ([t, c], i) =>
        `<article><span class="number">0${i + 1}</span><div><h2>${t}</h2><p>${c}</p></div></article>`,
    )
    .join("")}</div></div></div></section>
<section class="section surface"><div class="container split">${photo("real/field-trip", "Children boarding a coach with adult supervision")}<div><span class="eyebrow">Our approach</span><h2>Clarity is part of the care.</h2><p>A good transport plan gives each family a clear next step before the journey begins.</p><dl class="principle-list"><div><dt>A familiar place</dt><dd>An agreed stop and school entrance.</dd></div><div><dt>A shared routine</dt><dd>Boarding, seating and collection arrangements.</dd></div><div><dt>A useful update</dt><dd>The right information for the right student.</dd></div></dl><a class="text-link" href="how-it-works.html">See how the journey comes together ↗</a></div></div></section>${closing("Let’s connect the school day.")}`,
);

add(
  "how-it-works.html",
  "how",
  "How it works",
  "From a route enquiry to school transport assignment and daily use.",
  `
${intro("How it works", "A few clear steps. A more familiar journey.", "Start with the route, prepare the family information and agree the details before the first pickup.", "real/driver-view", "View of the road from a bus driver’s seat")}
${section(
  "The path to pickup",
  "Start here, then move forward.",
  `<div class="compact-list">${[
    [
      "Find a route",
      "Choose an area, school and journey direction. Use reference routes to explore the interface and ask about real coverage.",
      "routes.html",
    ],
    [
      "Prepare a request",
      "Gather service days, start date, guardian contacts and collection needs.",
      "parent-portal-registration.html",
    ],
    [
      "Confirm the assignment",
      "The operator reviews capacity and agrees the stop, timetable, plan and terms.",
      "pricing-policies.html",
    ],
    [
      "Prepare for travel",
      "Practice the stop and boarding routine together and keep verified contacts available.",
      "safety-features.html",
    ],
  ]
    .map(
      (a, i) =>
        `<article><span class="marker">${i + 1}</span><div><h3>${a[0]}</h3><p>${a[1]}</p><a class="text-link" href="${a[2]}">Find out more ↗</a></div></article>`,
    )
    .join("")}</div>`,
)}
${section("Every school day", "The routine continues beyond pickup.", rail(), "subtle")}${closing()}`,
);

const faqs = [
  [
    "routes",
    "How do I find a suitable school route?",
    "Use the Route Finder to explore the reference interface, then enquire with your school and pickup area. Only the operator can confirm active coverage and capacity.",
  ],
  [
    "routes",
    "What if my area or school is not listed?",
    "Request coverage through Contact. Include the school, neighborhood, journey direction and travel days, without unnecessary student details.",
  ],
  [
    "routes",
    "Can I choose a different pickup point?",
    "Ask the operator to review vehicle access, stop safety and the collection arrangement before changing an assigned stop.",
  ],
  [
    "safety",
    "What should my child know before boarding?",
    "Use the assigned stop, stand away from traffic, wait for the bus to stop and follow the driver or attendant’s signal.",
  ],
  [
    "safety",
    "Does every vehicle have GPS or cameras?",
    "Equipment and access depend on the operator. Ask for confirmed information about availability, privacy, retention and emergency communication.",
  ],
  [
    "plans",
    "Are the prices on the estimator official rates?",
    "No. The estimate explorer uses clearly labelled illustrative rates. Request a route-specific quote and approved terms before enrolling.",
  ],
  [
    "plans",
    "How do sibling discounts work?",
    "Ask about family eligibility, route conditions and how any discount appears on the written quote.",
  ],
  [
    "account",
    "Can I use the dashboard without signing in?",
    "Yes. The directly accessible reference workspace uses fictional records. It is not a secured student database or live tracking service.",
  ],
  [
    "account",
    "Will the enquiry form send my message?",
    "No. It prepares a local preview and downloadable draft for you to share through a verified operator channel.",
  ],
  [
    "account",
    "Can I sign in using Google or Apple?",
    "Google and Apple sign-in are awaiting activation by the transport operator. Until account services are available, the buttons explain that sign-in is unavailable.",
  ],
];
add(
  "faq.html",
  "faq",
  "Frequently asked questions",
  "Search school transport questions by route, safety, plan and account.",
  `${intro("Parent questions", "A clear answer for the next step.", "Browse practical guidance about routes, travel routines, plans and the parent experience.")}<section class="section"><div class="container" data-search-group><div class="search-toolbar"><input type="search" aria-label="Search questions" placeholder="Search your question…">${[
    ["all", "All questions"],
    ["routes", "Routes"],
    ["safety", "Safety"],
    ["plans", "Plans"],
    ["account", "Parent tools"],
  ]
    .map(
      ([id, t], i) =>
        `<button class="filter" data-category="${id}" aria-pressed="${i === 0}">${t}</button>`,
    )
    .join(
      "",
    )}</div><div class="faq-list">${faqs.map(([cat, q, a]) => `<details data-search-item="${cat}"><summary>${q}</summary><p>${a}</p></details>`).join("")}</div><div class="empty-state" data-search-empty hidden>No questions match. Try another term or <a href="contact.html">prepare an enquiry</a>.</div></div></section>${closing("Still have a question?")}`,
);

add(
  "case-studies.html",
  "proof",
  "Service scenarios & proof",
  "Understand the planning and evidence behind common school transport needs.",
  `${intro("Service scenarios & proof", "Look beyond the journey description.", "These educational scenarios explain common transport needs. They are not published customer success stories.", "real/case-study", "School buses viewed through a window")}${section(
    "Three practical scenarios",
    "Different needs. Deliberate planning.",
    scope([
      [
        "The daily neighborhood route",
        "Match the school timetable, accessible stop, seat capacity and authorized collector. Useful evidence: the assignment and handoff record.",
      ],
      [
        "The after-school journey",
        "Coordinate dismissal, supervision, passenger list and return timing. Useful evidence: the activity timetable and route confirmation.",
      ],
      [
        "The school group trip",
        "Plan destination access, capacity, chaperones and dispatch. Useful evidence: the trip brief and manifest.",
      ],
    ]),
  )}${section(
    "Service evidence",
    "Ask for the record behind the reassurance.",
    policies([
      [
        "Route information",
        "Approved schools, stops, calendars and assignment changes.",
      ],
      ["Vehicle information", "Maintenance status and inspection summaries."],
      [
        "People & responsibilities",
        "Driver qualification information and assigned supervision roles.",
      ],
      [
        "Journey records",
        "Recorded arrivals, exceptions and follow-up actions.",
      ],
    ]),
    "surface",
  )}${closing()}`,
);

const articles = [
  [
    "routes",
    "Preparing for a new school route",
    "Check the stop, school calendar and collection arrangement before the first journey.",
    "routes.html",
  ],
  [
    "safety",
    "The waiting point matters",
    "Build a familiar waiting and boarding routine with your child.",
    "safety-features.html",
  ],
  [
    "family",
    "A family checklist for enrollment",
    "Gather the information needed for a route request without oversharing sensitive data.",
    "parent-portal-registration.html",
  ],
  [
    "safety",
    "What to ask about the vehicle",
    "Understand inspection, maintenance and safeguard questions to discuss with an operator.",
    "safety-fleet.html",
  ],
  [
    "family",
    "Choosing one journey or a return plan",
    "Compare coverage against your school-week routine and ask for the full quote.",
    "pricing-policies.html",
  ],
  [
    "routes",
    "Planning an educational group trip",
    "Start with the date, destination, passenger count and the return journey.",
    "transport-services.html#field-trips",
  ],
];
add(
  "blog.html",
  "blog",
  "The school-day journal",
  "Practical school transport guidance for parents and schools.",
  `${intro("The school-day journal", "Useful reading for the road ahead.", "Thoughtful guidance for planning, preparing and understanding the school journey.", "real/city-service", "School bus beneath trees in a city neighborhood")}
<section class="section"><div class="container" data-search-group><div class="search-toolbar"><input type="search" aria-label="Search articles" placeholder="Search the journal…">${[
    ["all", "All guides"],
    ["routes", "Routes"],
    ["safety", "Safety"],
    ["family", "Families"],
  ]
    .map(
      ([id, t], i) =>
        `<button class="filter" data-category="${id}" aria-pressed="${i === 0}">${t}</button>`,
    )
    .join(
      "",
    )}</div><div class="journal-grid">${articles.map(([cat, title, desc, href]) => `<article class="journal-card" data-search-item="${cat}"><span class="eyebrow">${cat}</span><h2>${title}</h2><p>${desc}</p><a class="text-link" href="${href}">Read the guide ↗</a></article>`).join("")}</div><p class="empty-state" data-search-empty hidden>No guides match your search.</p></div></section>${closing()}`,
);

add(
  "contact.html",
  "contact",
  "Contact & route enquiries",
  "Prepare a clear school transport request and download an unsent enquiry draft.",
  `
<section class="task-page"><div class="container"><div class="task-heading"><div class="breadcrumbs"><a href="../index.html">Home</a> / Contact & dispatch</div><span class="eyebrow">Let’s get the details right</span><h1>Let’s plan your school journey.</h1><p class="lead">Start with the school, pickup area and the service you need.</p></div><div class="contact-workbench"><aside class="contact-context">${photo("real/route-support", "A complete school transport vehicle travelling through a city", "", "", true)}<div class="contact-guidance"><h2>Before you write</h2><p>Include travel days and the requested start date. Leave out private student schedules, medical records and exact home addresses.</p><h2>An active journey concern?</h2><p>Use the verified dispatch number supplied with your assignment. For immediate danger, contact local emergency services.</p></div></aside><form class="enquiry-form" data-enquiry aria-labelledby="enquiry-title"><h2 id="enquiry-title">Your journey details</h2><div class="form-grid"><div class="field"><label for="enquiry-name">Your name</label><input id="enquiry-name" name="name" autocomplete="name" required></div><div class="field"><label for="enquiry-email">Reply email</label><input id="enquiry-email" name="email" type="email" autocomplete="email" required></div><div class="field full"><label for="enquiry-topic">What can we help with?</label><select id="enquiry-topic" name="topic"><option>Route &amp; stop availability</option><option>Daily transport</option><option>After-school shuttle</option><option>Field trip or group journey</option><option>Registration</option><option>Pricing &amp; policies</option><option>School partnership</option></select></div><div class="field full"><label for="enquiry-message">Your question</label><textarea id="enquiry-message" name="message" required placeholder="School, neighborhood, service days and what you need to confirm."></textarea></div><div class="full"><button class="button" type="submit">Prepare my enquiry →</button><p class="form-note">Creates a local draft to share with your operator. Nothing is sent from this page.</p></div></div><div data-enquiry-preview hidden><p role="status" class="form-status"></p><pre></pre><button class="button secondary" data-download-draft type="button">Download draft</button></div></form></div></div></section>`,
);

for (const [file, id, title, paras] of [
  [
    "privacy.html",
    "privacy",
    "Privacy & your family’s information",
    [
      [
        "What this frontend stores",
        "Theme, text direction and reference dashboard preferences are stored in this browser. The enquiry preview is not transmitted.",
      ],
      [
        "Children’s information",
        "Do not enter real children’s sensitive information into the reference workspace. Actual student records require secured services and appropriate access controls.",
      ],
      [
        "External services",
        "Locally hosted fonts and photos do not require remote image or font requests. Authentication, dispatch and payment providers are not connected.",
      ],
      [
        "Before operational use",
        "The operator must publish a reviewed privacy policy identifying its controller, processors, retention, lawful basis and verified contact.",
      ],
    ],
  ],
  [
    "terms.html",
    "terms",
    "Terms of this frontend experience",
    [
      [
        "Information and availability",
        "Reference routes, fictional student records and labelled example estimates are not confirmed operational service information.",
      ],
      [
        "Accounts and payments",
        "No authentication provider or payment gateway is connected. Local validation does not sign in, create an account or process a payment.",
      ],
      [
        "Playback and receipts",
        "Route playback is a simulation. Downloaded reference receipts are marked as drafts and are not proof of payment.",
      ],
      [
        "Operator terms",
        "Actual service rates, calendars, eligibility, cancellation rules, safeguards and support commitments must be confirmed with the transport operator.",
      ],
    ],
  ],
])
  add(
    file,
    id,
    title,
    title,
    `${intro("Information", title, "A straightforward explanation of this website and the boundaries of the reference experience.")}<section class="section"><div class="container legal">${paras.map(([h, p]) => `<h2>${h}</h2><p>${p}</p>`).join("")}</div></section>`,
  );
add(
  "404.html",
  "404",
  "This stop is not on the route",
  "Find your way back to KinderRide Transit.",
  `<section class="utility"><div><span class="eyebrow">404 / A different direction</span><h1>This stop is not on the route.</h1><p>Let’s get you back to a familiar starting point.</p>${button("Back to Home 1", "../index.html")}</div></section>`,
);
add(
  "coming-soon.html",
  "coming",
  "More school-day guidance",
  "Find current KinderRide guidance and transport information.",
  `<section class="utility"><div><span class="eyebrow">Your next stop</span><h1>The useful information is already here.</h1><p>Explore school transport guidance and the current parent resources.</p>${button("Browse the journal", "blog.html")}</div></section>`,
);

// Auth and dashboard content are maintained separately, with no public shell.
await import("./workspace-pages.mjs").then((m) =>
  m.register(add, photo, imageSize),
);

function documentHTML(file, p) {
  const root = file === "index.html",
    prefix = root ? "" : "../";
  let content = p.content;
  if (root)
    content = content
      .replaceAll("../assets/", "assets/")
      .replace(
        /href="(?!#|https?:|mailto:|\.\.\/)([^"]+\.html(?:#[^"]*)?)"/g,
        'href="pages/$1"',
      );
  const extra =
    p.kind === "auth" ? "auth" : p.kind === "dashboard" ? "dashboard" : "";
  return `<!doctype html>\n<html lang="en" dir="ltr">\n<head>\n  <meta charset="utf-8">\n  <meta name="viewport" content="width=device-width,initial-scale=1">\n  <title>${p.title} | KinderRide Transit</title>\n  <meta name="description" content="${p.description}">\n  <meta property="og:title" content="${p.title} | KinderRide Transit">\n  <meta property="og:type" content="website">\n  <link rel="icon" href="${prefix}assets/images/brand/favicon.svg?v=${version}">\n  <link rel="canonical" href="https://teknritsolutions-2.github.io/School-Bus-Student-Transport-Service/${root ? "index.html" : "pages/" + file}">\n  <script>try{document.documentElement.dataset.theme=JSON.parse(localStorage.getItem('kinderride:wayfinder:v1:theme'))||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.dir=JSON.parse(localStorage.getItem('kinderride:wayfinder:v1:dir'))||'ltr'}catch{document.documentElement.dataset.theme='light'}</script>\n  ${["fonts", "style", "dark-mode", "rtl", ...(extra ? [extra] : [])].map((c) => `<link rel="stylesheet" href="${prefix}assets/css/${c}.css?v=${version}">`).join("\n  ")}\n</head>\n<body data-page="${p.id}"${extra ? ` class="${extra}-body"` : ""}>\n${p.kind === "public" ? "<div data-site-header></div>" : ""}\n<main id="main-content">\n${content}\n</main>\n${p.kind === "public" ? "<div data-site-footer></div>" : ""}\n${p.kind === "dashboard" ? `<script src="${prefix}assets/js/plugins/jspdf.umd.min.js"></script>\n` : ""}<script type="module" src="${prefix}assets/js/${p.kind === "dashboard" ? "dashboard" : "main"}.js?v=${version}"></script>\n</body>\n</html>\n`;
}
for (const [file, p] of pages)
  fs.writeFileSync(
    file === "index.html" ? file : "pages/" + file,
    documentHTML(file, p),
  );
console.log(`Built ${pages.size} physical HTML pages.`);
