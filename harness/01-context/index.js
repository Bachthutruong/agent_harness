// VIỆC 01 — CONTEXT: nạp mọi đầu việc trong tasks/.
//
// Thêm một đầu việc mới = thêm MỘT file `tasks/<ten>.cases.js`.
// Không sửa file này, không sửa gate.js, không sửa verify.js. Đó là ý nghĩa của
// chữ "harness": bộ máy viết một lần, việc mới chỉ thêm dữ liệu.

const fs = require('fs');
const path = require('path');

const TASK_DIR = path.join(__dirname, 'tasks');

function loadTasks() {
  return fs
    .readdirSync(TASK_DIR)
    .filter((name) => name.endsWith('.cases.js'))
    .sort()
    .map((name) => {
      const def = require(path.join(TASK_DIR, name));
      return {
        ...def,
        id: name.replace('.cases.js', ''),
        filePath: path.resolve(TASK_DIR, def.module),
      };
    });
}

module.exports = { loadTasks };
