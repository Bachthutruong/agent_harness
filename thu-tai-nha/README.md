# Tự thử bằng AI của mình

Hai thư mục này chỉ khác nhau **đúng một file**. Mở AI chat (codex, Claude Code, Cursor…)
**ngay trong từng thư mục**, dán cùng một đề bài, rồi so kết quả.

| | `khong-co-harness/` | `co-harness/` |
| --- | --- | --- |
| Trong thư mục | `de-bai.txt` | `de-bai.txt` **+ `test.js`** |
| Ai chốt phải thử gì | **AI tự chốt** | **người** chốt, trước khi giao |
| Ai chấm điểm | **AI tự chấm** | `node test.js`, lấy mã thoát |

## Làm thế này

**Bước 1 — lần không có harness.**

```bash
cd thu-tai-nha/khong-co-harness
codex            # hoặc claude, cursor-agent… mở ngay trong thư mục này
```

Dán nguyên văn nội dung `de-bai.txt` vào chat. Để nó làm tới khi nó báo xong.
**Đọc kỹ câu nó báo** — nó sẽ nói đã tự kiểm tra và đạt hết.

Rồi đem code nó vừa viết qua cửa kiểm của người:

```bash
cd ../..
node harness/03-gate/gate.js thu-tai-nha/khong-co-harness/giohang.js
```

**Bước 2 — lần có harness.**

```bash
cd thu-tai-nha/co-harness
codex
```

Dán nội dung `de-bai.txt` của thư mục này. Lần này nó phải chạy `node test.js` mới được
báo xong.

## Chú ý khi so

- Nếu AI ở bước 1 **không export** `module.exports = { tinhTien }` thì gate không nạp
  được file (thoát 2). Thêm dòng đó vào rồi chạy lại — đừng sửa gì khác.
- **Kết quả có thể khác bản ghi trong `demo/`.** Model không cố định. Bài học không phải
  "AI hay sai", mà là **không ai biết nó đúng hay sai khi chính nó chọn đề và chính nó
  chấm**. Nếu bước 1 tình cờ đúng hết: hỏi nó đã thử những số nào, rồi hỏi ai duyệt
  danh sách đó.
