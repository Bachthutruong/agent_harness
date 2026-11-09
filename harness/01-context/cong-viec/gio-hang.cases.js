// Đầu việc: giỏ hàng. NGƯỜI viết file này TRƯỚC khi giao việc cho AI.
module.exports = {
  ten: 'Giỏ hàng — giảm 10% từ 1.000.000đ',
  module: '../../../vi-du/giohang.js',
  ham: 'tinhTien',

  // Quyết định của người, không model nào đoán hộ được:
  quyetDinh: 'Tiền khách trả là số nguyên đồng.',

  truongHop: [
    { vao: [0], ra: 0, vi: 'đơn rỗng' },
    { vao: [999999], ra: 999999, vi: 'dưới ngưỡng, không giảm' },
    { vao: [1000000], ra: 900000, vi: 'ĐÚNG NGƯỠNG, phải được giảm' },
    { vao: [1000001], ra: 900001, vi: 'TIỀN PHẢI LÀ SỐ NGUYÊN ĐỒNG' },
    { vao: [1200000], ra: 1080000, vi: 'trên ngưỡng, có giảm' },
  ],
};
