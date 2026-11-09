# Bản ghi lần chạy thật — 08/11/2026

Hai lần chạy `codex exec`, model `gpt-6.1-sol`, mức suy luận `xhigh`.

| File | Là gì |
| --- | --- |
| `transcript-run-A.txt` | bản ghi đầy đủ lần A — AI tự chọn trường hợp, tự chấm |
| `transcript-run-B.txt` | bản ghi đầy đủ lần B — có `test.js` do người viết sẵn |
| `cart-run-A.js` | code lần A viết ra |
| `cart-run-B.js` | code lần B viết ra |

## Hai chỗ khác với repo hiện tại

Đây là **bản ghi lịch sử**, không sửa lại cho khớp tên mới:

- Hàm trong đó tên `tinhTien`, file tên `giohang.js`. Repo giờ dùng `calcTotal` / `cart.js`.
  `demo/replay.sh` vì thế gọi gate kèm `--fn tinhTien`.
- Nhãn kết quả trong đó là `DAT`/`HONG`. Code hiện tại in `PASS`/`FAIL`.

Nội dung bài học không đổi: lần A thử số `1_000_001`, tự ghi đáp số `900_000.9`, rồi tự chấm đạt.
