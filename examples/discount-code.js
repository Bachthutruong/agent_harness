const CODES = {
  SALE10: { kind: 'percent', value: 10 },
  SALE50K: { kind: 'fixed', value: 50000 },
};

function applyDiscountCode(amount, code) {
  const rule = CODES[code];
  if (!rule) return amount; // mã lạ: giữ nguyên tiền, không ném lỗi
  const off = rule.kind === 'percent' ? Math.round((amount * rule.value) / 100) : rule.value;
  return Math.max(0, amount - off); // không để tiền âm
}

module.exports = { applyDiscountCode };
