#!/usr/bin/env node
// VIỆC 03 — GATE: máy chạy thử TRƯỚC khi kết quả tới tay người.
//
//   node harness/03-gate/gate.js                      kiểm vi-du/giohang.js
//   node harness/03-gate/gate.js duong/dan/khac.js    kiểm file khác
//
// Thoát 0 = đạt hết · 1 = có trường hợp hỏng · 2 = không nạp được file.
// Mã thoát mới là thứ quyết định, không phải lời AI báo.

const path = require('path');
const { TRUONG_HOP } = require('../01-context/truong-hop.js');

const DUONG_DAN = path.resolve(
  process.argv[2] || path.join(__dirname, '..', '..', 'vi-du', 'giohang.js'),
);

let tinhTien;
try {
  ({ tinhTien } = require(DUONG_DAN));
} catch (loi) {
  console.error('KHONG NAP DUOC ' + DUONG_DAN);
  console.error('  ' + loi.message);
  process.exit(2);
}

if (typeof tinhTien !== 'function') {
  console.error('File khong export ham tinhTien: ' + DUONG_DAN);
  process.exit(2);
}

let hong = 0;
for (const c of TRUONG_HOP) {
  let ra;
  try {
    ra = tinhTien(c.tien);
  } catch (loi) {
    ra = 'NEM LOI: ' + loi.message;
  }
  const dat = ra === c.phaiTra;
  if (!dat) hong++;
  console.log(
    (dat ? 'DAT   ' : 'HONG  ') + c.tien + ' -> ' + ra + '  (phai la ' + c.phaiTra + ')  ' + c.vi,
  );
}

console.log(hong === 0 ? '\nTAT CA DAT' : '\n' + hong + ' TRUONG HOP HONG');
process.exit(hong === 0 ? 0 : 1);
