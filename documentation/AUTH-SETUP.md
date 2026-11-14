# Activate parent authentication

The owner confirmed that no identity service is configured yet. The site now includes the official Supabase JavaScript SDK (2.119.0), loaded locally only when public configuration is present. Until activation, submitting an account form or selecting a provider gives an unavailable-service message. It never simulates a successful login.

1. Create a Supabase project. Put its HTTPS project URL and **publishable** key in `assets/js/auth-config.js`. Never put a service-role key, Google client secret or Apple signing key in this repository.
2. Enable email/password and configure mail delivery. Enable Google and Apple under Authentication → Providers, following the [Google setup](https://supabase.com/docs/guides/auth/social-sign-in/auth-google) and [Apple setup](https://supabase.com/docs/guides/auth/social-sign-in/auth-apple). Register the Supabase callback URL shown by that project with each provider. Provider secrets belong in the hosted provider settings.
3. Set the Site URL to `https://teknritsolutions-2.github.io/School-Bus-Student-Transport-Service/`. Add these exact [allowed redirects](https://supabase.com/docs/guides/auth/redirect-urls):
   - `https://teknritsolutions-2.github.io/School-Bus-Student-Transport-Service/pages/login.html`
   - `https://teknritsolutions-2.github.io/School-Bus-Student-Transport-Service/pages/login.html?mode=recovery`
4. Publish the public configuration. Test signup confirmation, email/password login, both provider consent flows, cancellation, password recovery and Exit with actual test accounts on the published domain.

The integration uses PKCE. Provider buttons navigate to the configured project's OAuth authorization endpoint; the provider returns to Login, where the SDK exchanges the code and the server validates the user before dashboard navigation. Passwords are never saved by application code. Remember me selects persistent browser storage; otherwise sessions use tab storage. Exit signs out locally before returning home.

The public dashboard contains fictional reference information and remains publicly accessible. Connecting real family records requires server-side authorization and row-level policies; a browser redirect is not access control. Real provider completion cannot be verified until the owner configures the project and providers.
