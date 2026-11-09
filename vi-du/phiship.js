function tinhPhiShip(gam, noiThanh) {
  if (gam <= 0) return 0;
  const khoi = Math.ceil(gam / 500); // làm tròn LÊN theo khối 500g
  const khoiDau = noiThanh ? 15000 : 25000;
  return khoiDau + (khoi - 1) * 5000;
}

module.exports = { tinhPhiShip };
