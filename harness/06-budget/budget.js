#!/usr/bin/env node
// VIỆC 06 — BUDGET: bắt dừng khi quá tốn.
//
//   node harness/06-budget/budget.js --giay 30 --lan 3 -- npm test
//
// Không có giới hạn thì nó chạy tới khi có người chặn bằng tay — và chỗ phát hiện
// cuối cùng thường là hoá đơn.
//
// Thoát 0 = lệnh đạt trong số lần cho phép · 1 = hết lần mà vẫn hỏng · 124 = quá giờ.

const { spawnSync } = require('child_process');

const argv = process.argv.slice(2);
const ngan = argv.indexOf('--');
if (ngan === -1 || ngan === argv.length - 1) {
  console.error('Dùng: node budget.js [--giay N] [--lan N] -- <lệnh>');
  process.exit(2);
}

function doc(ten, macDinh) {
  const i = argv.indexOf(ten);
  if (i === -1 || i > ngan) return macDinh;
  const v = Number(argv[i + 1]);
  return Number.isFinite(v) && v > 0 ? v : macDinh;
}

const GIAY = doc('--giay', 60);
const LAN = doc('--lan', 3);
const [lenh, ...thamSo] = argv.slice(ngan + 1);

console.log('[budget] giới hạn: ' + GIAY + 's mỗi lần, tối đa ' + LAN + ' lần');

const batDau = Date.now();
for (let lan = 1; lan <= LAN; lan++) {
  console.log('[budget] lần ' + lan + '/' + LAN + ': ' + [lenh, ...thamSo].join(' '));
  const r = spawnSync(lenh, thamSo, { stdio: 'inherit', timeout: GIAY * 1000 });

  if (r.error && r.error.code === 'ETIMEDOUT') {
    console.error('[budget] QUÁ GIỜ sau ' + GIAY + 's — đã cắt.');
    process.exit(124);
  }
  if (r.status === 0) {
    console.log('[budget] đạt ở lần ' + lan + ', tổng ' + Math.round((Date.now() - batDau) / 1000) + 's');
    process.exit(0);
  }
  console.log('[budget] lần ' + lan + ' hỏng (mã ' + r.status + ')');
}

console.error('[budget] HẾT ' + LAN + ' LẦN mà vẫn hỏng — dừng, không thử nữa.');
process.exit(1);
