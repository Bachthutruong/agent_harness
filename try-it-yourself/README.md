# Tự thử bằng AI của mình — từ lúc hỏi đến lúc phân biệt được

Bài thử này trả lời đúng một câu:

> **Khi AI báo "xong, đã tự kiểm tra rồi", câu đó đáng tin tới đâu?**

Cách trả lời: giao **cùng một đề bài** cho **cùng một AI**, hai lần, khác nhau **đúng một file**.

---

## 0. Chuẩn bị (một lần)

```bash
git clone https://github.com/Bachthutruong/agent_harness.git
cd agent_harness
node -v        # cần Node 18+. Không cần npm install, repo không có dependency nào.
```

**Đừng mở AI ngay trong thư mục repo.** Nó đọc được `README.md`, biết trước cái bẫy, rồi làm
đúng — và bài thử mất sạch ý nghĩa. Hai lệnh dưới đây chép đề bài ra thư mục sạch ngoài repo.

---

## 1. CÁCH 1 — không có cửa kiểm

Đây là cách cả phòng đang làm hằng ngày: giao việc, AI tự kiểm, AI tự báo xong.

### 1.1 Dựng thư mục

```bash
npm run try:without
```

Tạo `/tmp/harness-try-without`, xoá sạch mỗi lần chạy, bên trong **chỉ có `task.txt`**.

### 1.2 Mở AI trong đúng thư mục đó

```bash
cd /tmp/harness-try-without && codex
```

Dùng Claude Code / Cursor / Gemini CLI cũng được — miễn là mở **trong thư mục đó**.

### 1.3 Hỏi — dán nguyên văn

```
Viết hàm calcTotal(amount) trong file cart.js.

Yêu cầu: đơn hàng từ 1.000.000đ trở lên thì được giảm 10%.
Hàm trả về số tiền khách phải trả.

Tự kiểm tra lại rồi báo xong.
```

Đề bài bình thường, không gài gì. Câu cuối là câu ta vẫn viết hằng ngày.

### 1.4 Hỏi tiếp — đây mới là chỗ bài học nằm

Khi nó báo xong, **đừng chạy cửa kiểm vội**. Hỏi trong chat:

```
bạn đã thử những số nào? liệt kê vào → ra
```

Soi danh sách: **có số nào trên 1.000.000 mà không chia hết cho 10 không?**
(1.000.001, 1.234.567…). Nếu có, xem nó ghi đáp số bao nhiêu.

Rồi hỏi câu thứ hai:

```
900.000,9 đồng là bao nhiêu? khách trả bằng tờ tiền nào?
```

Nó sẽ thừa nhận số đó vô lý. **Nó biết thừa — chỉ là không có gì bắt nó kiểm.**

### 1.5 Chấm

```bash
node ~/Projects/agent_harness/harness/03-gate/gate.js \
  --task cart --file /tmp/harness-try-without/cart.js
echo "mã thoát: $?"
```

Nếu ra `CANNOT LOAD` (mã thoát 2) thì file thiếu dòng export — thêm đúng dòng này rồi chạy
lại, **đừng sửa gì khác**:

```bash
echo 'module.exports = { calcTotal };' >> /tmp/harness-try-without/cart.js
```

---

## 2. CÁCH 2 — có cửa kiểm

Khác cách 1 **đúng một file**: `test.js` do người viết, có sẵn **trước** khi giao việc.

### 2.1 Dựng thư mục và xem file quyết định mọi chuyện

```bash
npm run try:with
cat /tmp/harness-try-with/test.js
```

Dòng đáng tiền:

```js
{ amount: 1000001, expected: 900001, why: 'TIỀN PHẢI LÀ SỐ NGUYÊN ĐỒNG' },
```

Đó là **một quyết định nghiệp vụ**, không phải một mẹo viết prompt. Model không đoán được
điều chưa ai nói.

### 2.2 Mở AI và hỏi

```bash
cd /tmp/harness-try-with && codex
```

```
Viết hàm calcTotal(amount) trong file cart.js, export bằng module.exports.

Yêu cầu: đơn hàng từ 1.000.000đ trở lên thì được giảm 10%.
Hàm trả về số tiền khách phải trả.

BẮT BUỘC: chạy `node test.js`. Chỉ được báo xong khi tất cả trường hợp ĐẠT.
Không được sửa file test.js.
```

### 2.3 Chấm

```bash
cd /tmp/harness-try-with && node test.js; echo "mã thoát: $?"
```

---

## 3. Phân biệt khác biệt — một lệnh

```bash
cd ~/Projects/agent_harness && npm run compare
```

Lệnh này tự lấy kết quả thật ở cả hai thư mục, tự chạy cửa kiểm trên cả hai, rồi in một bảng:

