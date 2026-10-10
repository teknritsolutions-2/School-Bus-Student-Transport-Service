import { money, storeGet, storeSet } from './data.js';

export function createReceipt(record) {
  const api = window.jspdf;
  if (!api?.jsPDF) { alert('The PDF library could not be loaded.'); return; }
  const doc = new api.jsPDF();
  doc.setFillColor(16,35,63); doc.rect(0,0,210,36,'F');
  doc.setTextColor(255,183,3); doc.setFontSize(22); doc.text('WAYBELL', 18, 23);
  doc.setTextColor(23,36,60); doc.setFontSize(18); doc.text('Payment receipt', 18, 58);
  doc.setFontSize(10); doc.setTextColor(99,112,135);
  const rows = [['Receipt', record.id], ['Date', record.date], ['Plan', record.plan], ['Student', record.student], ['Amount', money(record.amount)], ['Status', 'Paid']];
  rows.forEach(([label,value], index) => { const y = 76 + index * 13; doc.setFont(undefined,'bold'); doc.text(label,18,y); doc.setFont(undefined,'normal'); doc.text(String(value),70,y); });
  doc.setDrawColor(221,227,237); doc.line(18,160,192,160); doc.text('This document is generated locally in your browser.',18,175);
  doc.save(`${record.id}.pdf`);
}

export function addPayment(plan, student) {
  const receipts = storeGet('receipts', []);
  const record = { id: `WB-${Date.now().toString().slice(-8)}`, date: new Date().toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}), plan: plan.name, student: student.name, amount: plan.price };
  receipts.unshift(record); storeSet('receipts', receipts); return record;
}
