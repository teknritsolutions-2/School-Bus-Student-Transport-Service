import { routes, students, plans, initialLogs, initialNotifications, money, storeGet, storeSet } from './data.js';
import { showTracking, startTrip, pauseTrip, resetTrip, setTrip } from './tracking.js';
import { addPayment, createReceipt } from './receipts.js';

const titles = { overview:'Dashboard overview', track:'Track the bus', students:'Students & routes', subscription:'Subscription', receipts:'Payments & receipts', logs:'Travel logs', notifications:'Notifications', settings:'Settings', help:'Help & support' };
const views = [...document.querySelectorAll('.dashboard-view')];

function showView(name, push=true) {
  if (!titles[name]) name = 'overview';
  views.forEach(view => view.hidden = view.dataset.view !== name);
  document.querySelectorAll('[data-view-target]').forEach(btn => btn.classList.toggle('active', btn.dataset.viewTarget === name));
  document.querySelector('[data-dash-title]').textContent = titles[name];
  if (push) history.replaceState(null,'',`#${name}`);
  document.querySelector('[data-dash-sidebar]')?.classList.remove('open');
  if (name === 'track') showTracking();
}

function renderStudents() {
  const html = students.map(student => { const route = routes.find(item => item.id === student.routeId); return `<article class="card student-chip"><span class="avatar">${student.initials}</span><div><h3>${student.name}</h3><p class="muted">${student.grade} · ${route.id} ${route.name}<br>Stop: ${student.stop}</p></div></article>`; }).join('');
  document.querySelectorAll('[data-student-list]').forEach(el => el.innerHTML = html);
  const options = students.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
  document.querySelectorAll('[data-student-select]').forEach(el => el.innerHTML = options);
}

function renderPlan() {
  const selectedId = storeGet('plan','daily'); const selected = plans.find(item => item.id === selectedId) || plans[1];
  document.querySelector('[data-current-plan]').innerHTML = `<span class="tag">Active plan</span><h2>${selected.name}</h2><p class="price">${money(selected.price)} <small>/ month</small></p><p class="muted">${selected.note}</p>`;
  document.querySelector('[data-plan-list]').innerHTML = plans.map(plan => `<article class="card price-card${plan.id===selected.id?' featured':''}"><h3>${plan.name}</h3><p class="price">${money(plan.price)} <small>/ month</small></p><p class="muted">${plan.note}</p><button class="btn btn-sm" data-select-plan="${plan.id}" type="button">${plan.id===selected.id?'Current':'Choose plan'}</button></article>`).join('');
}

function renderReceipts() {
  const receipts = storeGet('receipts', [{ id:'WB-10264581', date:'01 Oct 2026', plan:'Daily Return', student:'Anaya Rao', amount:2950 }]);
  const body = receipts.map((r,index)=>`<tr><td>${r.id}</td><td>${r.date}</td><td>${r.plan}</td><td>${money(r.amount)}</td><td><button class="btn btn-sm btn-outline" data-receipt="${index}" type="button">PDF</button></td></tr>`).join('');
  document.querySelector('[data-receipt-body]').innerHTML = body || '<tr><td colspan="5" class="empty">No receipts yet.</td></tr>';
}

function renderLogs() {
  const logs = storeGet('logs', initialLogs);
  document.querySelector('[data-log-body]').innerHTML = logs.map(log=>`<tr><td>${log.date}</td><td>${log.student}</td><td>${log.route}</td><td>${log.event}</td><td>${log.time}</td></tr>`).join('');
}

function renderNotifications() {
  const notes = storeGet('notifications', initialNotifications);
  document.querySelector('[data-notification-list]').innerHTML = notes.map(note=>`<article class="card notification${note.unread?' unread':''}"><span class="card-icon">↗</span><div><h3>${note.title}</h3><p>${note.body}</p><small class="muted">${note.time}</small></div></article>`).join('');
  const count = notes.filter(item=>item.unread).length; document.querySelector('[data-note-count]').textContent = count;
}

function openPayment(planId) {
  const plan = plans.find(item=>item.id===planId) || plans[1]; const dialog = document.querySelector('[data-payment-modal]'); dialog.dataset.plan = plan.id;
  dialog.querySelector('[data-payment-summary]').textContent = `${plan.name} — ${money(plan.price)}`; dialog.showModal();
}

document.addEventListener('click', event => {
  const viewButton = event.target.closest('[data-view-target]'); if (viewButton) showView(viewButton.dataset.viewTarget);
  const planButton = event.target.closest('[data-select-plan]'); if (planButton) openPayment(planButton.dataset.selectPlan);
  const receiptButton = event.target.closest('[data-receipt]'); if (receiptButton) createReceipt(storeGet('receipts', [{ id:'WB-10264581', date:'01 Oct 2026', plan:'Daily Return', student:'Anaya Rao', amount:2950 }])[Number(receiptButton.dataset.receipt)]);
});

document.querySelector('[data-dash-menu]')?.addEventListener('click',()=>document.querySelector('[data-dash-sidebar]').classList.toggle('open'));
document.querySelector('[data-logout]')?.addEventListener('click',()=>{ localStorage.removeItem('waybell:session'); location.href=new URL('login.html',location.href).href; });
document.querySelector('[data-theme-toggle]')?.addEventListener('click',()=>{ const theme=document.documentElement.dataset.theme==='dark'?'light':'dark'; document.documentElement.dataset.theme=theme; localStorage.setItem('waybell:theme',theme); });
document.querySelector('[data-dir-toggle]')?.addEventListener('click',()=>{ const dir=document.documentElement.dir==='rtl'?'ltr':'rtl'; document.documentElement.dir=dir; localStorage.setItem('waybell:dir',dir); });
document.querySelector('[data-trip-start]')?.addEventListener('click',startTrip); document.querySelector('[data-trip-pause]')?.addEventListener('click',pauseTrip); document.querySelector('[data-trip-reset]')?.addEventListener('click',resetTrip);
document.querySelector('[data-route-select]')?.addEventListener('change',event=>setTrip(event.target.value,document.querySelector('[data-direction-select]').value));
document.querySelector('[data-direction-select]')?.addEventListener('change',event=>setTrip(document.querySelector('[data-route-select]').value,event.target.value));
document.querySelector('[data-modal-close]')?.addEventListener('click',()=>document.querySelector('[data-payment-modal]').close());
document.querySelector('[data-payment-form]')?.addEventListener('submit',event=>{ event.preventDefault(); const dialog=document.querySelector('[data-payment-modal]'); const plan=plans.find(item=>item.id===dialog.dataset.plan)||plans[1]; const student=students.find(item=>item.id===event.currentTarget.elements.student.value)||students[0]; storeSet('plan',plan.id); const receipt=addPayment(plan,student); dialog.close(); renderPlan(); renderReceipts(); createReceipt(receipt); });
document.querySelector('[data-mark-read]')?.addEventListener('click',()=>{ storeSet('notifications',storeGet('notifications',initialNotifications).map(item=>({...item,unread:false}))); renderNotifications(); });
document.querySelectorAll('.switch').forEach(button=>button.addEventListener('click',()=>button.setAttribute('aria-checked',button.getAttribute('aria-checked')==='true'?'false':'true')));
addEventListener('waybell:state',event=>{ if(event.detail.key==='notifications')renderNotifications(); if(event.detail.key==='logs')renderLogs(); });

renderStudents(); renderPlan(); renderReceipts(); renderLogs(); renderNotifications(); showView(location.hash.slice(1)||'overview',false);
