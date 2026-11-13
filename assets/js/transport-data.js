// Fictional reference routes. No geographic coordinates or operating coverage claims.
export const routes = [
  {
    id: "REF-12",
    name: "North reference route",
    area: "Reference area A",
    school: "Reference school A",
    duration: 42,
    journeys: ["Morning pickup", "Afternoon return"],
    stops: [
      { name: "Neighborhood entrance", pickup: "7:05 AM", drop: "4:18 PM" },
      { name: "Community stop", pickup: "7:14 AM", drop: "4:09 PM" },
      { name: "Library stop", pickup: "7:24 AM", drop: "3:59 PM" },
      { name: "Reference school A", pickup: "7:38 AM", drop: "3:45 PM" },
    ],
  },
  {
    id: "REF-24",
    name: "South reference route",
    area: "Reference area B",
    school: "Reference school B",
    duration: 38,
    journeys: ["Morning pickup", "Afternoon return"],
    stops: [
      { name: "Neighborhood square", pickup: "7:20 AM", drop: "4:25 PM" },
      { name: "Park entrance", pickup: "7:29 AM", drop: "4:16 PM" },
      { name: "Community center", pickup: "7:38 AM", drop: "4:07 PM" },
      { name: "Reference school B", pickup: "7:52 AM", drop: "3:53 PM" },
    ],
  },
];
export const students = [
  {
    id: "student-a",
    name: "Student A",
    initials: "SA",
    grade: "Grade 5",
    routeId: "REF-12",
    stop: "Community stop",
  },
  {
    id: "student-b",
    name: "Student B",
    initials: "SB",
    grade: "Grade 2",
    routeId: "REF-24",
    stop: "Park entrance",
  },
];
export const plans = [
  {
    id: "single",
    name: "Single Journey",
    price: 1850,
    note: "One daily direction for one student",
  },
  {
    id: "daily",
    name: "Daily Return",
    price: 2950,
    note: "Morning pickup and afternoon return",
  },
  {
    id: "family",
    name: "Family Return",
    price: 4950,
    note: "Return coverage for two students",
  },
];
export const initialLogs = [
  {
    student: "student-a",
    date: "Reference day",
    route: "REF-12",
    direction: "Morning",
    event: "School arrival",
    time: "7:38 AM",
    source: "Reference record",
  },
  {
    student: "student-b",
    date: "Reference day",
    route: "REF-24",
    direction: "Morning",
    event: "School arrival",
    time: "7:52 AM",
    source: "Reference record",
  },
];
export const initialNotifications = [
  {
    id: "route",
    title: "Review your route assignment",
    body: "Check the selected student, stop and school before travel.",
    category: "Journey information",
    unread: true,
  },
  {
    id: "plan",
    title: "Plan review reminder",
    body: "Confirm service days and coverage before renewal.",
    category: "Plan reminder",
    unread: true,
  },
];
