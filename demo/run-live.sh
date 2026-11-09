#!/bin/bash
# Chạy THẬT hai lần bằng agent CLI. Cần `codex` đã đăng nhập. Mỗi lần ~1-3 phút.
# Chạy: npm run demo:live
#
# Dùng agent khác: sửa hàm call_agent() bên dưới. Đề bài và cửa kiểm giữ nguyên.
set -u
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

call_agent() {  # $1 = thư mục làm việc, $2 = đề bài
  codex exec -C "$1" -s workspace-write --skip-git-repo-check --color never "$2" < /dev/null
}

command -v codex > /dev/null || {
  echo "Không thấy lệnh codex. Xem lại bản ghi cũ bằng: npm run demo" >&2
  exit 1
}

mkdir -p "$TMP/run-A" "$TMP/run-B"
cp "$ROOT/try-it-yourself/without-harness/task.txt" "$TMP/run-A/"
cp "$ROOT/try-it-yourself/with-harness/task.txt" "$TMP/run-B/"
cp "$ROOT/try-it-yourself/with-harness/test.js" "$TMP/run-B/"

echo "=============================================================="
echo " LẦN A — không ai chốt trước phải thử gì. AI tự kiểm, tự báo."
echo "=============================================================="
call_agent "$TMP/run-A" "$(cat "$TMP/run-A/task.txt")"
echo; echo ">>> Code lần A viết ra:"; cat "$TMP/run-A/cart.js"

echo
echo "=============================================================="
echo " LẦN B — người chốt danh sách trường hợp TRƯỚC khi giao việc."
echo "=============================================================="
call_agent "$TMP/run-B" "$(cat "$TMP/run-B/task.txt")"
echo; echo ">>> Code lần B viết ra:"; cat "$TMP/run-B/cart.js"

echo
echo "=============================================================="
echo " ĐỐI CHỨNG — đem code LẦN A qua cửa kiểm do NGƯỜI viết"
echo "=============================================================="
grep -q 'module.exports' "$TMP/run-A/cart.js" || \
  printf '\nmodule.exports = { calcTotal };\n' >> "$TMP/run-A/cart.js"
node "$ROOT/harness/03-gate/gate.js" --task cart --file "$TMP/run-A/cart.js"
