#!/usr/bin/env node
// VIỆC 04 — VERIFY: ba lượt soát, mỗi lượt đi tìm MỘT kiểu lỗi.
//
// Nhiệm vụ của mỗi lượt là TÌM RA LỖI, không phải xác nhận "ổn rồi".
// Như gate, bộ máy này viết một lần và chạy cho mọi đầu việc trong tasks/.
//
//   node harness/04-verify/verify.js                  soát mọi đầu việc
//   node harness/04-verify/verify.js --task shipping-fee
//
// Slide trong seminar nói "qua khi 2 trong 3 lượt không tìm được lỗi" — đó là khi ba lượt
// là ba NGƯỜI soát độc lập. Ở đây ba lượt là ba LOẠI kiểm khác nhau, nên cả ba phải đạt:
// một lượt tìm ra lỗi thật thì hai lượt kia không bỏ phiếu lấp đi được.

const path = require('path');
const fs = require('fs');
const { spawnSync } = require('child_process');
const { loadTasks } = require('../01-context');

const i = process.argv.indexOf('--task');
const taskFilter = i === -1 ? null : process.argv[i + 1];
const tasks = loadTasks().filter((t) => !taskFilter || t.id === taskFilter);

if (tasks.length === 0) {
  console.error('No task named "' + taskFilter + '".');
  process.exit(2);
}

// Lượt 1 — ĐÚNG CHƯA: chạy lại gate, lấy mã thoát làm kết luận.
function lensCorrect(task) {
  const r = spawnSync(
    process.execPath,
    [path.join(__dirname, '..', '03-gate', 'gate.js'), '--task', task.id],
    { encoding: 'utf8' },
  );
  return {
    name: 'Đúng chưa?',
    looksFor: 'kết quả có khớp danh sách trường hợp không',
    pass: r.status === 0,
    details: (r.stdout || '').split('\n').map((l) => l.trim()).filter((l) => l.startsWith('FAIL')),
  };
}

// Lượt 2 — AN TOÀN CHƯA: đọc mã nguồn, tìm thứ một hàm tính toán không được chạm.
const FORBIDDEN = [
  [/\beval\s*\(/, 'gọi eval()'],
  [/new\s+Function\s*\(/, 'dựng hàm từ chuỗi'],
  [/require\(\s*['"]child_process['"]\s*\)/, 'chạy lệnh hệ thống'],
  [/require\(\s*['"]fs['"]\s*\)/, 'đọc ghi file'],
  [/require\(\s*['"]https?['"]\s*\)|\bfetch\s*\(/, 'gọi ra mạng'],
  [/\bprocess\.env\b/, 'đọc biến môi trường'],
];

function lensSafe(task) {
  const src = fs.readFileSync(task.filePath, 'utf8');
  const found = FORBIDDEN.filter(([re]) => re.test(src)).map(([, why]) => why);
  return {
    name: 'An toàn chưa?',
    looksFor: 'hàm có chạm vào thứ nó không cần không',
    pass: found.length === 0,
    details: found,
  };
}

// Lượt 3 — CHẠY LẠI RA Y HỆT CHƯA: gọi ba lần, kết quả phải trùng nhau.
function lensStable(task) {
  const fn = require(task.filePath)[task.fn];
  const drift = [];
  for (const c of task.cases) {
    const three = [fn(...c.input), fn(...c.input), fn(...c.input)];
    if (!(three[0] === three[1] && three[1] === three[2])) {
      drift.push(task.fn + '(' + c.input.join(', ') + ') -> ' + three.join(' / '));
    }
  }
  return {
    name: 'Chạy lại ra y hệt chưa?',
    looksFor: 'cùng đầu vào có luôn ra cùng kết quả không',
    pass: drift.length === 0,
    details: drift,
  };
}

let failed = 0;
for (const task of tasks) {
  console.log('\n--- ' + task.title + '  [' + task.id + ']');
  for (const lens of [lensCorrect(task), lensSafe(task), lensStable(task)]) {
    if (!lens.pass) failed++;
    console.log((lens.pass ? '    PASS  ' : '    FAIL  ') + lens.name + '  (' + lens.looksFor + ')');
    for (const d of lens.details) console.log('          ' + d);
  }
}

const totalLenses = tasks.length * 3;
console.log(
  '\n' +
    (failed === 0
      ? totalLenses + '/' + totalLenses + ' LENSES FOUND NO BUG'
      : failed + '/' + totalLenses + ' LENSES FOUND A BUG — not letting it through'),
);
process.exit(failed === 0 ? 0 : 1);
