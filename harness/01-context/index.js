// VIỆC 01 — CONTEXT: nạp mọi đầu việc trong cong-viec/.
//
// Thêm một đầu việc mới = thêm MỘT file `cong-viec/<ten>.cases.js`.
// Không sửa file này, không sửa gate.js, không sửa verify.js. Đó là ý nghĩa của
// chữ "harness": bộ máy viết một lần, việc mới chỉ thêm dữ liệu.

const fs = require('fs');
const path = require('path');

const THU_MUC = path.join(__dirname, 'cong-viec');

function napDauViec() {
  return fs
    .readdirSync(THU_MUC)
    .filter((t) => t.endsWith('.cases.js'))
    .sort()
    .map((t) => {
      const dinhNghia = require(path.join(THU_MUC, t));
      return {
        ...dinhNghia,
        ma: t.replace('.cases.js', ''),
        duongDan: path.resolve(THU_MUC, dinhNghia.module),
      };
    });
}

module.exports = { napDauViec };
