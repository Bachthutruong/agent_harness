#!/usr/bin/env node
// VIỆC 06 — BUDGET: bắt dừng khi quá tốn.
//
//   node harness/06-budget/budget.js --seconds 30 --tries 3 -- npm test
//
// Không có giới hạn thì nó chạy tới khi có người chặn bằng tay — và chỗ phát hiện
// cuối cùng thường là hoá đơn.
//
// Thoát 0 = lệnh đạt trong số lần cho phép · 1 = hết lần mà vẫn hỏng · 124 = quá giờ.

const { spawnSync } = require('child_process');

const argv = process.argv.slice(2);
const sep = argv.indexOf('--');
if (sep === -1 || sep === argv.length - 1) {
  console.error('Usage: node budget.js [--seconds N] [--tries N] -- <command>');
  process.exit(2);
}

function arg(name, fallback) {
  const i = argv.indexOf(name);
  if (i === -1 || i > sep) return fallback;
  const v = Number(argv[i + 1]);
  return Number.isFinite(v) && v > 0 ? v : fallback;
}

const SECONDS = arg('--seconds', 60);
const TRIES = arg('--tries', 3);
const [cmd, ...args] = argv.slice(sep + 1);

console.log('[budget] giới hạn: ' + SECONDS + 's mỗi lần, tối đa ' + TRIES + ' lần');

const startedAt = Date.now();
for (let n = 1; n <= TRIES; n++) {
  console.log('[budget] lần ' + n + '/' + TRIES + ': ' + [cmd, ...args].join(' '));
  const r = spawnSync(cmd, args, { stdio: 'inherit', timeout: SECONDS * 1000 });

  if (r.error && r.error.code === 'ETIMEDOUT') {
    console.error('[budget] QUÁ GIỜ sau ' + SECONDS + 's — đã cắt.');
    process.exit(124);
  }
  if (r.status === 0) {
    console.log('[budget] đạt ở lần ' + n + ', tổng ' + Math.round((Date.now() - startedAt) / 1000) + 's');
    process.exit(0);
  }
  console.log('[budget] lần ' + n + ' hỏng (mã ' + r.status + ')');
}

console.error('[budget] HẾT ' + TRIES + ' LẦN mà vẫn hỏng — dừng, không thử nữa.');
process.exit(1);
