// VIỆC 01 — CONTEXT: ai quyết phải thử trường hợp nào.
//
// File này là source of truth của cả harness. NGƯỜI viết nó TRƯỚC khi giao việc cho AI.
// Gate và Verify đều đọc lại từ đây — không thành phần nào tự chế danh sách riêng.
//
// Quyết định nghiệp vụ mà không model nào đoán hộ được:
//     tiền khách phải trả là SỐ NGUYÊN ĐỒNG.
// Thiếu đúng dòng đó là ra lỗi 900.000,9 đồng trong bản ghi ở demo/.

const MO_TA = [
  'Viết hàm tinhTien(tien) trong vi-du/giohang.js, export bằng module.exports.',
  'Đơn hàng từ 1.000.000đ trở lên được giảm 10%.',
  'Hàm trả về số tiền khách phải trả.',
].join('\n');

const TRUONG_HOP = [
  { tien: 0, phaiTra: 0, vi: 'đơn rỗng' },
  { tien: 999999, phaiTra: 999999, vi: 'dưới ngưỡng, không giảm' },
  { tien: 1000000, phaiTra: 900000, vi: 'ĐÚNG NGƯỠNG, phải được giảm' },
  { tien: 1000001, phaiTra: 900001, vi: 'TIỀN PHẢI LÀ SỐ NGUYÊN ĐỒNG' },
  { tien: 1200000, phaiTra: 1080000, vi: 'trên ngưỡng, có giảm' },
];

module.exports = { MO_TA, TRUONG_HOP };
