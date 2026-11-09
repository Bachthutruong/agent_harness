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

BUOC=(
  "node harness/03-gate/gate.js"
  "node harness/04-verify/verify.js"
)

R="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$R"

for b in "${BUOC[@]}"; do
  echo "=============================================================="
  echo " \$ $b"
  echo "=============================================================="
  if ! eval "$b"; then
    echo
    echo ">>> DUNG tai buoc: $b"
    echo ">>> Cua kiem KHONG cho qua. Agent phai lam lai, khong duoc bao xong."
    exit 1
  fi
  echo
done

echo "=============================================================="
echo " CUA KIEM CHO QUA — tat ca ${#BUOC[@]} buoc deu thoat 0"
echo "=============================================================="
