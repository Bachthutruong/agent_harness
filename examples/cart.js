// Đây là chỗ AI ghi code vào. File đang là kết quả LẦN B trong bản ghi ở demo/ —
// lần có cửa kiểm do người viết sẵn, nên nó tự thêm Math.round.
//
// Muốn thấy lần A hỏng thế nào: npm run try-run-A

function calcTotal(amount) {
  return amount >= 1000000 ? Math.round(amount * 0.9) : amount;
}

module.exports = { calcTotal };
