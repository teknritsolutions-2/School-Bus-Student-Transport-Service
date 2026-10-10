import { routes, students, plans, initialLogs, initialNotifications, money, storeGet, storeSet } from './data.js';
import { showTracking, startTrip, pauseTrip, resetTrip, setTrip } from './tracking.js';
import { createReceipt } from './receipts.js';

const titles={overview:'Dashboard overview',track:'Track the route',students:'Students',logs:'Travel logs',notifications:'Notifications',subscription:'Subscription',receipts:'Receipts',settings:'Settings',help:'Help & support'};
const exampleReceipt={id:'ST-EXAMPLE-1001',date:'01 Oct 2026',plan:'Daily Return',student:'Anaya Rao',amount:2950};
let selected=students.find(item=>item.id===storeGet('student','anaya'))||students[0];
const icon=`<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9a6 6 0 0 1 12 0c0 7 3 7 3 7H3s3 0 3-7M10 20h4"/></svg>`;

function studentRoute(student=selected){return routes.find(item=>item.id===student.routeId)||routes[0]}
function showView(name,push=true){
  if(!titles[name])name='overview';
  document.querySelectorAll('.dashboard-view').forEach(view=>view.hidden=view.dataset.view!==name);
  document.querySelectorAll('[data-view-target]').forEach(button=>button.classList.toggle('active',button.dataset.viewTarget===name));
  document.querySelector('[data-dash-title]').textContent=titles[name];
  if(push)history.replaceState(null,'',`#${name}`);
  document.querySelector('[data-dash-sidebar]')?.classList.remove('open');
  if(name==='track')showTracking();
}

function renderStudentSwitcher(){
  document.querySelector('[data-student-switcher]').innerHTML=students.map(student=>`<button class="${student.id===selected.id?'active':''}" data-student-id="${student.id}" type="button"><span class="avatar">${student.initials}</span><span>${student.name}</span></button>`).join('');
  document.querySelectorAll('[data-selected-name]').forEach(node=>node.textContent=selected.name);
  document.querySelector('[data-profile-avatar]').textContent=selected.initials;
}

function renderOverview(){
  const route=studentRoute(),stop=route.stops.find(item=>item.name===selected.stop)||route.stops[0],school=route.stops.at(-1);
  document.querySelector('[data-overview-route]').textContent=`${route.id} · ${route.name}`;
  document.querySelector('[data-overview-time]').textContent=`Pickup at ${stop.pickup}`;
  document.querySelector('[data-overview-detail]').textContent=`${selected.name} · ${selected.stop} · ${route.school}`;
  document.querySelector('[data-overview-stop]').textContent=selected.stop;
  document.querySelector('[data-overview-arrival]').textContent=school.pickup;
  document.querySelector('[data-overview-events]').innerHTML=`<div class="mini-event"><strong>${stop.pickup} · Assigned pickup</strong><br><small>${selected.stop}</small></div><div class="mini-event"><strong>${school.pickup} · School arrival</strong><br><small>${route.school}</small></div>`;
}

function renderStudents(){
  document.querySelector('[data-student-cards]').innerHTML=students.map(student=>{const route=studentRoute(student),stop=route.stops.find(item=>item.name===student.stop)||route.stops[0];return`<article class="dash-panel"><span class="avatar">${student.initials}</span><h2>${student.name}</h2><p>${student.grade}</p><div class="editorial-rule"><strong>${route.id} · ${route.name}</strong><br><span class="muted">${student.stop} · ${stop.pickup}<br>${route.school}</span></div><button class="btn btn-sm ${student.id===selected.id?'':'btn-outline'}" data-student-id="${student.id}" type="button">${student.id===selected.id?'Selected':'Select Student'}</button></article>`}).join('');
}

function renderPlan(){
  const planId=storeGet('plan','daily'),current=plans.find(item=>item.id===planId)||plans[1];
  document.querySelector('[data-current-plan]').innerHTML=`<h2>${current.name}</h2><p class="price">${money(current.price)} <small>/ month</small></p><p class="muted">${current.note}</p>`;
  document.querySelector('[data-plan-list]').innerHTML=plans.map(plan=>`<article class="plan${plan.id===current.id?' featured':''}"><span class="tag">${plan.id===current.id?'Selected':'Available'}</span><h3>${plan.name}</h3><p class="price">${money(plan.price)} <small>/ month</small></p><p>${plan.note}</p><button class="btn ${plan.id===current.id?'btn-outline':''}" data-select-plan="${plan.id}" type="button">${plan.id===current.id?'Selected':'Choose Preference'}</button></article>`).join('');
}

