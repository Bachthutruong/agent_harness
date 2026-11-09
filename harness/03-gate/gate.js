#!/usr/bin/env node
// VIỆC 03 — GATE: máy chạy thử TRƯỚC khi kết quả tới tay người.
//
// Bộ máy này viết MỘT LẦN. Thêm đầu việc mới chỉ cần thêm một file trong
// harness/01-context/cong-viec/ — không ai phải mở lại file này.
//
//   node harness/03-gate/gate.js                      chạy MỌI đầu việc
//   node harness/03-gate/gate.js --viec gio-hang      chạy một đầu việc
//   node harness/03-gate/gate.js --viec gio-hang --file duong/dan/khac.js
//
// Thoát 0 = đạt hết · 1 = có trường hợp hỏng · 2 = không nạp được file.

const path = require('path');
const { napDauViec } = require('../01-context');

function doc(ten) {
  const i = process.argv.indexOf(ten);
  return i === -1 ? null : process.argv[i + 1];
}

const chonViec = doc('--viec');
const thayFile = doc('--file');

let dauViec = napDauViec();
if (chonViec) {
  dauViec = dauViec.filter((v) => v.ma === chonViec);
  if (dauViec.length === 0) {
    console.error('Khong co dau viec ten "' + chonViec + '".');
    console.error('Co: ' + napDauViec().map((v) => v.ma).join(', '));
    process.exit(2);
  }
}
if (thayFile) {
  if (dauViec.length !== 1) {
    console.error('--file phai di kem --viec <ten>, vi no thay file cua dung mot dau viec.');
    process.exit(2);
  }
  dauViec[0].duongDan = path.resolve(thayFile);
}

function bang(a, b) {
  if (a === b) return true;
  if (a && b && typeof a === 'object' && typeof b === 'object') {
    return JSON.stringify(a) === JSON.stringify(b);
  }
  return false;
}

let tongHong = 0;
let tongChay = 0;

for (const viec of dauViec) {
  console.log('\n--- ' + viec.ten + '  [' + viec.ma + ']');
  console.log('    người chốt: ' + viec.quyetDinh);

  let ham;
  try {
    ham = require(viec.duongDan)[viec.ham];
  } catch (loi) {
    console.error('    KHONG NAP DUOC ' + viec.duongDan);
    console.error('    ' + loi.message);
    process.exit(2);
  }
  if (typeof ham !== 'function') {
    console.error('    File khong export ham ' + viec.ham + ': ' + viec.duongDan);
    process.exit(2);
  }

  for (const c of viec.truongHop) {
    let ra;
    try {
      ra = ham(...c.vao);
    } catch (loi) {
      ra = 'NEM LOI: ' + loi.message;
    }
    const dat = bang(ra, c.ra);
    tongChay++;
    if (!dat) tongHong++;
    console.log(
      (dat ? '    DAT   ' : '    HONG  ') +
        viec.ham + '(' + c.vao.join(', ') + ') -> ' + ra +
        '  (phai la ' + c.ra + ')  ' + c.vi,
    );
  }
}

console.log(
  '\n' +
    (tongHong === 0
      ? 'TAT CA DAT — ' + tongChay + ' truong hop, ' + dauViec.length + ' dau viec'
      : tongHong + '/' + tongChay + ' TRUONG HOP HONG'),
);
process.exit(tongHong === 0 ? 0 : 1);
