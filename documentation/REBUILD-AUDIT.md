# Wayfinder rebuild audit

Baseline: `f07c110950399b9bc2db43aab7fe8cf17dc18ea3`, retained as branch `archive/pre-wayfinder-f07c110`.

## Inventory and baseline behavior

23 physical HTML files: two homes, about, services, transport details, routes, two safety pages, parent registration information, pricing, subscriptions, how it works, FAQ, scenarios, blog, contact, two authentication pages, parent dashboard, two legal pages, 404 and coming soon.

Shared presentation used style.css (4,000+ lines), dark-mode.css, rtl.css and services.css with competing overrides. Main.js combined data, navigation, storage, authentication, form validation and mapping. Dashboard.js handled nine views, student switching, local logs/notices, plans, route movement and jsPDF receipts.

## Reuse / replace

- Reuse the two-route/four-stop model, journey directions, three plan categories, URL resolution, local preferences and jsPDF download concept.
- Refactor route matching: no fallback when filters conflict.
- Remove fictional geographic coordinates from public visualization. Reference routes use explicitly labelled stop sequences; approved positions are required for a production map.
- Rebuild all HTML and CSS. Preserve existing URLs. Retain real licensed photography selectively; never repeat a content photo.
- Rebuild dashboard views and authentication. Never persist passwords, register a fictional account, redirect after local validation, or report password reset as sent.
- Isolate playback events in memory. Historical records and notifications are not written by simulation.
- Use a fresh storage namespace so previous playback-generated records cannot contaminate the new workspace.
- Replace unsupported blog statistics and false operational assertions with practical guidance.

## Architecture references

Travel repository: physical pages, configuration separated from page interactions, sticky header, responsive drawer and local fonts.
Yoga repository: dashboard-specific styling and navigation, readable content widths, responsive workspace.
Mobile repair repository: image-before-copy mobile ordering and layout reflow instead of small typography.

## External integrations still needed

Approved operating data, secure authentication/OAuth and password recovery, protected student records, fleet location feed, dispatch and emergency messaging, payment gateway, official billing, enquiry delivery, legal review and approved customer case studies. The frontend does not claim these connections exist.
