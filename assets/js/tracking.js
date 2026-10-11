import { routes, students, initialLogs, initialNotifications, storeGet, storeSet } from './data.js';

let map;
let publicMap;
let routeLine;
let busMarker;
let stopLayer;
let timer;
let progress = 0;
let route = routes[0];
let direction = 'pickup';
let emittedStops = new Set();

function points() { return route.stops.map(stop => [stop.lat, stop.lng]); }
function interpolate(list, ratio) {
  const scaled = Math.min(.9999, Math.max(0, ratio)) * (list.length - 1);
  const index = Math.floor(scaled); const part = scaled - index; const next = list[Math.min(index + 1, list.length - 1)]; const here = list[index];
  return [here[0] + (next[0] - here[0]) * part, here[1] + (next[1] - here[1]) * part];
}

function renderStatus() {
  document.querySelectorAll('[data-trip-route]').forEach(el => el.textContent = `${route.id} · ${route.name}`);
  document.querySelectorAll('[data-trip-direction]').forEach(el => el.textContent = direction === 'pickup' ? 'Morning pickup' : 'Afternoon drop-off');
  document.querySelectorAll('[data-trip-progress]').forEach(el => el.style.width = `${progress}%`);
  document.querySelectorAll('[data-trip-percent]').forEach(el => el.textContent = `${Math.round(progress)}%`);
  const eta = Math.max(0, Math.round(route.duration * (1 - progress / 100)));
  document.querySelectorAll('[data-trip-eta]').forEach(el => el.textContent = progress >= 100 ? 'Arrived' : `${eta} min`);
}

function drawRoute() {
  if (!map || !window.L) return;
  const latlngs = points();
  routeLine?.remove(); busMarker?.remove(); stopLayer?.remove();
  routeLine = window.L.polyline(latlngs, { color:'#704447', weight:6, opacity:.92 }).addTo(map);
  stopLayer = window.L.layerGroup(route.stops.map(stop => window.L.circleMarker([stop.lat,stop.lng], { radius:7, color:'#482b30', weight:3, fillColor:'#fff', fillOpacity:1 }).bindPopup(`<strong>${stop.name}</strong><br>${direction === 'pickup' ? stop.pickup : stop.drop}`))).addTo(map);
  busMarker = window.L.circleMarker(interpolate(latlngs,progress/100), { radius:11, color:'#fff', weight:4, fillColor:'#91676a', fillOpacity:1 }).addTo(map).bindTooltip('School transport bus', { permanent:false });
  map.fitBounds(routeLine.getBounds(), { padding:[34,34] });
}

function notifyStop(index) {
  if (emittedStops.has(index)) return; emittedStops.add(index);
  const stop = route.stops[index]; const student = students.find(item => item.routeId === route.id) || students[0];
  const notifications = storeGet('notifications', initialNotifications);
  notifications.unshift({ id:Date.now(), title:`Bus reached ${stop.name}`, body:`${route.id} checked in at ${stop.name}.`, time:'Just now', unread:true });
  storeSet('notifications', notifications.slice(0,12));
  const logs = storeGet('logs', initialLogs);
  logs.unshift({ date:new Date().toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}), student:student.name, route:route.id, event:`Bus reached ${stop.name}`, time:new Date().toLocaleTimeString('en-IN',{hour:'numeric',minute:'2-digit'}) });
  storeSet('logs', logs.slice(0,30));
}

function update() {
  renderStatus();
  if (busMarker) busMarker.setLatLng(interpolate(points(), progress / 100));
  route.stops.forEach((_, index) => { if (progress >= index / (route.stops.length - 1) * 100) notifyStop(index); });
  if (progress >= 100) pauseTrip();
}

function buildMap() {
  if (map || !document.querySelector('[data-map]') || !window.L) return;
  map = window.L.map(document.querySelector('[data-map]'), { scrollWheelZoom:false });
  window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom:19, attribution:'&copy; OpenStreetMap contributors' }).addTo(map);
  drawRoute(); renderStatus();
}

export function showTracking() { buildMap(); setTimeout(() => map?.invalidateSize(), 50); }
export function startTrip() { if (timer || progress >= 100) return; timer = setInterval(() => { progress = Math.min(100, progress + 1.2); update(); }, 650); }
export function pauseTrip() { clearInterval(timer); timer = undefined; }
export function resetTrip() { pauseTrip(); progress = 0; emittedStops = new Set(); update(); drawRoute(); }
export function setTrip(routeId, nextDirection='pickup') { pauseTrip(); route = routes.find(item => item.id === routeId) || routes[0]; direction = nextDirection; progress = 0; emittedStops = new Set(); drawRoute(); update(); }

function buildPublicMap() {
  const target = document.querySelector('[data-public-map]');
  if (publicMap || !target || !window.L) return;
  publicMap = window.L.map(target, { scrollWheelZoom:false });
  window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom:19, attribution:'&copy; OpenStreetMap contributors' }).addTo(publicMap);
  const colors = ['#704447','#482b30'];
  const bounds = [];
  routes.forEach((item,index) => {
    const latlngs = item.stops.map(stop => [stop.lat,stop.lng]);
    bounds.push(...latlngs);
    window.L.polyline(latlngs,{color:colors[index],weight:6,opacity:.9}).addTo(publicMap).bindTooltip(`${item.id} · ${item.name}`);
    item.stops.forEach(stop => window.L.circleMarker([stop.lat,stop.lng],{radius:6,color:colors[index],weight:3,fillColor:'#fff',fillOpacity:1}).addTo(publicMap).bindPopup(`<strong>${stop.name}</strong><br>${item.id} · ${stop.pickup}`));
  });
  publicMap.fitBounds(bounds,{padding:[38,38]});
}

buildPublicMap();