function renderReceipts(){
  document.querySelector('[data-receipt-body]').innerHTML=`<tr><td>${exampleReceipt.id}</td><td>${exampleReceipt.date}</td><td>${exampleReceipt.plan}</td><td>${money(exampleReceipt.amount)}</td><td><button class="btn btn-sm btn-outline" data-receipt type="button">Download Example PDF</button></td></tr>`;
}

function renderLogs(){
  const logs=storeGet('logs',initialLogs).filter(log=>log.student===selected.name);
  document.querySelector('[data-log-body]').innerHTML=logs.map(log=>`<tr><td>${log.date}</td><td>${log.student}</td><td>${log.route}</td><td>${log.event}</td><td>${log.time}</td></tr>`).join('')||'<tr><td class="empty" colspan="5">No local journey entries for this student.</td></tr>';
}

function renderNotifications(){
  const notes=storeGet('notifications',initialNotifications);
  document.querySelector('[data-notification-list]').innerHTML=notes.map(note=>`<article class="notification${note.unread?' unread':''}"><span class="notification-icon">${icon}</span><div><h3>${note.title}</h3><p>${note.body}</p></div><time class="muted">${note.time}</time></article>`).join('');
  document.querySelector('[data-note-count]').textContent=notes.filter(item=>item.unread).length;
}

function selectStudent(id){
  selected=students.find(item=>item.id===id)||students[0];storeSet('student',selected.id);
  const route=studentRoute();document.querySelector('[data-route-select]').value=route.id;setTrip(route.id,document.querySelector('[data-direction-select]').value);
  renderStudentSwitcher();renderOverview();renderStudents();renderLogs();
}

document.addEventListener('click',event=>{
  const view=event.target.closest('[data-view-target]');if(view)showView(view.dataset.viewTarget);
  const student=event.target.closest('[data-student-id]');if(student)selectStudent(student.dataset.studentId);
  const plan=event.target.closest('[data-select-plan]');if(plan){storeSet('plan',plan.dataset.selectPlan);renderPlan()}
  if(event.target.closest('[data-receipt]'))createReceipt(exampleReceipt);
});
document.querySelector('[data-dash-menu]')?.addEventListener('click',()=>document.querySelector('[data-dash-sidebar]').classList.toggle('open'));
document.querySelector('[data-theme-toggle]')?.addEventListener('click',()=>{const theme=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=theme;localStorage.setItem('schoolTransport:theme',theme)});
document.querySelector('[data-dir-toggle]')?.addEventListener('click',()=>{const dir=document.documentElement.dir==='rtl'?'ltr':'rtl';document.documentElement.dir=dir;localStorage.setItem('schoolTransport:dir',dir)});
document.querySelector('[data-trip-start]')?.addEventListener('click',startTrip);document.querySelector('[data-trip-pause]')?.addEventListener('click',pauseTrip);document.querySelector('[data-trip-reset]')?.addEventListener('click',resetTrip);
document.querySelector('[data-route-select]')?.addEventListener('change',event=>setTrip(event.target.value,document.querySelector('[data-direction-select]').value));
document.querySelector('[data-direction-select]')?.addEventListener('change',event=>setTrip(document.querySelector('[data-route-select]').value,event.target.value));
document.querySelector('[data-mark-read]')?.addEventListener('click',()=>{storeSet('notifications',storeGet('notifications',initialNotifications).map(item=>({...item,unread:false})));renderNotifications()});
document.querySelectorAll('.switch').forEach(button=>button.addEventListener('click',()=>button.setAttribute('aria-checked',button.getAttribute('aria-checked')==='true'?'false':'true')));
addEventListener('schooltransport:state',event=>{if(event.detail.key==='notifications')renderNotifications();if(event.detail.key==='logs')renderLogs()});
addEventListener('hashchange',()=>showView(location.hash.slice(1)||'overview',false));

renderStudentSwitcher();renderOverview();renderStudents();renderPlan();renderReceipts();renderLogs();renderNotifications();
const initialRoute=studentRoute();document.querySelector('[data-route-select]').value=initialRoute.id;setTrip(initialRoute.id);showView(location.hash.slice(1)||'overview',false);
