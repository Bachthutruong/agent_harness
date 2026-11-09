function calcShippingFee(grams, inCity) {
  if (grams <= 0) return 0;
  const units = Math.ceil(grams / 500); // làm tròn LÊN theo khối 500g
  const firstUnit = inCity ? 15000 : 25000;
  return firstUnit + (units - 1) * 5000;
}

module.exports = { calcShippingFee };
