// Authoring helper. Output is ordinary physical HTML; no runtime build is required.
import fs from "node:fs";
const version = "wayfinder-1";
const imageDimensions = JSON.parse(
  fs.readFileSync(new URL("./image-dimensions.json", import.meta.url), "utf8"),
);
const imageSize = (src) =>
  `width="${imageDimensions[src].width}" height="${imageDimensions[src].height}"`;
export const photo = (src, alt, caption = "", extra = "") =>
  `<figure class="editorial-photo ${extra}"><img src="../assets/images/${src}.webp" ${imageSize(src)} alt="${alt}" loading="lazy">${caption ? `<figcaption>${caption}</figcaption>` : ""}</figure>`;
export const button = (label, file, secondary = false) =>
  `<a class="button${secondary ? " secondary" : ""}" href="${file}">${label} <span aria-hidden="true">→</span></a>`;
export const rail = () =>
  `<ol class="journey-rail"><li><strong>Pickup stop</strong><p>A familiar place, an agreed time.</p></li><li><strong>Boarding</strong><p>Wait for the signal, then step aboard.</p></li><li><strong>School arrival</strong><p>A coordinated handoff at school.</p></li><li><strong>Afternoon return</strong><p>The same care on the way home.</p></li></ol>`;
export const routeTool = (id = "route") =>
  `<div class="route-tool"><div class="route-tool-head"><h2>Find your route.</h2><p>Explore reference routes to understand the journey. Actual schools, stops and availability are confirmed by the operator.</p></div><form data-route-finder><div class="finder-fields"><div class="field"><label for="${id}-area">Area</label><select name="area" id="${id}-area"><option value="">All reference areas</option></select></div><div class="field"><label for="${id}-school">School</label><select name="school" id="${id}-school"><option value="">All reference schools</option></select></div><div class="field"><label for="${id}-journey">Journey</label><select name="journey" id="${id}-journey"><option>Morning pickup</option><option>Afternoon return</option></select></div><button class="button" type="submit">Find a route →</button></div></form><div data-route-results aria-live="polite" hidden></div><small class="tool-note">Reference route data, not confirmed service coverage. <a href="contact.html">Request your area</a>.</small></div>`;
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
  `<section class="page-intro${img ? "" : " text-only"}"><div class="container${img ? " split" : ""}"><div><div class="breadcrumbs"><a href="../index.html">Home</a> / ${tag}</div><span class="eyebrow">${tag}</span><h1>${title}</h1><p class="lead">${copy}</p></div>${img ? photo(img, alt, "", "portrait-photo") : ""}</div></section>`;
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
<section class="hero"><div class="container"><div class="hero-grid"><div class="hero-copy"><span class="eyebrow">The school-day wayfinder</span><h1>The school day starts with a better journey.</h1><p class="lead">Clear routes, thoughtful transport planning, and the information families need from pickup to school arrival.</p><div class="button-row">${button("Explore routes", "routes.html")}${button("How it works", "how-it-works.html", true)}</div></div><div class="hero-picture"><img src="../assets/images/real/root-hero.webp" ${imageSize("real/root-hero")} alt="Complete yellow school bus waiting beside a curb" fetchpriority="high"><div class="photo-label"><span>01 — A good place to start.</span><span>Home → School</span></div></div></div><div class="hero-foot"><span><b class="marker">1</b> Find the route</span><span><b class="marker">2</b> Prepare for pickup</span><span><b class="marker">3</b> Stay informed</span></div></div></section>
<section class="section-sm mint"><div class="container">${routeTool("home")}</div></section>
${section("A journey for every school day", "One routine. More ways to travel.", `<div class="feature-service"><div class="feature-service-copy"><span class="eyebrow">01 / Daily school transport</span><h3>From the neighborhood to the school gate.</h3><p>Morning pickup and afternoon return with an assigned stop, a school timetable and a clear collection arrangement.</p>${button("Daily transport", "transport-services.html#daily-pickup")}</div><div class="compact-list"><article><span class="number">02</span><div><h3>After-school shuttles</h3><p>Later travel for clubs, tutoring and supervised activities.</p><a class="text-link" href="transport-services.html#special-journeys">Activity transport ↗</a></div></article><article><span class="number">03</span><div><h3>Trips beyond the classroom</h3><p>Group journeys with passenger, supervision and return plans.</p><a class="text-link" href="transport-services.html#field-trips">School trips ↗</a></div></article></div></div>`)}
${section("The whole journey", "Four moments. One connected school day.", rail(), "ink")}
<section class="section"><div class="container split">${photo("safety/bus-ready", "School bus parked before a journey")}<div><span class="eyebrow">Prepared before pickup</span><h2>Confidence comes from the details.</h2><p>Understand the checks and routines to discuss with your transport operator.</p><ul class="check-list"><li>Vehicle readiness and maintenance records</li><li>Driver verification and route preparation</li><li>Boarding and authorized handoff arrangements</li><li>Verified dispatch and emergency communication</li></ul><div class="button-row">${button("Explore safety", "safety-fleet.html", true)}</div></div></div></section>
<section class="section surface"><div class="container split"><div><span class="eyebrow">Your family, in the picture</span><h2>Less searching.<br>More useful information.</h2><p>Keep student, stop, schedule and journey notices together. Explore the parent workspace without signing in.</p>${button("Open Parent Dashboard", "parent-dashboard.html")}</div>${preview()}</div></section>
<section class="section"><div class="container split">${photo("real/fleet-row", "Rows of real school buses with mirrors and windscreens visible", "", "portrait-photo")}<div><span class="eyebrow">Fleet &amp; environment</span><h2>The right vehicle for the journey.</h2><p>Vehicle suitability depends on passenger capacity, access, maintenance and the route itself. Ask your operator about vehicle checks and any environmental commitments.</p><p class="muted">Photography is representative stock imagery, not a claim about the KinderRide fleet.</p><a class="text-link" href="safety-fleet.html">What to ask about the fleet ↗</a></div></div></section>
${closing()}`,
);

add(
  "home2.html",
  "home2",
  "Your daily school journey",
  "Follow morning pickup, school arrival and afternoon return in a parent-focused journey.",
  `
