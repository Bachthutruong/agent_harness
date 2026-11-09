#!/usr/bin/env node
// VIỆC 03 — GATE: máy chạy thử TRƯỚC khi kết quả tới tay người.
//
// Bộ máy này viết MỘT LẦN. Thêm đầu việc mới chỉ cần thêm một file trong
// harness/01-context/tasks/ — không ai phải mở lại file này.
//
//   node harness/03-gate/gate.js                    chạy MỌI đầu việc
//   node harness/03-gate/gate.js --task cart        chạy một đầu việc
//   node harness/03-gate/gate.js --task cart --file path/to/other.js [--fn otherName]
//
// Thoát 0 = đạt hết · 1 = có trường hợp hỏng · 2 = không nạp được file.

const path = require('path');
const { loadTasks } = require('../01-context');

function arg(name) {
  const i = process.argv.indexOf(name);
  return i === -1 ? null : process.argv[i + 1];
}

const taskFilter = arg('--task');
const fileOverride = arg('--file');
const fnOverride = arg('--fn');

let tasks = loadTasks();
if (taskFilter) {
  tasks = tasks.filter((t) => t.id === taskFilter);
  if (tasks.length === 0) {
    console.error('No task named "' + taskFilter + '".');
    console.error('Available: ' + loadTasks().map((t) => t.id).join(', '));
    process.exit(2);
  }
}
if (fileOverride || fnOverride) {
  if (tasks.length !== 1) {
    console.error('--file/--fn need --task <id>: they replace one task\'s file.');
    process.exit(2);
  }
  if (fileOverride) tasks[0].filePath = path.resolve(fileOverride);
  if (fnOverride) tasks[0].fn = fnOverride;
}

function same(a, b) {
  if (a === b) return true;
  if (a && b && typeof a === 'object' && typeof b === 'object') {
    return JSON.stringify(a) === JSON.stringify(b);
  }
  return false;
}

let failed = 0;
let total = 0;

for (const task of tasks) {
  console.log('\n--- ' + task.title + '  [' + task.id + ']');
  console.log('    người chốt: ' + task.decision);

  let fn;
  try {
    fn = require(task.filePath)[task.fn];
  } catch (err) {
    console.error('    CANNOT LOAD ' + task.filePath);
    console.error('    ' + err.message);
    process.exit(2);
  }
  if (typeof fn !== 'function') {
    console.error('    File does not export ' + task.fn + ': ' + task.filePath);
    process.exit(2);
  }

  for (const c of task.cases) {
    let got;
    try {
      got = fn(...c.input);
    } catch (err) {
      got = 'THREW: ' + err.message;
    }
    const pass = same(got, c.expected);
    total++;
    if (!pass) failed++;
    console.log(
      (pass ? '    PASS  ' : '    FAIL  ') +
        task.fn + '(' + c.input.join(', ') + ') -> ' + got +
        '  (expected ' + c.expected + ')  ' + c.why,
    );
  }
}

console.log(
  '\n' +
    (failed === 0
      ? 'ALL PASS — ' + total + ' case' + (total === 1 ? '' : 's') + ', ' +
        tasks.length + ' task' + (tasks.length === 1 ? '' : 's')
      : failed + '/' + total + ' CASES FAILED'),
);
process.exit(failed === 0 ? 0 : 1);
