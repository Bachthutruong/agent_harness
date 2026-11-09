#!/bin/bash
# CỬA KIỂM của cả repo — thứ agent phải qua trước khi báo xong.
#
# Đây là chỗ trả lời câu "nhiều task thì mỗi task một harness à?".
# KHÔNG. Cửa kiểm chỉ có MỘT, là file này. Ở dự án thật nó thường không có dòng nào
# mới cả — chỉ là những lệnh bạn đã chạy hằng ngày, nối lại, và dừng ở lệnh đầu tiên
# thoát khác 0:
#
#     npm run typecheck
#     npm run lint
#     npm test
#     pytest -q
#     ./gradlew check
#
# Thêm một đầu việc mới thì bạn thêm test cho đầu việc đó — việc bạn vẫn làm.
# File này không đổi.
set -uo pipefail

STEPS=(
  "node harness/03-gate/gate.js"
  "node harness/04-verify/verify.js"
)

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

for step in "${STEPS[@]}"; do
  echo "=============================================================="
  echo " \$ $step"
  echo "=============================================================="
  if ! eval "$step"; then
    echo
    echo ">>> STOPPED at step: $step"
    echo ">>> Gate did NOT pass. Agent phải làm lại, không được báo xong."
    exit 1
  fi
  echo
done

echo "=============================================================="
echo " GATE PASSED — tất cả ${#STEPS[@]} bước đều thoát 0"
echo "=============================================================="
