#!/bin/bash
# VIỆC 02 — TOOL: AI chỉ chạy được lệnh có trong danh sách.
#
# Chặn ở công cụ, không chặn bằng lời dặn. Lời dặn thì AI bỏ qua được — và nó bỏ qua thật.
#
#   ./harness/02-tool/run-command.sh node harness/03-gate/gate.js    → chạy
#   ./harness/02-tool/run-command.sh rm -rf examples                 → từ chối, thoát 3
#
# Cách dùng thật: cho agent chạy mọi lệnh QUA script này, đừng cho nó shell trần.
set -u

HERE="$(cd "$(dirname "$0")" && pwd)"
ALLOWLIST="$HERE/allowlist.txt"
CMD="$*"

if [ -z "${CMD// }" ]; then
  echo "Usage: $0 <command>" >&2
  exit 2
fi

while IFS= read -r line; do
  case "$line" in '#'*|'') continue ;; esac
  if [ "$CMD" = "$line" ] || [ "${CMD#"$line" }" != "$CMD" ]; then
    exec "$@"
  fi
done < "$ALLOWLIST"

echo "REFUSED: lệnh không có trong danh sách được phép." >&2
echo "  command:   $CMD" >&2
echo "  allowlist: $ALLOWLIST" >&2
exit 3