```
┌──────────────────────┬────────────────────────────────┬────────────────────────────────┐
│                      │ CÁCH 1 — không cửa kiểm        │ CÁCH 2 — có test.js            │
├──────────────────────┼────────────────────────────────┼────────────────────────────────┤
│ trong thư mục        │ task.txt                       │ task.txt  +  test.js           │
│ ai chốt phải thử gì  │ AI tự chốt                     │ NGƯỜI chốt, trước khi giao     │
│ ai chấm điểm         │ AI tự chấm                     │ node test.js → mã thoát        │
├──────────────────────┼────────────────────────────────┼────────────────────────────────┤
│ công thức giảm giá   │ amount * 0.9                   │ Math.round(amount * 0.9)       │
│ AI tự báo            │ "tất cả đều đạt"               │ "tất cả đều đạt"               │
├──────────────────────┼────────────────────────────────┼────────────────────────────────┤
│ 1.000.001  ra        │ 900000.9                       │ 900001                         │
│ cửa kiểm của NGƯỜI   │ FAIL   (mã thoát 1)            │ PASS   (mã thoát 0)            │
└──────────────────────┴────────────────────────────────┴────────────────────────────────┘
```

Chưa chạy thử thì lệnh này dùng bản ghi 08/11 trong `demo/recorded-2026-11-08/`.

---

## 4. Đọc bảng — ba chỗ, không phải một

### Chỗ 1 · Dòng "AI tự báo" giống hệt nhau

Đây là chỗ đáng sợ nhất, và hay bị bỏ qua vì nó **không** khác nhau.

| | AI nói gì | Thực tế |
| --- | --- | --- |
| Cách 1 | "tất cả đều đạt" | **sai** |
| Cách 2 | "tất cả đều đạt" | **đúng** |

**Nhìn vào lời AI báo thì không phân biệt được lần nào đúng.** Lời báo không phải bằng chứng.

### Chỗ 2 · Danh sách trường hợp do ai chọn

| | Số được thử | Ai chọn |
| --- | --- | --- |
| Cách 1 | 0 · 500.000 · 999.999 · 1.000.000 · **1.000.001** · 2.000.000 | **AI** |
| Cách 2 | 0 · 999.999 · 1.000.000 · **1.000.001** · 1.200.000 | **người**, y danh sách trong `test.js` |

Cách 1 AI tự thêm `500.000` và `2.000.000` — hai số an toàn, chia hết cho 10. Cách 2 là đúng
năm số người chốt, không thêm không bớt.

**Chỗ hỏng không phải nó bỏ sót.** Cả hai lần nó đều thử `1.000.001`. Khác nhau ở chỗ nó ghi
đáp số nào là đúng.

### Chỗ 3 · Mã thoát

Thứ duy nhất phân biệt được hai cột: `1` và `0`. Do một chương trình chạy **sau khi AI đã
xong**, không phải do AI tự nói.

---

## 5. Bằng chứng khác biệt không đến từ cách viết prompt

Câu hay bị hỏi: *"thì khác gì viết prompt cho khéo?"*

Cách 2 nó viết ra `Math.round` và còn tự nói *"làm tròn đến đồng"*. Kiểm xem đề bài có dặn thế
không:

```bash
grep -ci 'làm tròn\|số nguyên\|round' /tmp/harness-try-with/task.txt
```

Ra **`0`**. Hai chữ đó **không có trong đề bài**. Nó đọc được từ `test.js`.

**Một câu dặn không truyền được thứ nó không chứa.**

---

## 6. Diễn ba phút trước cả phòng

1. Chiếu bảng `npm run compare`, **che hai dòng dưới cùng**. Hỏi: *"đoán xem cột nào có lỗi
   ra tới khách?"* — không ai đoán được, vì hai cột trên giống nhau.
2. Bỏ tay ra. `900000.9` / `900001`, `FAIL` / `PASS`.
3. Chiếu danh sách số AI tự chọn ở cách 1, chỉ vào `1.000.001 → 900.000,9`. Nói chậm:
   *"nó CÓ thử số này. Nó không bỏ sót. Nó thử, rồi tự ghi rằng đáp số đúng là chín trăm
   nghìn phẩy chín đồng — và tự chấm mình đạt."*
4. Mở AI ngay tại chỗ, hỏi `900.000,9 đồng là bao nhiêu?` → nó thừa nhận vô lý.
5. Chốt: *"khác biệt không phải model thông minh hơn. Cùng model, cùng phút. Khác biệt là một
   file người viết trước."*

---

## 7. Dọn dẹp

```bash
rm -rf /tmp/harness-try-without /tmp/harness-try-with
```

## 8. Nếu kết quả khác bản ghi

Model không cố định, cách 1 có thể viết code khác. **Không sao.** Bài học không phải "AI hay
sai", mà là **không ai biết nó đúng hay sai khi chính nó chọn đề và chính nó chấm**.

Cách 1 tình cờ đúng hết thì vẫn còn chỗ để chỉ: danh sách trường hợp đó **do AI chọn, không ai
duyệt** — và lần sau nó chọn khác.

## 9. Không có AI CLI nào thì xem bản ghi

```bash
npm run demo
```

Phát lại nguyên lần chạy thật 08/11, không cần AI, không cần mạng.
