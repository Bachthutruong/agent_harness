function tinhTien(tien) {
  return tien >= 1000000 ? Math.round(tien * 0.9) : tien;
}

module.exports = { tinhTien };
