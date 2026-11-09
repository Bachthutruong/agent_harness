# Mẫu giao việc — số 1, không phải viết file nào

Dán nguyên văn vào chat với AI, thay ba chỗ trong ngoặc. Mất khoảng 30 giây, và bắt được
phần lớn lỗi kiểu "AI tự chấm mình đạt".

```
[Việc cần làm — mô tả bình thường]

Thế nào là xong: [một câu]
Quyết định nghiệp vụ, không được tự suy ra: [một câu — ví dụ: tiền khách trả là số nguyên đồng]

TRƯỚC KHI VIẾT CODE: liệt kê các trường hợp bạn sẽ thử, dạng bảng `vào → ra mong đợi`,
kèm lý do chọn từng trường hợp. Rồi DỪNG LẠI chờ tôi duyệt. Không viết code trước khi tôi duyệt.

Sau khi tôi duyệt: viết code, chạy đủ danh sách đó, chỉ được báo xong khi tất cả đạt.
Không tự sửa danh sách đã duyệt.
```

## Vì sao chỗ này ăn thua

Đọc lại bản ghi trong [`demo/`](../../demo/recorded-2026-11-08): AI **có** thử số 1.000.001.
Nó không bỏ sót. Nó thử, rồi tự ghi đáp số đúng là **900.000,9 đồng**, rồi tự chấm đạt.

Nếu lúc đó danh sách trường hợp được đưa ra cho người xem **trước khi viết code**, thì dòng
`1.000.001 → 900.000,9` nằm chình ình trên màn hình chat. Nhìn một cái là thấy sai. Duyệt
danh sách mất 30 giây; sửa hoá đơn tính sai thì không.

## Khi nào phải lên số 2 (viết file trường hợp)

Khi đầu việc đó sẽ còn được sửa nữa. Danh sách duyệt trong chat chỉ sống trong một lần chat;
file trong [`tasks/`](tasks) thì lần sửa sau vẫn chặn.
