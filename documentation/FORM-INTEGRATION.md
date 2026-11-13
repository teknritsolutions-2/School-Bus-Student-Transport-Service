# Integrations and current behavior

Contact uses `data-enquiry` in `pages/contact.html`; `assets/js/forms.js` prepares a local text preview and downloadable unsent draft. It makes no submission request. To connect a backend, replace that handler with validated delivery and show success only after the server confirms receipt. Keep the authoring helper consistent if regenerating pages.

Login, Register, provider and recovery controls explicitly report that account services are unconnected. They neither save passwords nor redirect after validation. Connect a secure identity provider and server-side sessions before presenting successful sign-in or restricting real student records.

Production services still needed:

- Approved routes, schools, stops, timetables, capacity, rates and operator contact details.
- Authenticated student/guardian records with appropriate permissions; no child data in public source or browser-local storage.
- Authorized fleet telemetry for live vehicle positions and validated coordinates for geographic maps.
- Dispatch, alerts and notification delivery, with approved response expectations.
- A payment gateway, verified billing records and official receipts.
- Reviewed policies, legal/business information and approved customer case studies.

The current reference playback is deliberately separate from historical records. Never feed its events into operational logs. The draft PDF generator must remain labelled until connected to verified payments.
