#!/bin/bash
# Chạy THẬT hai lần bằng agent CLI. Cần `codex` đã đăng nhập. Mỗi lần ~1-3 phút.
# Chạy: npm run demo:that
#
# Dùng agent khác: sửa hàm goi_agent() bên dưới. Đề bài và cửa kiểm giữ nguyên.
set -u
R="$(cd "$(dirname "$0")/.." && pwd)"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

goi_agent() {  # $1 = thư mục làm việc, $2 = đề bài
  codex exec -C "$1" -s workspace-write --skip-git-repo-check --color never "$2" < /dev/null
}

command -v codex > /dev/null || {
  echo "Không thấy lệnh codex. Xem lại bản ghi cũ bằng: npm run demo" >&2
  exit 1
}

mkdir -p "$TMP/lan-A" "$TMP/lan-B"
cp "$R/thu-tai-nha/khong-co-harness/de-bai.txt" "$TMP/lan-A/"
cp "$R/thu-tai-nha/co-harness/de-bai.txt" "$TMP/lan-B/"
cp "$R/thu-tai-nha/co-harness/test.js" "$TMP/lan-B/"

echo "=============================================================="
echo " LẦN A — không ai chốt trước phải thử gì. AI tự kiểm, tự báo."
echo "=============================================================="
goi_agent "$TMP/lan-A" "$(cat "$TMP/lan-A/de-bai.txt")"
echo; echo ">>> Code lần A viết ra:"; cat "$TMP/lan-A/giohang.js"

echo
echo "=============================================================="
echo " LẦN B — người chốt danh sách trường hợp TRƯỚC khi giao việc."
echo "=============================================================="
goi_agent "$TMP/lan-B" "$(cat "$TMP/lan-B/de-bai.txt")"
echo; echo ">>> Code lần B viết ra:"; cat "$TMP/lan-B/giohang.js"

echo
echo "=============================================================="
echo " ĐỐI CHỨNG — đem code LẦN A qua cửa kiểm do NGƯỜI viết"
echo "=============================================================="
grep -q 'module.exports' "$TMP/lan-A/giohang.js" || \
  printf '\nmodule.exports = { tinhTien };\n' >> "$TMP/lan-A/giohang.js"
node "$R/harness/03-gate/gate.js" --viec gio-hang --file "$TMP/lan-A/giohang.js"
