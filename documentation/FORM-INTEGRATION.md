# Form Integration

The contact, route finder, and coming-soon forms validate and respond locally. They do not transmit information.

## Formspree

1. Create a Formspree form and copy its endpoint.
2. On the contact form in `pages/contact.html`, remove `data-local-form`.
3. Add `action="https://formspree.io/f/YOUR_ID"` and `method="post"`.
4. Ensure every field has a `name` attribute.
5. Remove or adapt the local submit handler in `assets/js/forms.js` if you want an AJAX submission.

## Netlify Forms

1. On the contact form, remove `data-local-form`.
2. Add `name="contact"`, `method="post"`, and `data-netlify="true"`.
3. Add `<input type="hidden" name="form-name" value="contact">` inside the form.
4. Deploy to Netlify and verify the form appears in the site dashboard.

## Production validation

Browser validation is not a security boundary. Validate and sanitize all submissions on the receiving service, add spam protection, publish an accurate privacy notice, and avoid requesting unnecessary student information.

## Authentication and payments

The login, registration, and payment experiences are deliberate front-end simulations. Connect a secure server-side identity provider and payment processor for production. Never collect credentials or payment card data with only client-side JavaScript.
