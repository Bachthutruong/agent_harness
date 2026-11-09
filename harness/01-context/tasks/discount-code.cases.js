// Đầu việc thứ hai. Thêm nó KHÔNG phải sửa gate hay verify — chỉ thêm file này.
module.exports = {
  title: 'Mã giảm giá — áp mã vào đơn',
  module: '../../../examples/discount-code.js',
  fn: 'applyDiscountCode',

  decision: 'Mã lạ thì giữ nguyên tiền, không ném lỗi. Giảm không được làm tiền âm.',

  cases: [
    { input: [100000, 'SALE10'], expected: 90000, why: 'mã phần trăm' },
    { input: [100000, 'SALE50K'], expected: 50000, why: 'mã tiền cố định' },
    { input: [100000, 'NOSUCHCODE'], expected: 100000, why: 'MÃ LẠ THÌ GIỮ NGUYÊN, không ném lỗi' },
    { input: [100000, ''], expected: 100000, why: 'không nhập mã' },
    { input: [30000, 'SALE50K'], expected: 0, why: 'GIẢM KHÔNG ĐƯỢC LÀM TIỀN ÂM' },
    { input: [100001, 'SALE10'], expected: 90001, why: 'vẫn phải là số nguyên đồng' },
  ],
};
