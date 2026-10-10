export const routes = [
  {
    id: 'WB-12', name: 'Amber Loop', area: 'Lakeside & Cedar Park', school: 'Northfield Academy', duration: 42,
    stops: [
      { name: 'Lakeside Gate', lat: 17.4483, lng: 78.3915, pickup: '7:05 AM', drop: '4:18 PM' },
      { name: 'Cedar Park', lat: 17.4448, lng: 78.3994, pickup: '7:14 AM', drop: '4:09 PM' },
      { name: 'Orchard Junction', lat: 17.4398, lng: 78.4078, pickup: '7:24 AM', drop: '3:59 PM' },
      { name: 'Northfield Academy', lat: 17.4328, lng: 78.4168, pickup: '7:38 AM', drop: '3:45 PM', school: true }
    ]
  },
  {
    id: 'WB-24', name: 'Meadow Line', area: 'Meadow View & Hillcrest', school: 'Riverside Public School', duration: 38,
    stops: [
      { name: 'Meadow View', lat: 17.4204, lng: 78.4358, pickup: '7:20 AM', drop: '4:25 PM' },
      { name: 'Hillcrest Circle', lat: 17.4265, lng: 78.4425, pickup: '7:29 AM', drop: '4:16 PM' },
      { name: 'Library Corner', lat: 17.4332, lng: 78.4484, pickup: '7:38 AM', drop: '4:07 PM' },
      { name: 'Riverside School', lat: 17.4412, lng: 78.4548, pickup: '7:52 AM', drop: '3:53 PM', school: true }
    ]
  }
];

export const students = [
  { id: 'anaya', name: 'Anaya Rao', initials: 'AR', grade: 'Grade 5', routeId: 'WB-12', stop: 'Cedar Park' },
  { id: 'vihaan', name: 'Vihaan Rao', initials: 'VR', grade: 'Grade 2', routeId: 'WB-24', stop: 'Meadow View' }
];

export const plans = [
  { id: 'single', name: 'Single Ride', price: 1850, note: 'One-way school transport' },
  { id: 'daily', name: 'Daily Return', price: 2950, note: 'Morning and afternoon service' },
  { id: 'family', name: 'Family Plus', price: 4950, note: 'Two students, return service' }
];

export const initialLogs = [
  { date: '09 Oct 2026', student: 'Anaya Rao', route: 'WB-12', event: 'Dropped at Cedar Park', time: '4:09 PM' },
  { date: '09 Oct 2026', student: 'Vihaan Rao', route: 'WB-24', event: 'Arrived at school', time: '7:52 AM' },
  { date: '08 Oct 2026', student: 'Anaya Rao', route: 'WB-12', event: 'Boarded at Cedar Park', time: '7:14 AM' }
];

export const initialNotifications = [
  { id: 1, title: 'Anaya reached school', body: 'WB-12 arrived at Northfield Academy at 7:38 AM.', time: 'Today, 7:38 AM', unread: true },
  { id: 2, title: 'Route timing update', body: 'WB-24 is expected five minutes early tomorrow.', time: 'Yesterday, 6:20 PM', unread: true },
  { id: 3, title: 'Payment confirmed', body: 'Your Daily Return plan payment was recorded.', time: '01 Oct, 10:15 AM', unread: false }
];

export const money = (amount) => `₹${Number(amount).toLocaleString('en-IN')}`;

export function storeGet(key, fallback) {
  try { return JSON.parse(localStorage.getItem(`waybell:${key}`)) ?? fallback; } catch { return fallback; }
}

export function storeSet(key, value) {
  localStorage.setItem(`waybell:${key}`, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent('waybell:state', { detail: { key, value } }));
}
