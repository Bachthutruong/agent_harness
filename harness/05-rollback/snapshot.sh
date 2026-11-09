#!/bin/bash
# VIỆC 05 — ROLLBACK: chụp TRƯỚC khi ghi, một lệnh là trả về chỗ cũ.
#
#   ./harness/05-rollback/snapshot.sh save      chụp examples/ lại
#   ./harness/05-rollback/snapshot.sh list      xem các bản đã chụp
#   ./harness/05-rollback/snapshot.sh restore   trả về bản chụp gần nhất
#
# Chụp trước khi giao việc cho AI. Không chụp thì không có đường lùi, và lúc cần
# thì đã muộn.
set -u

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SRC="$ROOT/examples"
STORE="$ROOT/.snapshots"

case "${1:-}" in
  save)
    NAME="$(date +%Y%m%d-%H%M%S)"
    mkdir -p "$STORE/$NAME"
    cp -R "$SRC/." "$STORE/$NAME/"
    echo "Đã chụp examples/ -> .snapshots/$NAME"
    ;;
  list)
    [ -d "$STORE" ] || { echo "Chưa có bản chụp nào."; exit 0; }
    ls -1 "$STORE"
    ;;
  restore)
    [ -d "$STORE" ] || { echo "Chưa có bản chụp nào để trả về." >&2; exit 1; }
    LATEST="$(ls -1 "$STORE" | tail -n 1)"
    [ -n "$LATEST" ] || { echo "Kho chụp rỗng." >&2; exit 1; }
    rm -rf "${SRC:?}"/*
    cp -R "$STORE/$LATEST/." "$SRC/"
    echo "Đã trả examples/ về bản chụp $LATEST"
    ;;
  *)
    echo "Usage: $0 save | list | restore" >&2
    exit 2
    ;;
esac
