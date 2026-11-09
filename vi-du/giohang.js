// Đây là chỗ AI ghi code vào. File đang là kết quả LẦN B trong bản ghi ở demo/ —
// lần có cửa kiểm do người viết sẵn, nên nó tự thêm Math.round.
//
// Muốn thấy lần A hỏng thế nào: npm run thu-lan-A

function tinhTien(tien) {
  return tien >= 1000000 ? Math.round(tien * 0.9) : tien;
}

module.exports = { tinhTien };
