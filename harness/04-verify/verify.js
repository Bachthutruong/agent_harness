#!/usr/bin/env node
// VIỆC 04 — VERIFY: ba lượt soát, mỗi lượt đi tìm MỘT kiểu lỗi.
//
// Nhiệm vụ của mỗi lượt là TÌM RA LỖI, không phải xác nhận "ổn rồi".
// Như gate, bộ máy này viết một lần và chạy cho mọi đầu việc trong cong-viec/.
//
//   node harness/04-verify/verify.js                 soát mọi đầu việc
//   node harness/04-verify/verify.js --viec phi-ship
//
// Slide trong seminar nói "qua khi 2 trong 3 lượt không tìm được lỗi" — đó là khi ba lượt
// là ba NGƯỜI soát độc lập. Ở đây ba lượt là ba LOẠI kiểm khác nhau, nên cả ba phải đạt:
// một lượt tìm ra lỗi thật thì hai lượt kia không bỏ phiếu lấp đi được.

const path = require('path');
const fs = require('fs');
const { spawnSync } = require('child_process');
const { napDauViec } = require('../01-context');

const i = process.argv.indexOf('--viec');
const chonViec = i === -1 ? null : process.argv[i + 1];
const dauViec = napDauViec().filter((v) => !chonViec || v.ma === chonViec);

if (dauViec.length === 0) {
  console.error('Khong co dau viec ten "' + chonViec + '".');
  process.exit(2);
}

// Lượt 1 — ĐÚNG CHƯA: chạy lại gate, lấy mã thoát làm kết luận.
function luotDung(viec) {
  const r = spawnSync(
    process.execPath,
    [path.join(__dirname, '..', '03-gate', 'gate.js'), '--viec', viec.ma],
    { encoding: 'utf8' },
  );
  return {
    ten: 'Đúng chưa?',
    tim: 'kết quả có khớp danh sách trường hợp không',
    dat: r.status === 0,
    chiTiet: (r.stdout || '').split('\n').map((d) => d.trim()).filter((d) => d.startsWith('HONG')),
  };
}

// Lượt 2 — AN TOÀN CHƯA: đọc mã nguồn, tìm thứ một hàm tính toán không được chạm.
const CAM = [
  [/\beval\s*\(/, 'gọi eval()'],
  [/new\s+Function\s*\(/, 'dựng hàm từ chuỗi'],
  [/require\(\s*['"]child_process['"]\s*\)/, 'chạy lệnh hệ thống'],
  [/require\(\s*['"]fs['"]\s*\)/, 'đọc ghi file'],
  [/require\(\s*['"]https?['"]\s*\)|\bfetch\s*\(/, 'gọi ra mạng'],
  [/\bprocess\.env\b/, 'đọc biến môi trường'],
];

function luotAnToan(viec) {
  const ma = fs.readFileSync(viec.duongDan, 'utf8');
  const thay = CAM.filter(([re]) => re.test(ma)).map(([, vi]) => vi);
  return {
    ten: 'An toàn chưa?',
    tim: 'hàm có chạm vào thứ nó không cần không',
    dat: thay.length === 0,
    chiTiet: thay,
  };
}

// Lượt 3 — CHẠY LẠI RA Y HỆT CHƯA: gọi ba lần, kết quả phải trùng nhau.
function luotOnDinh(viec) {
  const ham = require(viec.duongDan)[viec.ham];
  const lech = [];
  for (const c of viec.truongHop) {
    const ba = [ham(...c.vao), ham(...c.vao), ham(...c.vao)];
    if (!(ba[0] === ba[1] && ba[1] === ba[2])) {
      lech.push(viec.ham + '(' + c.vao.join(', ') + ') -> ' + ba.join(' / '));
    }
  }
  return {
    ten: 'Chạy lại ra y hệt chưa?',
    tim: 'cùng đầu vào có luôn ra cùng kết quả không',
    dat: lech.length === 0,
    chiTiet: lech,
  };
}

let hong = 0;
for (const viec of dauViec) {
  console.log('\n--- ' + viec.ten + '  [' + viec.ma + ']');
  for (const l of [luotDung(viec), luotAnToan(viec), luotOnDinh(viec)]) {
    if (!l.dat) hong++;
    console.log((l.dat ? '    DAT   ' : '    HONG  ') + l.ten + '  (' + l.tim + ')');
    for (const d of l.chiTiet) console.log('          ' + d);
  }
}

const tongLuot = dauViec.length * 3;
console.log(
  '\n' +
    (hong === 0
      ? tongLuot + '/' + tongLuot + ' LUOT KHONG TIM DUOC LOI'
      : hong + '/' + tongLuot + ' LUOT TIM DUOC LOI — khong cho qua'),
);
process.exit(hong === 0 ? 0 : 1);