<section class="page-intro"><div class="container split"><div><div class="breadcrumbs"><a href="../index.html">Home</a> / Home 2</div><span class="eyebrow">For the everyday journey</span><h1>From the morning stop to the school gate.</h1><p class="lead">A clear view of what matters before pickup, at school arrival and on the way home.</p><div class="button-row">${button("Explore the journey", "#daily-journey")}${button("Find a route", "routes.html", true)}</div></div>${photo("real/field-trip", "Children boarding a bus with adult supervision")}</div></section>
<section class="section" id="daily-journey"><div class="container"><div class="section-head"><div><span class="eyebrow">One day, three perspectives</span><h2>What happens next?</h2></div><p>Choose a stage to see the information and preparation that help the day run smoothly.</p></div><div class="journey-selector" data-journey-selector><div class="stage-tabs" role="tablist" aria-label="Journey stage" aria-orientation="horizontal">${["Morning pickup", "School arrival", "Afternoon return"].map((v, i) => `<button role="tab" data-stage="${i}" aria-selected="${i === 0}" aria-controls="daily-stage">${v}</button>`).join("")}</div><div class="stage-panel" id="daily-stage" role="tabpanel" data-stage-content aria-live="polite"></div><ol class="journey-rail"><li><strong>Morning pickup</strong><p>Prepare at the stop.</p></li><li><strong>School arrival</strong><p>Complete the handoff.</p></li><li><strong>Afternoon return</strong><p>Follow the collection plan.</p></li></ol></div></div></section>
<section class="section mint"><div class="container split">${photo("real/school-arrival", "Students gathering beside school transport at a school entrance")}<div><span class="eyebrow">Boarding &amp; school handoff</span><h2>Small routines make the journey familiar.</h2><p>Practice the waiting point, boarding signal and collection arrangement together before the first school day.</p><ul class="check-list"><li>Use the agreed stop and school entrance</li><li>Keep belongings contained and aisles clear</li><li>Report changes through the confirmed contact</li></ul><a class="text-link" href="safety-features.html">The student safety guide ↗</a></div></div></section>
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

