#!/bin/bash
# VIỆC 05 — ROLLBACK: chụp TRƯỚC khi ghi, một lệnh là trả về chỗ cũ.
#
#   ./harness/05-rollback/snapshot.sh chup       chụp vi-du/ lại
#   ./harness/05-rollback/snapshot.sh liet-ke    xem các bản đã chụp
#   ./harness/05-rollback/snapshot.sh tra-ve     trả về bản chụp gần nhất
#
# Chụp trước khi giao việc cho AI. Không chụp thì không có đường lùi, và lúc cần
# thì đã muộn.
set -u

HERE="$(cd "$(dirname "$0")/../.." && pwd)"
NGUON="$HERE/vi-du"
KHO="$HERE/.anh-chup"

case "${1:-}" in
  chup)
    TEN="$(date +%Y%m%d-%H%M%S)"
    mkdir -p "$KHO/$TEN"
    cp -R "$NGUON/." "$KHO/$TEN/"
    echo "Đã chụp vi-du/ -> .anh-chup/$TEN"
    ;;
  liet-ke)
    [ -d "$KHO" ] || { echo "Chưa có bản chụp nào."; exit 0; }
    ls -1 "$KHO"
    ;;
  tra-ve)
    [ -d "$KHO" ] || { echo "Chưa có bản chụp nào để trả về." >&2; exit 1; }
    MOI="$(ls -1 "$KHO" | tail -n 1)"
    [ -n "$MOI" ] || { echo "Kho chụp rỗng." >&2; exit 1; }
    rm -rf "${NGUON:?}"/*
    cp -R "$KHO/$MOI/." "$NGUON/"
    echo "Đã trả vi-du/ về bản chụp $MOI"
    ;;
  *)
    echo "Dùng: $0 chup | liet-ke | tra-ve" >&2
    exit 2
    ;;
esac
