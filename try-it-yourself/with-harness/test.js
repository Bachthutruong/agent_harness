// Danh sách trường hợp phải thử — NGƯỜI chốt, TRƯỚC khi giao việc cho AI.
// Quyết định của người: tiền khách trả phải là số nguyên đồng.
const { calcTotal } = require('./cart.js');

const CASES = [
  { amount: 0,       expected: 0,       why: 'đơn rỗng' },
  { amount: 999999,  expected: 999999,  why: 'dưới ngưỡng, không giảm' },
  { amount: 1000000, expected: 900000,  why: 'ĐÚNG NGƯỠNG, phải được giảm' },
  { amount: 1000001, expected: 900001,  why: 'TIỀN PHẢI LÀ SỐ NGUYÊN ĐỒNG' },
  { amount: 1200000, expected: 1080000, why: 'trên ngưỡng, có giảm' },
];

let failed = 0;
for (const c of CASES) {
  const got = calcTotal(c.amount);
  const pass = got === c.expected;
  if (!pass) failed++;
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${c.amount} -> ${got}  (expected ${c.expected})  ${c.why}`);
}
console.log(failed === 0 ? '\nALL PASS' : `\n${failed} CASES FAILED`);
process.exit(failed === 0 ? 0 : 1);
