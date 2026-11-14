export function register(add, photo, imageSize) {
  const mark = `<span class="brand-symbol" aria-hidden="true"><i></i><i></i><i></i></span><span>KinderRide<small>TRANSIT</small></span>`;
  const field = (id, label, type = "text", extra = "") =>
    `<div class="field"><label for="${id}">${label}</label>${type === "password" ? `<div class="password-control"><input id="${id}" name="${id.replace("auth-", "")}" type="password" minlength="8" required ${extra}><button type="button" data-password-toggle aria-label="Show password">Show</button></div>` : `<input id="${id}" name="${id.replace("auth-", "")}" type="${type}" required ${extra}>`}</div>`;
  for (const create of [false, true]) {
    const background = create ? "premium/signup-bus" : "about/bus-urban";
    const title = create ? "Create your parent account." : "Welcome back.";
    add(
      create ? "register.html" : "login.html",
      create ? "register" : "login",
      create ? "Create an account" : "Parent login",
      "Sign in to your KinderRide parent account or create an account for your family.",
      `
<div class="auth-scene" aria-hidden="true"><img src="../assets/images/${background}.webp" ${imageSize(background, "100vw")} alt="" fetchpriority="high"></div><div class="auth-wrap"><section class="auth-card"><a class="brand auth-brand" href="../index.html" aria-label="KinderRide Transit Home 1">${mark}</a><span class="eyebrow">Parent account</span><h1>${title}</h1><p data-auth-description>${create ? "A simpler start to your family’s school journey." : "Your family’s transport information, thoughtfully connected."}</p><form data-auth-form>
${create ? field("auth-name", "Parent / guardian name", "text", 'autocomplete="name"') : ""}
${field("auth-email", "Email address", "email", 'autocomplete="email"')}
${field("auth-password", create ? "Create password" : "Password", "password", `autocomplete="${create ? "new-password" : "current-password"}"`)}
${create ? field("auth-confirm", "Confirm password", "password", 'autocomplete="new-password"') : `<div class="auth-options"><label><input type="checkbox" name="remember"> Remember me</label><button type="button" class="plain-button" data-forgot>Forgot password?</button></div>`}
${create ? '<label class="auth-terms"><input type="checkbox" required> <span>I agree to the <a href="terms.html">terms</a> and <a href="privacy.html">privacy information</a>.</span></label>' : ""}
<button class="button auth-submit" type="submit">${create ? "Create Account" : "Sign In"} →</button><p class="form-status" role="status" data-auth-status></p></form><div class="auth-divider"><span>or continue with</span></div><div class="auth-providers"><button class="button secondary" data-provider="Google" type="button"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M22 12.2c0-.7-.1-1.4-.2-2.2H12v4.1h5.6a4.8 4.8 0 0 1-2.1 3.1v2.6h3.4c2-1.8 3.1-4.4 3.1-7.6Z"/><path fill="#34A853" d="M12 22c2.8 0 5.2-.9 6.9-2.5l-3.4-2.6c-.9.6-2.1 1-3.5 1-2.7 0-5-1.8-5.8-4.3H2.7v2.7A10.4 10.4 0 0 0 12 22Z"/><path fill="#FBBC05" d="M6.2 13.6a6.2 6.2 0 0 1 0-3.2V7.7H2.7a10 10 0 0 0 0 8.6l3.5-2.7Z"/><path fill="#EA4335" d="M12 6.1c1.5 0 2.8.5 3.8 1.5l2.9-2.9A10 10 0 0 0 2.7 7.7l3.5 2.7C7 7.9 9.3 6.1 12 6.1Z"/></svg> Google</button><button class="button secondary" data-provider="Apple" type="button"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17 3c-2 0-4 2-4 4 2 0 4-2 4-4ZM16 8c-2 0-2 1-4 1s-2-1-4-1c-6 0-5 11-1 13 2 1 3-1 5-1s3 2 5 1c2-1 3-4 3-4-4-2-4-6-1-8-1-1-2-1-3-1Z"/></svg> Apple</button></div><p class="auth-switch">${create ? 'Already have an account? <a href="login.html">Sign in</a>' : 'New to KinderRide? <a href="register.html">Create an account</a>'}</p></section></div>`,
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
