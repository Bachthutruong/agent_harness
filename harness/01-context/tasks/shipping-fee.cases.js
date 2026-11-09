// Đầu việc thứ ba. Hàm hai tham số — cùng một bộ máy chạy được, không sửa gì.
module.exports = {
  title: 'Phí ship — tính theo cân nặng và khu vực',
  module: '../../../examples/shipping-fee.js',
  fn: 'calcShippingFee',

  decision: 'Cân nặng làm tròn LÊN theo khối 500g, không làm tròn gần nhất.',

  cases: [
    { input: [0, true], expected: 0, why: 'đơn không có hàng' },
    { input: [500, true], expected: 15000, why: 'khối đầu, nội thành' },
    { input: [501, true], expected: 20000, why: 'LÀM TRÒN LÊN — 501g tính thành 2 khối' },
    { input: [1000, false], expected: 30000, why: 'ngoại thành, 1kg' },
    { input: [1500, false], expected: 35000, why: 'ngoại thành, 1,5kg' },
  ],
};
