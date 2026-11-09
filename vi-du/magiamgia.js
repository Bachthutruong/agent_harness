const MA = {
  GIAM10: { kieu: 'phan-tram', tri: 10 },
  GIAM50K: { kieu: 'tien', tri: 50000 },
};

function apDungMa(tien, ma) {
  const m = MA[ma];
  if (!m) return tien; // mã lạ: giữ nguyên tiền, không ném lỗi
  const bot = m.kieu === 'phan-tram' ? Math.round((tien * m.tri) / 100) : m.tri;
  return Math.max(0, tien - bot); // không để tiền âm
}

module.exports = { apDungMa };
