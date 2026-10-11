import { money } from './data.js';

export function createReceipt(record) {
  const api = window.jspdf;
  if (!api?.jsPDF) { alert('The PDF library could not be loaded.'); return; }
  const doc = new api.jsPDF();
  doc.setFillColor(23,50,77); doc.rect(0,0,210,39,'F');
  doc.setTextColor(215,229,237); doc.setFontSize(20); doc.text('SCHOOL TRANSPORT', 18, 24);
  doc.setTextColor(36,85,122); doc.setFontSize(17); doc.text('EXAMPLE RECEIPT', 18, 59);
  doc.setFontSize(10); doc.setTextColor(104,107,104);
  const rows = [['Reference', record.id], ['Example date', record.date], ['Plan', record.plan], ['Student', record.student], ['Illustrative amount', money(record.amount)], ['Status', 'Example only — no payment processed']];
  rows.forEach(([label,value], index) => { const y = 76 + index * 13; doc.setFont(undefined,'bold'); doc.text(label,18,y); doc.setFont(undefined,'normal'); doc.text(String(value),70,y); });
  doc.setDrawColor(223,225,219); doc.line(18,160,192,160); doc.text('Generated locally for interface preview. This is not proof of payment.',18,175);
  doc.save(`${record.id}-example.pdf`);
}
