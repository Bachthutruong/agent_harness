#!/bin/bash
# VIỆC 02 — TOOL: AI chỉ chạy được lệnh có trong danh sách.
#
# Chặn ở công cụ, không chặn bằng lời dặn. Lời dặn thì AI bỏ qua được — và nó bỏ qua thật.
#
#   ./harness/02-tool/chay-lenh.sh node harness/03-gate/gate.js    → chạy
#   ./harness/02-tool/chay-lenh.sh rm -rf vi-du                    → từ chối, thoát 3
#
# Cách dùng thật: cho agent chạy mọi lệnh QUA script này, đừng cho nó shell trần.
set -u

HERE="$(cd "$(dirname "$0")" && pwd)"
DANH_SACH="$HERE/lenh-duoc-phep.txt"
LENH="$*"

if [ -z "${LENH// }" ]; then
  echo "Dùng: $0 <lệnh cần chạy>" >&2
  exit 2
fi

while IFS= read -r dong; do
  case "$dong" in '#'*|'') continue ;; esac
  if [ "$LENH" = "$dong" ] || [ "${LENH#"$dong" }" != "$LENH" ]; then
    exec "$@"
  fi
done < "$DANH_SACH"

echo "TU CHOI: lệnh không có trong danh sách được phép." >&2
echo "  lệnh:      $LENH" >&2
echo "  danh sách: $DANH_SACH" >&2
exit 3
