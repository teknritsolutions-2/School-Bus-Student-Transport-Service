import { pageUrl } from './main.js';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(form) {
  let okay = true;
  form.querySelectorAll('[required]').forEach(input => {
    const error = input.closest('.field')?.querySelector('.field-error');
    const value = input.value.trim();
    const message = !value ? 'This field is required.' : input.type === 'email' && !emailPattern.test(value) ? 'Enter a valid email address.' : '';
    input.setAttribute('aria-invalid', String(Boolean(message)));
    if (error) error.textContent = message;
    if (message) okay = false;
  });
  return okay;
}

document.querySelectorAll('form[data-local-form]').forEach(form => {
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!validate(form)) return;
    const status = form.querySelector('.form-status');
    if (status) status.textContent = form.dataset.success || 'Thanks — your request has been saved for this demo.';
    form.reset();
  });
});

document.querySelector('[data-login-form]')?.addEventListener('submit', event => {
  event.preventDefault(); const form = event.currentTarget;
  if (!validate(form)) return;
  localStorage.setItem('waybell:session', JSON.stringify({ name: 'Riya Rao', loggedIn: true }));
  location.href = pageUrl('parent-dashboard.html');
});

document.querySelector('[data-register-form]')?.addEventListener('submit', event => {
  event.preventDefault(); const form = event.currentTarget;
  if (!validate(form)) return;
  localStorage.setItem('waybell:session', JSON.stringify({ name: form.elements.name.value.trim(), loggedIn: true }));
  location.href = pageUrl('parent-dashboard.html');
});
