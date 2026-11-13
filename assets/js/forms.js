import { plans } from "./transport-data.js";
import { money } from "./site-config.js";
export function initForms() {
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
      form.querySelector('[role="status"]').textContent =
        "Your entries are valid. Account services are not connected, so no account was created or signed in.";
    });
    form.elements.confirm?.addEventListener("input", () =>
      form.elements.confirm.setCustomValidity(""),
    );
    form.elements.password?.addEventListener("input", () =>
      form.elements.confirm?.setCustomValidity(""),
    );
  });
  document.querySelectorAll("[data-provider]").forEach((b) =>
    b.addEventListener("click", () => {
      document.querySelector("[data-auth-status]").textContent =
        `${b.dataset.provider} sign-in is not connected. No sign-in request has been made.`;
    }),
  );
  document.querySelector("[data-forgot]")?.addEventListener("click", () => {
    document.querySelector("[data-auth-status]").textContent =
      "Password recovery is not connected. No reset email has been sent.";
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
