// Đầu việc: giỏ hàng. NGƯỜI viết file này TRƯỚC khi giao việc cho AI.
module.exports = {
  title: 'Giỏ hàng — giảm 10% từ 1.000.000đ',
  module: '../../../examples/cart.js',
  fn: 'calcTotal',

  // Quyết định của người, không model nào đoán hộ được:
  decision: 'Tiền khách trả là số nguyên đồng.',

  cases: [
    { input: [0], expected: 0, why: 'đơn rỗng' },
    { input: [999999], expected: 999999, why: 'dưới ngưỡng, không giảm' },
    { input: [1000000], expected: 900000, why: 'ĐÚNG NGƯỠNG, phải được giảm' },
    { input: [1000001], expected: 900001, why: 'TIỀN PHẢI LÀ SỐ NGUYÊN ĐỒNG' },
    { input: [1200000], expected: 1080000, why: 'trên ngưỡng, có giảm' },
  ],
};
