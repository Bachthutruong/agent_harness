#!/bin/bash
# Dựng một thư mục sạch để tự thử bằng AI của mình — NGOÀI repo.
#
# Vì sao phải ra ngoài repo: mở AI ngay trong repo thì nó đọc được README.md,
# biết trước cái bẫy làm tròn, và thí nghiệm mất sạch ý nghĩa. Bản ghi ngày
# 08/11 cũng chạy trong thư mục tạm, chỉ có đúng đề bài.
#
#   npm run try:without     thư mục KHÔNG có cửa kiểm
#   npm run try:with        thư mục CÓ test.js do người viết
set -u

KIND="${1:-}"
case "$KIND" in
  without|with) ;;
  *) echo "Usage: $0 without|with" >&2; exit 2 ;;
esac

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/try-it-yourself/$KIND-harness"

# Đường dẫn cố định và ngắn, không phải mktemp ngẫu nhiên: để câu lệnh in ra
# copy dán được, và lần nào chạy cũng ra đúng một chỗ dễ nhớ.
DEST="/tmp/harness-try-$KIND"
rm -rf "$DEST"          # làm mới mỗi lần, không để sót code của lần thử trước
mkdir -p "$DEST"
cp "$SRC"/* "$DEST/"

echo "=============================================================="
echo " Thư mục thử: $DEST"
echo " Trong đó có: $(cd "$DEST" && ls | tr '\n' ' ')"
echo "=============================================================="
echo
echo "BƯỚC 1 — copy đúng dòng này, dán vào terminal:"
echo
echo "    cd $DEST && codex"
echo
echo "BƯỚC 2 — dán nguyên văn đề bài vào chat:"
echo
sed 's/^/    /' "$DEST/task.txt"
echo
echo "BƯỚC 3 — khi nó báo xong, ĐỌC KỸ câu nó báo, rồi chấm bằng cửa kiểm của người:"
echo
echo "    node $ROOT/harness/03-gate/gate.js --task cart --file $DEST/cart.js"
echo
echo "Nếu cửa kiểm báo 'CANNOT LOAD' (thoát 2) thì file thiếu dòng export."
echo "Thêm đúng dòng này vào cuối cart.js rồi chạy lại, đừng sửa gì khác:"
echo
echo "    module.exports = { calcTotal };"
echo
echo "Xong thì xoá thư mục thử:  rm -rf $DEST"
echo "=============================================================="
