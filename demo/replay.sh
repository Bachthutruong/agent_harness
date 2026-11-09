#!/bin/bash
# Phát lại lần chạy thật ngày 08/11/2026. KHÔNG cần AI, không cần mạng.
# Chạy: npm run demo
set -u
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
REC="$ROOT/demo/recorded-2026-11-08"
BAR="=============================================================="
heading() { printf '\n%s\n %s\n%s\n' "$BAR" "$1" "$BAR"; }
rule() { printf '\n%s\n' "$BAR"; }

heading "ĐỀ BÀI — giống nhau cả hai lần"
cat "$ROOT/try-it-yourself/without-harness/task.txt"

heading "LẦN A — thư mục trống. AI tự chọn trường hợp thử, tự chấm."
echo ">>> Code AI viết ra:"
sed -n '1,3p' "$REC/cart-run-A.js"
echo
echo ">>> Bảy trường hợp AI TỰ CHỌN để tự kiểm (trích bản ghi):"
echo "      [0, 0]  [500.000, 500.000]  [999.999, 999.999]  [1.000.000, 900.000]"
echo "      [1.000.001, 900.000.9]   <-- AI tự ghi đáp số này rồi tự chấm ĐẠT"
echo "      [1.500.000, 1.350.000]  [2.000.000, 1.800.000]"
echo
echo ">>> AI tự báo: \"Đã tự kiểm tra, đạt 7/7 trường hợp.\"   (23.907 token)"
echo
echo ">>> Đem code đó qua cửa kiểm do NGƯỜI viết:"
node "$ROOT/harness/03-gate/gate.js" --task cart --file "$REC/cart-run-A.js" --fn tinhTien \
  || echo "    ^ mã thoát 1"

heading "LẦN B — thêm đúng một file test.js do người viết trước."
echo ">>> Code AI viết ra:"
sed -n '1,3p' "$REC/cart-run-B.js"
echo
echo ">>> AI tự báo: \"Đã chạy node test.js: 5/5 ĐẠT.\"   (5.159 token)"
echo
echo ">>> Đem code đó qua cửa kiểm do NGƯỜI viết:"
node "$ROOT/harness/03-gate/gate.js" --task cart --file "$REC/cart-run-B.js" --fn tinhTien \
  && echo "    ^ mã thoát 0"

rule
echo " Khác biệt KHÔNG phải model thông minh hơn — cùng model, cùng một phút."
echo " Khác biệt là lần B có một file người viết trước. Đó chính là harness."
echo
echo " Tự thử bằng AI của mình: xem try-it-yourself/README.md"
rule