add(
  "services.html",
  "services",
  "School transport services",
  "Daily school transport, activity shuttles and group journeys, with practical details.",
  `
${intro("Transport services", "Every school journey has its own rhythm.", "Choose daily pickup, later activity travel or a group journey. Start with what your school day needs.", "real/register", "A complete school bus viewed from the front")}
<section class="section"><div class="container"><article class="service-photo-row">${photo("real/daily-route", "A complete school bus travelling along a city street")}<div><span class="eyebrow">01 / Home to school</span><h2>The everyday school run.</h2><p>Morning pickup and afternoon return organized around an assigned stop and school timetable.</p><p class="muted">Consider the pickup area, travel days, waiting routine and authorized collection arrangement.</p>${button("Daily transport details", "transport-services.html#daily-pickup")}</div></article><article class="service-photo-row reverse">${photo("real/students-riding", "Students travelling together inside a bus")}<div><span class="eyebrow">02 / After the bell</span><h2>Room for the rest of the day.</h2><p>Later departures for clubs, tutoring and supervised activities.</p><p class="muted">Confirm dismissal time, the passenger list, the return route and the collection contact.</p>${button("After-school shuttles", "transport-services.html#special-journeys")}</div></article><article class="service-photo-row">${photo("home/bus-road", "School transport vehicle travelling on a road")}<div><span class="eyebrow">03 / Beyond the classroom</span><h2>A journey for shared discoveries.</h2><p>Educational visits, sports and school group travel with an outbound and return plan.</p><p class="muted">Plan capacity, destination access, accessibility, chaperones and dispatch arrangements.</p>${button("Trips & group transport", "transport-services.html#field-trips")}</div></article></div></section>
${section(
  "Before you choose",
  "Get the details that matter.",
  `<div class="directory">${[
    [
      "Safety & fleet",
      "Driver preparation, vehicle checks and onboard safeguards.",
      "safety-fleet.html",
    ],
    [
      "Parent registration",
      "Student, guardian and route-request information.",
      "parent-portal-registration.html",
    ],
    [
      "Pricing & policies",
      "Coverage, sibling eligibility and billing questions.",
      "pricing-policies.html",
    ],
    [
      "Service scenarios",
      "The planning behind common transport needs.",
      "case-studies.html",
    ],
  ]
    .map(
      (a, i) =>
        `<a href="${a[2]}"><span class="number">0${i + 1}</span><div><h3>${a[0]}</h3><p>${a[1]}</p></div><span>↗</span></a>`,
    )
    .join("")}</div>`,
  "surface",
)}
${closing()}`,
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
<section class="section mint" id="special-journeys"><div class="container split">${photo("home/bus-forest", "School bus on a wooded road", "", "portrait-photo")}<div><span class="eyebrow">After-school activities</span><h2>The school day does not always end at the bell.</h2><p>Activity shuttles need a confirmed dismissal time, an approved passenger list and a return collection plan.</p><ul class="check-list"><li>Match travel days to the club or tutoring calendar</li><li>Confirm who supervises students before departure</li><li>Share late changes through the agreed contact</li></ul></div></div></section>
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
  "Filter reference school routes, inspect stops and compare journey directions.",
  `
${intro("Routes & stops", "A clearer route to the school day.", "Filter by area, school and direction. Read the stop sequence before asking about availability.", "routes/bus-signal", "School bus at a city intersection")}
${section("Route Finder", "Start with the school and the stop.", routeTool("routes"))}
${section(
  "Before enrollment",
  "What a confirmed assignment includes.",
  scope([
    ["The route", "School, travel days, direction and assigned stop."],
    [
      "The timetable",
      "Agreed pickup and return windows and how changes are communicated.",
    ],
    [
      "The handoff",
      "Waiting position, authorized collection and the verified dispatch contact.",
    ],
  ]),
  "surface",
)}
${closing("Your area is not listed?", "Share your school, area and travel days.", "Request coverage")}`,
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
${intro("Parent registration", "A clear first step for your family.", "Prepare the information needed to assess route eligibility and agree the right journey.", "real/route-wait", "Two students waiting on a rural route")}
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
  `<div class="plan-grid">${[
    [
      "Single Journey",
      "One daily direction.",
      [
        "Morning pickup or afternoon return",
        "One student",
        "Subject to route availability",
      ],
    ],
    [
      "Daily Return",
      "The full school day.",
      [
        "Morning and afternoon journeys",
        "One student",
        "School-calendar coverage",
      ],
    ],
    [
      "Family Return",
      "Coverage for siblings.",
      [
        "Multiple student assignments",
        "Eligibility confirmed together",
        "Ask about sibling discounts",
      ],
    ],
  ]
    .map(
      (a, i) =>
        `<article class="plan${i === 1 ? " featured" : ""}"><span class="eyebrow">0${i + 1} / Coverage</span><h3>${a[0]}</h3><p>${a[1]}</p><ul>${a[2].map((x) => `<li>${x}</li>`).join("")}</ul>${button("Request a quote", "contact.html", i !== 1)}</article>`,
    )
    .join("")}</div>`;
const estimator = () =>
  `<form class="estimator" data-estimator><div><h3>Explore an example estimate.</h3><p class="meta muted">Illustrative monthly rates only: ₹1,850 single, ₹2,950 return, ₹4,950 for two-student family coverage. Not an official quote.</p><div class="estimator-fields"><div class="field"><label for="estimate-plan">Coverage</label><select id="estimate-plan" name="plan"><option value="single">Single Journey</option><option value="daily" selected>Daily Return</option><option value="family">Family Return</option></select></div><div class="field"><label for="estimate-students">Students</label><input id="estimate-students" name="students" type="number" min="1" max="8" value="1"></div><div class="field"><label for="estimate-months">Months</label><input id="estimate-months" name="months" type="number" min="1" max="12" value="1"></div></div></div><div><span class="meta">Illustrative total</span><output aria-live="polite">₹2,950</output></div></form>`;
add(
  "pricing-policies.html",
  "pricing",
  "Pricing & policies",
  "Compare school transport coverage and review terms before requesting a quote.",
  `
${intro("Pricing & policies", "Choose the journeys your week needs.", "Compare coverage first. Confirm the actual route, rate, discount eligibility and service conditions before enrollment.", "plans/bus-city", "School bus travelling between city buildings")}
${section("Coverage comparison", "One direction, both ways, or the family.", planComparison())}
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
${closing("Ready for a route-specific quote?")}`,
);
add(
  "subscription-plans.html",
  "plans",
  "Coverage & estimates",
  "Compare coverage options and calculate a clearly marked example estimate.",
  `
${intro("Coverage & estimates", "Plan for the school week.", "Review the coverage categories and explore an example estimate. Final prices are confirmed by the operator.", "real/subscription", "Front of a school bus")}
${section("Coverage options", "A plan for your routine.", planComparison())}
${section("Estimate explorer", "Understand how coverage changes the total.", estimator(), "surface")}${closing()}`,
);

add(
  "about.html",
  "about",
  "About KinderRide Transit",
  "Our approach to clear, family-centered school transport information.",
  `
${intro("About KinderRide", "The school morning deserves a clearer way.", "KinderRide brings the route, the school day and family information into one thoughtfully organized transport experience.", "about/bus-urban", "School bus in an urban school neighborhood")}
${section(
  "Our approach",
  "Clarity is part of the journey.",
  scope([
    ["For families", "Understand the stop, the schedule and what to prepare."],
    ["For schools", "Coordinate arrival and dismissal with a clear handoff."],
    [
      "For transport teams",
      "Connect assignments, route information and verified support channels.",
    ],
  ]),
)}
<section class="section mint"><div class="container split">${photo("real/school-ready", "Students holding textbooks beside a school bus")}<div><span class="eyebrow">School-day confidence</span><h2>Information that respects a family’s attention.</h2><p>Useful details should be easy to find, comfortable to read and connected to the right student and journey.</p><p>Our approach favors clear routes, practical guidance and straightforward next steps over noise or unsupported claims.</p><a class="text-link" href="how-it-works.html">See the journey from the start ↗</a></div></div></section>
${closing("Let’s connect the school day.")}`,
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
${section("Every school day", "The routine continues beyond pickup.", rail(), "mint")}${closing()}`,
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
    "Provider options are displayed, but no authentication provider is connected. They do not create or sign in to an account.",
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
  "Prepare a local school transport enquiry and download a request draft.",
  `${intro("Contact & dispatch", "Every good journey starts with a question.", "Tell us the school, area and service you have in mind. Prepare a clear request to share with your transport operator.", "real/services-hero", "Rear of a school bus under a clear sky")}
<section class="section"><div class="container split"><div><span class="eyebrow">Let’s get the details right</span><h2>Prepare your transport enquiry.</h2><p>Use a guardian reply contact. Do not include private student schedules, medical records or exact pickup addresses in this public interface.</p><p class="notice">This form creates a local draft. It does not send a message or store your entries.</p><div class="compact-list"><article><span class="number">01</span><div><h3>General questions</h3><p>Include the school, area, travel days and requested start date.</p></div></article><article><span class="number">02</span><div><h3>Active journey</h3><p>Use the verified dispatch number provided with your assignment. For immediate danger, contact local emergency services.</p></div></article></div></div><form class="enquiry-form" data-enquiry><div class="form-grid"><div class="field"><label for="enquiry-name">Your name</label><input id="enquiry-name" name="name" autocomplete="name" required></div><div class="field"><label for="enquiry-email">Reply email</label><input id="enquiry-email" name="email" type="email" autocomplete="email" required></div><div class="field full"><label for="enquiry-topic">What can we help with?</label><select id="enquiry-topic" name="topic"><option>Route &amp; stop availability</option><option>Daily transport</option><option>After-school shuttle</option><option>Field trip or group journey</option><option>Registration</option><option>Pricing &amp; policies</option><option>School partnership</option></select></div><div class="field full"><label for="enquiry-message">Your question</label><textarea id="enquiry-message" name="message" required placeholder="School, neighborhood, service days and what you need to confirm."></textarea></div><div class="full"><button class="button" type="submit">Preview my enquiry →</button></div></div><div data-enquiry-preview hidden><p role="status" class="form-status"></p><pre></pre><button class="button secondary" data-download-draft type="button">Download draft</button></div></form></div></section>`,
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
  m.register(add, preview, button),
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
  return `<!doctype html>\n<html lang="en" dir="ltr">\n<head>\n  <meta charset="utf-8">\n  <meta name="viewport" content="width=device-width,initial-scale=1">\n  <title>${p.title} | KinderRide Transit</title>\n  <meta name="description" content="${p.description}">\n  <meta property="og:title" content="${p.title} | KinderRide Transit">\n  <meta property="og:type" content="website">\n  <link rel="icon" href="${prefix}assets/images/brand/favicon.svg">\n  <link rel="canonical" href="https://teknritsolutions-2.github.io/School-Bus-Student-Transport-Service/${root ? "index.html" : "pages/" + file}">\n  <script>try{document.documentElement.dataset.theme=JSON.parse(localStorage.getItem('kinderride:wayfinder:v1:theme'))||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.dir=JSON.parse(localStorage.getItem('kinderride:wayfinder:v1:dir'))||'ltr'}catch{document.documentElement.dataset.theme='light'}</script>\n  ${["fonts", "style", "dark-mode", "rtl", ...(extra ? [extra] : [])].map((c) => `<link rel="stylesheet" href="${prefix}assets/css/${c}.css?v=${version}">`).join("\n  ")}\n</head>\n<body data-page="${p.id}"${extra ? ` class="${extra}-body"` : ""}>\n${p.kind === "public" ? "<div data-site-header></div>" : ""}\n<main id="main-content">\n${content}\n</main>\n${p.kind === "public" ? "<div data-site-footer></div>" : ""}\n${p.kind === "dashboard" ? `<script src="${prefix}assets/js/plugins/jspdf.umd.min.js"></script>\n` : ""}<script type="module" src="${prefix}assets/js/${p.kind === "dashboard" ? "dashboard" : "main"}.js?v=${version}"></script>\n</body>\n</html>\n`;
}
for (const [file, p] of pages)
  fs.writeFileSync(
    file === "index.html" ? file : "pages/" + file,
    documentHTML(file, p),
  );
console.log(`Built ${pages.size} physical HTML pages.`);
