# Tự thử bằng AI của mình

Hai thư mục này khác nhau **đúng một file**. Chạy lần lượt cả hai, so câu AI tự báo với kết
quả cửa kiểm.

| | `without-harness/` | `with-harness/` |
| --- | --- | --- |
| Trong thư mục | `task.txt` | `task.txt` **+ `test.js`** |
| Ai chốt phải thử gì | **AI tự chốt** | **người** chốt, trước khi giao |
| Ai chấm điểm | **AI tự chấm** | `node test.js`, lấy mã thoát |

## Đừng mở AI ngay trong repo

Mở AI ở đây thì nó đọc được `README.md` của repo, biết trước cái bẫy làm tròn, và thí nghiệm
mất sạch ý nghĩa. Bản ghi ngày 08/11 cũng chạy trong thư mục tạm chỉ có đúng đề bài.

Dùng hai lệnh này — chúng chép đề bài ra thư mục sạch ngoài repo rồi in sẵn từng bước:

```bash
npm run try:without     # lần KHÔNG có cửa kiểm
npm run try:with        # lần CÓ test.js do người viết
```

## Lần 1 — không có cửa kiểm

Làm theo ba bước lệnh in ra. Khi AI báo xong, **nhìn ba chỗ** trước khi chạy cửa kiểm:

1. **Câu nó báo.** Gần như chắc chắn có dạng *"đã tự kiểm tra, đạt N/N trường hợp"*.
2. **Hỏi lại nó:** `bạn đã thử những số nào? liệt kê vào → ra` — đây mới là chỗ bài học nằm.
3. **Soi danh sách đó** xem có số nào trên 1.000.000 mà không chia hết cho 10 không
   (1.000.001, 1.234.567…). Nếu có, xem nó ghi đáp số bao nhiêu.

Rồi mới chấm bằng cửa kiểm của người. Mã thoát `1` nghĩa là code đó không qua.

## Lần 2 — có cửa kiểm

Đề bài gần như y hệt, chỉ thêm câu bắt buộc chạy `node test.js`. Nhìn code nó viết ra: nếu có
`Math.round` thì để ý — **hai chữ "làm tròn" và "số nguyên" không có trong đề bài**. Nó lấy từ
`test.js`.

## Nếu kết quả khác bản ghi trong `demo/`

Bình thường, model không cố định. Bài học không phải "AI hay sai", mà là **không ai biết nó
đúng hay sai khi chính nó chọn đề và chính nó chấm**.

Lần 1 tình cờ đúng hết thì vẫn còn chỗ để chỉ: danh sách trường hợp đó **do AI chọn, không ai
duyệt** — và lần sau nó có thể chọn khác.
