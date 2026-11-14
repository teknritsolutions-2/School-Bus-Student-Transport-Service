import { plans } from "./transport-data.js";
import { money } from "./site-config.js";
import {
  submitAccount,
  signInProvider,
  recoverAccount,
  finishAccountRedirect,
} from "./auth.js?v=schoolday-amber-1";
export function initForms() {
  const authCard = document.querySelector(".auth-card");
  const authStatus = authCard?.querySelector("[data-auth-status]");
  async function accountAction(action) {
    if (!authCard || authCard.dataset.pending === "true") return;
    authCard.dataset.pending = "true";
    authStatus.textContent = "Please wait…";
    const controls = [...authCard.querySelectorAll("button,input")];
    controls.forEach((control) => (control.disabled = true));
    try {
      authStatus.textContent = (await action()) || "";
    } catch (error) {
      authStatus.textContent =
        error.message || "Sign-in could not be completed. Please try again.";
    } finally {
      controls.forEach((control) => (control.disabled = false));
      delete authCard.dataset.pending;
    }
  }
  document.querySelectorAll("[data-password-toggle]").forEach((b) =>
    b.addEventListener("click", () => {
      const i = b.parentElement.querySelector("input");
      i.type = i.type === "password" ? "text" : "password";
      b.textContent = i.type === "password" ? "Show" : "Hide";
      b.setAttribute(
        "aria-label",
        `${i.type === "password" ? "Show" : "Hide"} password`,
      );
    }),
  );
  document.querySelectorAll("[data-auth-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const c = form.elements.confirm;
      c?.setCustomValidity(
        c.value !== form.elements.password.value ? "Passwords must match." : "",
      );
      if (!form.reportValidity()) return;
      accountAction(() => submitAccount(form));
    });
    form.elements.confirm?.addEventListener("input", () =>
      form.elements.confirm.setCustomValidity(""),
    );
    form.elements.password?.addEventListener("input", () =>
      form.elements.confirm?.setCustomValidity(""),
    );
    form.addEventListener("input", (event) => {
      if (["password", "confirm"].includes(event.target.name))
        form.elements.confirm?.setCustomValidity("");
    });
  });
  document.querySelectorAll("[data-provider]").forEach((b) =>
    b.addEventListener("click", () => {
      accountAction(() => signInProvider(b.dataset.provider));
    }),
  );
  document.querySelector("[data-forgot]")?.addEventListener("click", () => {
    const email = document.querySelector("[data-auth-form]").elements.email;
    if (email.reportValidity())
      accountAction(() => recoverAccount(email.value.trim()));
  });
  if (authCard)
    finishAccountRedirect()
      .then((mode) => {
        if (mode !== "recovery") return;
        const form = authCard.querySelector("form");
        form.dataset.authMode = "recovery";
        form.elements.email.closest(".field").hidden = true;
        form.elements.email.required = false;
        authCard.querySelector("h1").textContent = "Choose a new password.";
        authCard.querySelector("[data-auth-description]").textContent =
          "Use at least eight characters.";
        form.querySelector('label[for="auth-password"]').textContent =
          "New password";
        form.elements.password.autocomplete = "new-password";
        form.querySelector("[type=submit]").textContent = "Save password";
        if (!form.elements.confirm)
          form
            .querySelector("[type=submit]")
            .insertAdjacentHTML(
              "beforebegin",
              '<div class="field"><label for="recovery-confirm">Confirm password</label><input id="recovery-confirm" name="confirm" type="password" minlength="8" autocomplete="new-password" required></div>',
            );
        authCard
          .querySelectorAll(
            ".auth-options,.auth-providers,.auth-divider,.auth-switch",
          )
          .forEach((element) => (element.hidden = true));
        form.elements.password.focus();
      })
      .catch((error) => {
        authStatus.textContent = error.message;
      });
  document.querySelectorAll("[data-enquiry]").forEach((form) => {
    let draft = "";
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const v = new FormData(form);
      draft = `KinderRide transport enquiry\n\nName: ${v.get("name")}\nReply email: ${v.get("email")}\nTopic: ${v.get("topic")}\n\n${v.get("message")}\n\nLocal draft — not sent.`;
      const p = form.querySelector("[data-enquiry-preview]");
      p.hidden = false;
      p.querySelector("pre").textContent = draft;
      p.querySelector('[role="status"]').textContent =
        "Your draft is ready. It has not been sent.";
    });
    form
      .querySelector("[data-download-draft]")
      ?.addEventListener("click", () => {
        if (!draft) return;
        const url = URL.createObjectURL(
            new Blob([draft], { type: "text/plain;charset=utf-8" }),
          ),
          a = document.createElement("a");
        a.href = url;
        a.download = "kinderride-enquiry.txt";
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      });
  });
  document.querySelectorAll("[data-estimator]").forEach((form) => {
    const run = () => {
      const p = plans.find((x) => x.id === form.elements.plan.value),
        c = Number(form.elements.students.value),
        m = Number(form.elements.months.value);
      if (
        !Number.isInteger(c) ||
        !Number.isInteger(m) ||
        c < 1 ||
        c > 8 ||
        m < 1 ||
        m > 12
      ) {
        form.querySelector("output").textContent = "Enter valid quantities";
        return;
      }
      form.querySelector("output").textContent = money(
        p.price * (p.id === "family" ? Math.ceil(c / 2) : c) * m,
      );
    };
    form.addEventListener("input", run);
    run();
  });
}
