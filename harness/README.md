# Sáu thành phần

Mỗi thành phần là một file chạy được, không dependency. Đọc được hết trong 10 phút.

## 01 · Context — `01-context/cong-viec/*.cases.js`

Danh sách trường hợp phải thử, **người viết trước khi giao việc**. Source of truth: gate và
verify đều nạp từ đây nên không bao giờ có hai bản danh sách lệch nhau.

**Một đầu việc = một file.** Thêm đầu việc mới thì thêm một file, không mở lại gate hay verify.

```js
module.exports = {
  ten: 'Phí ship — tính theo cân nặng và khu vực',
  module: '../../../vi-du/phiship.js',
  ham: 'tinhPhiShip',
  quyetDinh: 'Cân nặng làm tròn LÊN theo khối 500g, không làm tròn gần nhất.',
  truongHop: [
    { vao: [501, true], ra: 20000, vi: 'LÀM TRÒN LÊN — 501g tính thành 2 khối' },
  ],
};
```

`vao` là mảng tham số nên hàm mấy tham số cũng chạy được. Trường `quyetDinh` là chỗ ghi
**quyết định nghiệp vụ model không đoán được** — thiếu nó là ra lỗi 900.000,9 đồng ở `demo/`.

## 02 · Tool — `02-tool/chay-lenh.sh`

AI chỉ chạy được lệnh có trong `lenh-duoc-phep.txt`. Mặc định là **cấm**.

```bash
./harness/02-tool/chay-lenh.sh node harness/03-gate/gate.js   # chạy
./harness/02-tool/chay-lenh.sh rm -rf vi-du                   # từ chối, thoát 3
```

Chỗ hay làm sai: dặn AI *"đừng xoá gì nhé"* rồi coi là đã chặn. Lời dặn chỉ là lời khuyên.

## 03 · Gate — `03-gate/gate.js`

Chạy toàn bộ trường hợp, in `DAT`/`HONG`, **thoát 0 hoặc 1**. Mã thoát là thứ quyết định,
không phải câu AI báo.

```bash
node harness/03-gate/gate.js                        # mọi đầu việc trong cong-viec/
node harness/03-gate/gate.js --viec gio-hang        # một đầu việc
node harness/03-gate/gate.js --viec gio-hang --file duong/dan/khac.js
```

Mã thoát: `0` đạt hết · `1` có trường hợp hỏng · `2` không nạp được file.

### `03-gate/cua-kiem.sh` — cửa kiểm của cả repo

Nối các bước lại, dừng ở bước đầu tiên thoát khác 0. Ở dự án thật, nội dung nó là lệnh bạn đã
chạy hằng ngày (`npm run typecheck`, `npm run lint`, `npm test`, `pytest -q`). **Đây là file
duy nhất cần sửa một lần khi lắp harness vào dự án** — thêm đầu việc về sau không đụng tới nó.

## 04 · Verify — `04-verify/verify.js`

Ba lượt soát, mỗi lượt đi tìm **một kiểu lỗi khác nhau**:

| Lượt | Tìm cái gì |
| --- | --- |
| Đúng chưa? | kết quả có khớp danh sách trường hợp không (chạy lại gate) |
| An toàn chưa? | hàm có gọi `eval`, `child_process`, `fs`, mạng, biến môi trường không |
| Chạy lại ra y hệt chưa? | cùng đầu vào có luôn ra cùng kết quả không |

Chạy cho **mọi** đầu việc: `node harness/04-verify/verify.js`, hoặc một cái với `--viec <tên>`.

Ba lượt **giống nhau** không bằng ba lượt tìm ba kiểu lỗi khác nhau. Hỏi *"cái này ổn chưa?"*
thì gần như luôn nhận được *"ổn rồi"* — nên việc được giao phải là **đi tìm lỗi**.

Ở đây cả ba lượt đều phải đạt: một lượt tìm ra lỗi thật thì hai lượt kia không bỏ phiếu lấp đi
được.

## 05 · Rollback — `05-rollback/snapshot.sh`

```bash
./harness/05-rollback/snapshot.sh chup      # chụp vi-du/ trước khi giao việc
./harness/05-rollback/snapshot.sh liet-ke
./harness/05-rollback/snapshot.sh tra-ve    # trả về bản chụp gần nhất
```

Bản chụp nằm trong `.anh-chup/` (đã ignore). Chụp **trước** khi ghi; chụp sau thì đã muộn.

## 06 · Budget — `06-budget/budget.js`

```bash
node harness/06-budget/budget.js --giay 30 --lan 2 -- npm test
```

Giới hạn thời gian mỗi lần chạy và số lần thử lại. Quá giờ thì cắt (thoát 124), hết lần mà
vẫn hỏng thì dừng hẳn (thoát 1) thay vì thử mãi.
