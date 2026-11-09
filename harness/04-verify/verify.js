#!/usr/bin/env node
// VIỆC 04 — VERIFY: ba lượt soát, mỗi lượt đi tìm MỘT kiểu lỗi.
//
// Nhiệm vụ của mỗi lượt là TÌM RA LỖI, không phải xác nhận "ổn rồi".
// Hỏi "cái này đúng không?" thì gần như luôn nhận được "đúng rồi" — cả người lẫn AI
// đều nghiêng về xác nhận cái đang có.
//
//   node harness/04-verify/verify.js [duong/dan/file.js]
//
// Slide trong seminar nói "qua khi 2 trong 3 lượt không tìm được lỗi" — đó là khi ba lượt
// là ba NGƯỜI soát độc lập. Ở đây ba lượt là ba LOẠI kiểm khác nhau, nên cả ba phải đạt:
// một lượt tìm ra lỗi thật thì hai lượt kia không bỏ phiếu lấp đi được.

const path = require('path');
const fs = require('fs');
const { spawnSync } = require('child_process');
const { TRUONG_HOP } = require('../01-context/truong-hop.js');

const DUONG_DAN = path.resolve(
  process.argv[2] || path.join(__dirname, '..', '..', 'vi-du', 'giohang.js'),
);

// Lượt 1 — ĐÚNG CHƯA: chạy lại gate, lấy mã thoát làm kết luận.
function luotDung() {
  const r = spawnSync(
    process.execPath,
    [path.join(__dirname, '..', '03-gate', 'gate.js'), DUONG_DAN],
    { encoding: 'utf8' },
  );
  return {
    ten: 'Đúng chưa?',
    tim: 'kết quả có khớp danh sách trường hợp không',
    dat: r.status === 0,
    chiTiet: (r.stdout || '').trim().split('\n').filter((d) => d.startsWith('HONG')),
  };
}

// Lượt 2 — AN TOÀN CHƯA: đọc mã nguồn, tìm thứ một hàm tính tiền không được phép chạm.
const CAM = [
  [/\beval\s*\(/, 'gọi eval()'],
  [/new\s+Function\s*\(/, 'dựng hàm từ chuỗi'],
  [/require\(\s*['"]child_process['"]\s*\)/, 'chạy lệnh hệ thống'],
  [/require\(\s*['"]fs['"]\s*\)/, 'đọc ghi file'],
  [/require\(\s*['"]https?['"]\s*\)|\bfetch\s*\(/, 'gọi ra mạng'],
  [/\bprocess\.env\b/, 'đọc biến môi trường'],
];

function luotAnToan() {
  const ma = fs.readFileSync(DUONG_DAN, 'utf8');
  const thay = CAM.filter(([re]) => re.test(ma)).map(([, vi]) => vi);
  return {
    ten: 'An toàn chưa?',
    tim: 'hàm tính tiền có chạm vào thứ nó không cần không',
    dat: thay.length === 0,
    chiTiet: thay,
  };
}

// Lượt 3 — CHẠY LẠI RA Y HỆT CHƯA: gọi ba lần, kết quả phải trùng nhau.
function luotOnDinh() {
  const { tinhTien } = require(DUONG_DAN);
  const lech = [];
  for (const c of TRUONG_HOP) {
    const ba = [tinhTien(c.tien), tinhTien(c.tien), tinhTien(c.tien)];
    if (!(ba[0] === ba[1] && ba[1] === ba[2])) {
      lech.push(c.tien + ' -> ' + ba.join(' / '));
    }
  }
  return {
    ten: 'Chạy lại ra y hệt chưa?',
    tim: 'cùng một đầu vào có luôn ra cùng một kết quả không',
    dat: lech.length === 0,
    chiTiet: lech,
  };
}

const luot = [luotDung(), luotAnToan(), luotOnDinh()];
let hong = 0;

for (const l of luot) {
  if (!l.dat) hong++;
  console.log((l.dat ? 'DAT   ' : 'HONG  ') + l.ten + '  (' + l.tim + ')');
  for (const d of l.chiTiet) console.log('        ' + d);
}

console.log(
  hong === 0
    ? '\nCA BA LUOT KHONG TIM DUOC LOI'
    : '\n' + hong + '/3 LUOT TIM DUOC LOI — khong cho qua',
);
process.exit(hong === 0 ? 0 : 1);
