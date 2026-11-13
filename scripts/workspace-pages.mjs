export function register(add) {
  const mark = `<span class="brand-symbol" aria-hidden="true"><i></i><i></i><i></i></span><span>KinderRide<small>TRANSIT</small></span>`;
  const field = (id, label, type = "text", extra = "") =>
    `<div class="field"><label for="${id}">${label}</label>${type === "password" ? `<div class="password-control"><input id="${id}" name="${id.replace("auth-", "")}" type="password" minlength="8" required ${extra}><button type="button" data-password-toggle aria-label="Show password">Show</button></div>` : `<input id="${id}" name="${id.replace("auth-", "")}" type="${type}" required ${extra}>`}</div>`;
  for (const create of [false, true]) {
    const title = create ? "Create your parent account." : "Welcome back.";
    add(
      create ? "register.html" : "login.html",
      create ? "register" : "login",
      create ? "Create an account" : "Parent login",
      "Standalone parent account interface with clearly unconnected authentication.",
      `
<div class="auth-wrap"><a class="brand auth-brand" href="../index.html" aria-label="KinderRide Transit Home 1">${mark}</a><section class="auth-card"><span class="eyebrow">Parent account</span><h1>${title}</h1><p>${create ? "Start with your guardian details. Student information belongs in a secured registration process." : "Your family’s transport information, thoughtfully connected."}</p><form data-auth-form>
${create ? field("auth-name", "Parent / guardian name", "text", 'autocomplete="name"') : ""}
${field("auth-email", "Email address", "email", 'autocomplete="email"')}
${field("auth-password", create ? "Create password" : "Password", "password", `autocomplete="${create ? "new-password" : "current-password"}"`)}
${create ? field("auth-confirm", "Confirm password", "password", 'autocomplete="new-password"') : `<div class="auth-options"><label><input type="checkbox" name="remember"> Remember me</label><button type="button" class="plain-button" data-forgot>Forgot password?</button></div>`}
${create ? '<label class="auth-terms"><input type="checkbox" required> <span>I agree to the <a href="terms.html">terms</a> and <a href="privacy.html">privacy information</a>.</span></label>' : ""}
<button class="button auth-submit" type="submit">${create ? "Create Account" : "Sign In"} →</button><p class="form-status" role="status" data-auth-status></p></form><div class="auth-divider"><span>or continue with</span></div><div class="auth-providers"><button class="button secondary" data-provider="Google" type="button"><b aria-hidden="true">G</b> Google</button><button class="button secondary" data-provider="Apple" type="button"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17 3c-2 0-4 2-4 4 2 0 4-2 4-4ZM16 8c-2 0-2 1-4 1s-2-1-4-1c-6 0-5 11-1 13 2 1 3-1 5-1s3 2 5 1c2-1 3-4 3-4-4-2-4-6-1-8-1-1-2-1-3-1Z"/></svg> Apple</button></div><p class="auth-switch">${create ? 'Already have an account? <a href="login.html">Sign in</a>' : 'New to KinderRide? <a href="register.html">Create an account</a>'}</p><small class="auth-boundary">Account services are not connected. No sign-in or account creation is performed.</small></section><a class="text-link auth-dashboard" href="parent-dashboard.html">Explore the Parent Dashboard ↗</a></div>`,
      "auth",
    );
  }
  add(
    "parent-dashboard.html",
    "dashboard",
    "Parent Dashboard",
    "An organized reference parent workspace with student selection, route playback, records and draft receipts.",
    `<div data-dashboard-root></div>`,
    "dashboard",
  );
}
