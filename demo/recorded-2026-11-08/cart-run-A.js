function tinhTien(tien) {
  return tien >= 1_000_000 ? tien * 0.9 : tien;
}

// (dòng export do harness thêm để nạp được file; phần logic ở trên giữ nguyên)
module.exports = { tinhTien };
