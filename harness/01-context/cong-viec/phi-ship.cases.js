// Đầu việc thứ ba. Hàm hai tham số — cùng một bộ máy chạy được, không sửa gì.
module.exports = {
  ten: 'Phí ship — tính theo cân nặng và khu vực',
  module: '../../../vi-du/phiship.js',
  ham: 'tinhPhiShip',

  quyetDinh: 'Cân nặng làm tròn LÊN theo khối 500g, không làm tròn gần nhất.',

  truongHop: [
    { vao: [0, true], ra: 0, vi: 'đơn không có hàng' },
    { vao: [500, true], ra: 15000, vi: 'khối đầu, nội thành' },
    { vao: [501, true], ra: 20000, vi: 'LÀM TRÒN LÊN — 501g tính thành 2 khối' },
    { vao: [1000, false], ra: 30000, vi: 'ngoại thành, 1kg' },
    { vao: [1500, false], ra: 35000, vi: 'ngoại thành, 1,5kg' },
  ],
};
