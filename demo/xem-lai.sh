#!/bin/bash
# Phát lại lần chạy thật ngày 08/11/2026. KHÔNG cần AI, không cần mạng.
# Chạy: npm run demo
set -u
R="$(cd "$(dirname "$0")/.." && pwd)"
K="$R/demo/ket-qua-08-11-2026"
BAR="=============================================================="
tieu_de() { printf '\n%s\n %s\n%s\n' "$BAR" "$1" "$BAR"; }
gach() { printf '\n%s\n' "$BAR"; }

tieu_de "ĐỀ BÀI — giống nhau cả hai lần"
cat "$R/thu-tai-nha/khong-co-harness/de-bai.txt"

tieu_de "LẦN A — thư mục trống. AI tự chọn trường hợp thử, tự chấm."
echo ">>> Code AI viết ra:"
sed -n '1,3p' "$K/giohang-lan-A.js"
echo
echo ">>> Bảy trường hợp AI TỰ CHỌN để tự kiểm (trích bản ghi):"
echo "      [0, 0]  [500.000, 500.000]  [999.999, 999.999]  [1.000.000, 900.000]"
echo "      [1.000.001, 900.000.9]   <-- AI tự ghi đáp số này rồi tự chấm ĐẠT"
echo "      [1.500.000, 1.350.000]  [2.000.000, 1.800.000]"
echo
echo ">>> AI tự báo: \"Đã tự kiểm tra, đạt 7/7 trường hợp.\"   (23.907 token)"
echo
echo ">>> Đem code đó qua cửa kiểm do NGƯỜI viết:"
node "$R/harness/03-gate/gate.js" --viec gio-hang --file "$K/giohang-lan-A.js" || echo "    ^ mã thoát 1"

tieu_de "LẦN B — thêm đúng một file test.js do người viết trước."
echo ">>> Code AI viết ra:"
sed -n '1,3p' "$K/giohang-lan-B.js"
echo
echo ">>> AI tự báo: \"Đã chạy node test.js: 5/5 ĐẠT.\"   (5.159 token)"
echo
echo ">>> Đem code đó qua cửa kiểm do NGƯỜI viết:"
node "$R/harness/03-gate/gate.js" --viec gio-hang --file "$K/giohang-lan-B.js" && echo "    ^ mã thoát 0"

gach
echo " Khác biệt KHÔNG phải model thông minh hơn — cùng model, cùng một phút."
echo " Khác biệt là lần B có một file người viết trước. Đó chính là harness."
echo
echo " Tự thử bằng AI của mình: xem thu-tai-nha/README.md"
gach
