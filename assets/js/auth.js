import { AUTH_CONFIG } from "./auth-config.js?v=schoolday-amber-1";
import { assetUrl, pageUrl } from "./site-config.js";

const unavailable =
  "Sign-in is not available yet. Please contact your transport operator.";
let clientPromise;
export const authConfigured = () =>
  Boolean(AUTH_CONFIG.url && AUTH_CONFIG.publishableKey);

async function client() {
  if (!authConfigured()) throw new Error(unavailable);
  const project = new URL(AUTH_CONFIG.url);
  if (project.protocol !== "https:")
    throw new Error("The account service must use HTTPS.");
  if (!clientPromise)
    clientPromise = (async () => {
      if (!window.supabase)
        await new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = assetUrl("js/plugins/supabase.umd.min.js");
          script.onload = resolve;
          script.onerror = () =>
            reject(
              new Error(
                "The account service could not load. Please try again.",
              ),
            );
          document.head.append(script);
        });
      const storage = {
        getItem: (key) =>
          localStorage.getItem("kinderride:remember-account") === "true"
            ? localStorage.getItem(key)
            : sessionStorage.getItem(key),
        setItem: (key, value) => {
          const remember =
            localStorage.getItem("kinderride:remember-account") === "true";
          (remember ? sessionStorage : localStorage).removeItem(key);
          (remember ? localStorage : sessionStorage).setItem(key, value);
        },
        removeItem: (key) => {
          localStorage.removeItem(key);
          sessionStorage.removeItem(key);
        },
      };
      return window.supabase.createClient(
        project.origin,
        AUTH_CONFIG.publishableKey,
        {
          auth: {
            flowType: "pkce",
            persistSession: true,
            detectSessionInUrl: true,
            autoRefreshToken: true,
            storage,
            storageKey: "kinderride:account",
          },
        },
      );
    })().catch((error) => {
      clientPromise = undefined;
      throw error;
    });
  return clientPromise;
}
const check = (result) => {
  if (result.error) throw result.error;
  return result.data;
};
async function enterWorkspace(api) {
  const data = check(await api.auth.getUser());
  if (!data.user) throw new Error("Please complete sign-in before continuing.");
  location.assign(pageUrl("parent-dashboard.html"));
}
export async function signInProvider(provider) {
  if (!["Google", "Apple"].includes(provider))
    throw new Error("Unsupported sign-in provider.");
  const api = await client();
  check(
    await api.auth.signInWithOAuth({
      provider: provider.toLowerCase(),
      options: { redirectTo: pageUrl("login.html") },
    }),
  );
}
export async function submitAccount(form) {
  if (form.dataset.authMode !== "recovery" && form.elements.remember)
    localStorage.setItem(
      "kinderride:remember-account",
      String(form.elements.remember.checked),
    );
  const api = await client();
  if (form.dataset.authMode === "recovery") {
    check(
      await api.auth.updateUser({ password: form.elements.password.value }),
    );
    await enterWorkspace(api);
    return "";
  }
  if (form.elements.name) {
    const data = check(
      await api.auth.signUp({
        email: form.elements.email.value.trim(),
        password: form.elements.password.value,
        options: {
          data: { display_name: form.elements.name.value.trim() },
          emailRedirectTo: pageUrl("login.html"),
        },
      }),
    );
    if (data.session) await enterWorkspace(api);
    return "Check your email to confirm your account before signing in.";
  }
  check(
    await api.auth.signInWithPassword({
      email: form.elements.email.value.trim(),
      password: form.elements.password.value,
    }),
  );
  await enterWorkspace(api);
  return "";
}
export async function recoverAccount(email) {
  const api = await client();
  const callback = new URL(pageUrl("login.html"));
  callback.searchParams.set("mode", "recovery");
  check(
    await api.auth.resetPasswordForEmail(email, { redirectTo: callback.href }),
  );
  return "If an account matches this email, you will receive password reset instructions.";
}
export async function finishAccountRedirect() {
  if (!authConfigured()) return;
  const query = new URLSearchParams(location.search);
  if (query.has("error") || query.has("error_description")) {
    history.replaceState(null, "", location.pathname);
    throw new Error(
      "Sign-in was cancelled or could not be completed. Please try again.",
    );
  }
  if (!query.has("code")) return;
  const api = await client();
  const data = check(await api.auth.getSession());
  if (!data.session)
    throw new Error("Your sign-in link has expired. Please start again.");
  check(await api.auth.getUser());
  history.replaceState(null, "", location.pathname);
  if (query.get("mode") === "recovery") return "recovery";
  await enterWorkspace(api);
}
export async function exitAccount() {
  if (authConfigured()) {
    const api = await client();
    check(await api.auth.signOut({ scope: "local" }));
  }
  location.assign(pageUrl("index.html"));
}
