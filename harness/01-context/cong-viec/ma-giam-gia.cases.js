// Đầu việc thứ hai. Thêm nó KHÔNG phải sửa gate hay verify — chỉ thêm file này.
module.exports = {
  ten: 'Mã giảm giá — áp mã vào đơn',
  module: '../../../vi-du/magiamgia.js',
  ham: 'apDungMa',

  quyetDinh: 'Mã lạ thì giữ nguyên tiền, không ném lỗi. Giảm không được làm tiền âm.',

  truongHop: [
    { vao: [100000, 'GIAM10'], ra: 90000, vi: 'mã phần trăm' },
    { vao: [100000, 'GIAM50K'], ra: 50000, vi: 'mã tiền cố định' },
    { vao: [100000, 'KHONGCOMA'], ra: 100000, vi: 'MÃ LẠ THÌ GIỮ NGUYÊN, không ném lỗi' },
    { vao: [100000, ''], ra: 100000, vi: 'không nhập mã' },
    { vao: [30000, 'GIAM50K'], ra: 0, vi: 'GIẢM KHÔNG ĐƯỢC LÀM TIỀN ÂM' },
    { vao: [100001, 'GIAM10'], ra: 90001, vi: 'vẫn phải là số nguyên đồng' },
  ],
};
