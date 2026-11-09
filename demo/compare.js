#!/usr/bin/env node
// So hai cách trên MỘT màn hình. Chạy: npm run compare
//
// Lấy kết quả thật ở /tmp/harness-try-{without,with} nếu đã chạy thử.
// Chưa chạy thì tự dùng bản ghi 08/11 trong demo/recorded-2026-11-08.

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const REC = path.join(ROOT, 'demo', 'recorded-2026-11-08');
const color = process.stdout.isTTY;
const C = {
  dim: color ? '\x1b[2m' : '', bold: color ? '\x1b[1m' : '',
  red: color ? '\x1b[31m' : '', green: color ? '\x1b[32m' : '', off: color ? '\x1b[0m' : '',
};

function pick(kind, recorded) {
  const live = '/tmp/harness-try-' + kind + '/cart.js';
  if (fs.existsSync(live)) return { file: live, from: 'máy anh, vừa chạy' };
  return { file: path.join(REC, recorded), from: 'bản ghi 08/11' };
}

// Chạy cửa kiểm trên một bản sao, để không sửa file của người dùng.
function runGate(file) {
  const src = fs.readFileSync(file, 'utf8');
  const fn = src.includes('calcTotal') ? 'calcTotal' : 'tinhTien';
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'harness-cmp-'));
  const copy = path.join(dir, 'cart.js');
  fs.writeFileSync(copy, src.includes('module.exports') ? src : src + '\nmodule.exports = { ' + fn + ' };\n');
  const r = spawnSync(process.execPath,
    [path.join(ROOT, 'harness', '03-gate', 'gate.js'), '--task', 'cart', '--file', copy, '--fn', fn],
    { encoding: 'utf8' });
  fs.rmSync(dir, { recursive: true, force: true });
  const line = (r.stdout || '').split('\n').find((l) => l.includes('1000001')) || '';
  const got = (line.match(/->\s*([\d.]+)/) || [])[1] || '?';
  return { exit: r.status, got };
}

// Lấy đúng nhánh "được giảm" của câu lệnh — đó là chỗ hai bên khác nhau.
function body(file) {
  const line = fs.readFileSync(file, 'utf8').split('\n').find((l) => l.includes('return')) || '';
  const clean = line.trim().replace(/^return\s*/, '').replace(/;$/, '');
  const branch = clean.match(/\?\s*(.+?)\s*:/);
  return branch ? branch[1] : clean;
}

const A = pick('without', 'cart-run-A.js');
const B = pick('with', 'cart-run-B.js');
const gA = runGate(A.file);
const gB = runGate(B.file);

// Căn cột: đo trên chuỗi KHÔNG màu, bọc màu sau khi đã đệm.
const W = [20, 30, 30];
const fit = (s, w) => ([...s].length > w ? [...s].slice(0, w - 1).join('') + '…' : s);
const pad = (s, w) => { s = fit(s, w); return s + ' '.repeat(Math.max(0, w - [...s].length)); };
const paint = (s, w, c) => (c ? c + pad(s, w) + C.off : pad(s, w));

const bar = (l, m, r) => l + W.map((w) => '─'.repeat(w + 2)).join(m) + r;
function row(cells, colors = []) {
  console.log('│ ' + cells.map((c, i) => paint(c, W[i], colors[i])).join(' │ ') + ' │');
}

console.log();
console.log(bar('┌', '┬', '┐'));
row(['', 'CÁCH 1 — không cửa kiểm', 'CÁCH 2 — có test.js'], ['', C.bold, C.bold]);
console.log(bar('├', '┼', '┤'));
row(['trong thư mục', 'task.txt', 'task.txt  +  test.js']);
row(['ai chốt phải thử gì', 'AI tự chốt', 'NGƯỜI chốt, trước khi giao'], ['', C.red, C.green]);
row(['ai chấm điểm', 'AI tự chấm', 'node test.js → mã thoát'], ['', C.red, C.green]);
console.log(bar('├', '┼', '┤'));
row(['công thức giảm giá', body(A.file), body(B.file)], ['', C.red, C.green]);
row(['AI tự báo', '"tất cả đều đạt"', '"tất cả đều đạt"'], ['', C.dim, C.dim]);
console.log(bar('├', '┼', '┤'));
row(['1.000.001  ra', gA.got, gB.got], [C.bold, C.bold + C.red, C.bold + C.green]);
row(['cửa kiểm của NGƯỜI',
  (gA.exit === 0 ? 'PASS' : 'FAIL') + '   (mã thoát ' + gA.exit + ')',
  (gB.exit === 0 ? 'PASS' : 'FAIL') + '   (mã thoát ' + gB.exit + ')'],
  [C.bold, C.bold + (gA.exit === 0 ? C.green : C.red), C.bold + (gB.exit === 0 ? C.green : C.red)]);
console.log(bar('├', '┼', '┤'));
row(['nguồn số liệu', A.from, B.from], ['', C.dim, C.dim]);
console.log(bar('└', '┴', '┘'));
console.log();
console.log(C.bold + 'Hai cột AI đều báo "đạt". Chỉ dòng cuối phân biệt được cột nào sai.' + C.off);
console.log(C.dim + 'Cùng model, cùng phút, cùng đề bài — khác nhau đúng một file.' + C.off);
console.log();
