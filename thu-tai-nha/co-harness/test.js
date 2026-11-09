// Danh sách trường hợp phải thử — NGƯỜI chốt, TRƯỚC khi giao việc cho AI.
// Quyết định của người: tiền khách trả phải là số nguyên đồng.
const { tinhTien } = require('./giohang.js');

const CA = [
  { tien: 0,       phaiTra: 0,       vi: 'đơn rỗng' },
  { tien: 999999,  phaiTra: 999999,  vi: 'dưới ngưỡng, không giảm' },
  { tien: 1000000, phaiTra: 900000,  vi: 'ĐÚNG NGƯỠNG, phải được giảm' },
  { tien: 1000001, phaiTra: 900001,  vi: 'TIỀN PHẢI LÀ SỐ NGUYÊN ĐỒNG' },
  { tien: 1200000, phaiTra: 1080000, vi: 'trên ngưỡng, có giảm' },
];

let hong = 0;
for (const c of CA) {
  const ra = tinhTien(c.tien);
  const dat = ra === c.phaiTra;
  if (!dat) hong++;
  console.log(`${dat ? 'DAT ' : 'HONG'}  ${c.tien} -> ${ra}  (phai la ${c.phaiTra})  ${c.vi}`);
}
console.log(hong === 0 ? '\nTAT CA DAT' : `\n${hong} TRUONG HOP HONG`);
process.exit(hong === 0 ? 0 : 1);
