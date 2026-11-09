# agent_harness

> **Agent = Model + Harness**
>
> *Model* là động cơ — suy luận, viết code. Ta **đi thuê** nó, và nó tự mạnh lên mà ta không
> làm gì. *Harness* là khung xe, vô lăng và phanh. Ta **phải tự xây**, và nó không tự khá lên.
>
> Repo này là phần phải tự xây: sáu thành phần chạy được, kèm một lần chạy thật chứng minh
> vì sao cần chúng.

## Chạy thử trong 30 giây

Không cần `npm install` — repo không có dependency nào. Chỉ cần Node.

```bash
git clone https://github.com/Bachthutruong/agent_harness.git
cd agent_harness

npm run demo        # phát lại lần chạy thật — KHÔNG cần AI, không cần mạng
npm test            # gate: 16 trường hợp của 3 đầu việc, trả mã thoát 0/1
npm run thu-lan-A   # đem code AI tự chấm "đạt 7/7" qua cửa kiểm → HỎNG, thoát 1
npm run verify      # 9 lượt soát: 3 đầu việc × 3 kiểu lỗi
npm run cua-kiem    # cửa kiểm của cả repo — thứ agent phải qua mới được báo xong
```

**Tự thử bằng AI của mình:** mở codex / Claude Code / Cursor ngay trong
[`thu-tai-nha/`](thu-tai-nha/README.md) — hai thư mục khác nhau đúng một file.

## Chuyện đã xảy ra, ngày 08/11/2026

Một đề bài, giao **hai lần** cho **cùng một AI** (`gpt-6.1-sol`, mức suy luận cao nhất).
Khác nhau **đúng một file**.

Đề bài: *"Viết hàm tính tiền. Đơn từ 1.000.000đ trở lên giảm 10%. Tự kiểm tra lại rồi báo xong."*

| | **Lần A** — AI tự ra đề, tự chấm | **Lần B** — người chốt đề trước |
| --- | --- | --- |
| Trong thư mục | chỉ có đề bài | đề bài **+ `test.js` người viết** |
| Code AI viết | `tien * 0.9` | `Math.round(tien * 0.9)` |
| AI tự báo | "Đã tự kiểm tra, **đạt 7/7**" | "Đã chạy `node test.js`: 5/5 ĐẠT" |
| Qua cửa kiểm của người | **HỎNG** · `1000001 → 900000.9` | **TẤT CẢ ĐẠT** |
| Token tiêu | 23.907 | 5.159 |

**Chỗ hỏng không phải nó bỏ sót.** Trong bảy trường hợp lần A tự chọn **có** số 1.000.001.
Nó thử thật — rồi tự viết ra rằng đáp số đúng là **900.000,9 đồng**, và tự chấm mình đạt.
Đồng Việt Nam không có số lẻ sau dấu phẩy.

**Lần B không ai dạy nó làm tròn.** Đề bài không có chữ "làm tròn", không có chữ "số nguyên".
Nó đọc `test.js`, thấy dòng `TIỀN PHẢI LÀ SỐ NGUYÊN ĐỒNG`, rồi tự thêm `Math.round`.
Và tiêu **ít hơn 4,6 lần** token, vì không phải tự nghĩ ra đề thi cho chính mình.

Bản ghi đầy đủ hai lần chạy: [`demo/ket-qua-08-11-2026/`](demo/ket-qua-08-11-2026).
Trang xem bằng mắt: [`trang/index.html`](trang/index.html).

## Sáu thành phần

Mỗi thư mục là một thành phần, chạy được độc lập. Không cái nào cần model giỏi hơn.

| | Thành phần | Trả lời câu | Ở đâu |
| --- | --- | --- | --- |
| 01 | **Context** | ai quyết phải thử trường hợp nào | [`harness/01-context/cong-viec/`](harness/01-context/cong-viec) |
| 02 | **Tool** | ai quyết AI được chạy lệnh gì | [`harness/02-tool/chay-lenh.sh`](harness/02-tool/chay-lenh.sh) |
| 03 | **Gate** | ai chạy thử trước khi người xem | [`harness/03-gate/gate.js`](harness/03-gate/gate.js) |
| 04 | **Verify** | ai soát lại để tìm lỗi | [`harness/04-verify/verify.js`](harness/04-verify/verify.js) |
| 05 | **Rollback** | ai xoá bỏ được nếu đã sai | [`harness/05-rollback/snapshot.sh`](harness/05-rollback/snapshot.sh) |
| 06 | **Budget** | ai bắt dừng khi quá tốn | [`harness/06-budget/budget.js`](harness/06-budget/budget.js) |

`01-context/cong-viec/` là **source of truth**: gate và verify đều nạp từ đó, không thành phần
nào tự chế danh sách riêng.

Chi tiết từng thành phần: [`harness/README.md`](harness/README.md).

## Nhiều đầu việc thì sao — mỗi việc một harness à?

**Không.** Bộ máy viết **một lần**. Mỗi đầu việc chỉ thêm **một file dữ liệu**.

| | Viết mấy lần | Khi có đầu việc mới |
| --- | --- | --- |
| 02 Tool · 03 Gate · 04 Verify · 05 Rollback · 06 Budget | **một lần cho cả repo** | không mở ra nữa |
| 01 Context — `cong-viec/<tên>.cases.js` | mỗi đầu việc một file | thêm đúng **một** file |

Repo này đang có **ba** đầu việc — giỏ hàng, mã giảm giá, phí ship — hàm một tham số lẫn hai
tham số, chạy chung một gate:

```
$ npm test
--- Giỏ hàng — giảm 10% từ 1.000.000đ  [gio-hang]
--- Mã giảm giá — áp mã vào đơn  [ma-giam-gia]
--- Phí ship — tính theo cân nặng và khu vực  [phi-ship]
TAT CA DAT — 16 truong hop, 3 dau viec
```

Thêm đầu việc thứ tư: tạo `harness/01-context/cong-viec/abc.cases.js`. Hết. `gate.js` tự quét
thư mục, `verify.js` cũng vậy.

## Tính năng nào cũng phải viết à?

**Không.** Viết trường hợp là có giá, nên chỉ trả giá ở chỗ đáng. Câu để quyết định:

> **Nếu chỗ này sai, ai là người phát hiện?**

| Nếu sai thì | Ví dụ | Làm gì |
| --- | --- | --- |
| **nhìn phát thấy ngay** | đổi chữ, màu, khoảng cách, dựng màn hình mới | không viết gì — mở lên là biết |
| **lát nữa có người thấy** | lọc danh sách, sắp xếp, phân trang | số 1 bên dưới |
| **không ai thấy, tới hoá đơn mới lộ** | tính tiền, thuế, quyền, ghi dữ liệu, trạng thái đơn | số 2 — viết file trường hợp |

### Ba số, không phải một

| | Tốn gì | Dùng khi |
| --- | --- | --- |
| **0** | không gì cả | sai là nhìn thấy ngay |
| **1** | 30 giây trong chat | mặc định cho phần lớn việc |
| **2** | một file `cong-viec/<tên>.cases.js` | tiền, quyền, dữ liệu, hoặc việc còn sửa nhiều lần |

**Số 1** là chỗ rẻ nhất mà ít người làm: bắt AI **liệt kê trường hợp nó định thử TRƯỚC khi
viết code**, rồi người đọc lướt danh sách đó 30 giây. Không tạo file nào.
Mẫu dán thẳng vào chat: [`harness/01-context/mau-giao-viec.md`](harness/01-context/mau-giao-viec.md).

Trong bản ghi ở `demo/`, nếu làm số 1 thì dòng `1.000.001 → 900.000,9` đã hiện ra trên màn
hình chat trước khi có một dòng code nào. Nhìn một cái là thấy sai.

**Số 2** chỉ dành cho chỗ sai mà không ai biết. Lý do lên số 2 không phải "việc này khó", mà là
**việc này còn được sửa nữa**: danh sách duyệt trong chat chỉ sống một lần chat, file thì lần
sau vẫn chặn.

**Ở dự án thật, con số đó còn về gần 0.** Cửa kiểm là
[`harness/03-gate/cua-kiem.sh`](harness/03-gate/cua-kiem.sh), và ở dự án thật nội dung nó thường
không có dòng nào mới — chỉ là lệnh bạn đã chạy hằng ngày, nối lại, dừng ở lệnh đầu tiên thoát
khác 0:

```bash
npm run typecheck && npm run lint && npm test
```

Thứ bạn "thêm cho mỗi task" chính là **test** — việc bạn vẫn làm. Harness không thay test
framework. Nó làm cho test thành thứ **bắt buộc** với agent, thay vì một lời khuyên nó bỏ qua
được.

## Thư mục

```
harness/
  01-context/cong-viec/   MỘT file cho MỖI đầu việc — chỗ duy nhất phải thêm
  02-tool … 06-budget/    bộ máy, viết một lần cho cả repo
  03-gate/cua-kiem.sh     cửa kiểm của cả repo: nối các bước, dừng ở bước hỏng
vi-du/                    chỗ AI ghi code vào (3 file, khớp 3 đầu việc)
thu-tai-nha/              hai thư mục để tự thử bằng AI của mình
demo/                     phát lại lần chạy thật + script chạy lại bằng codex
trang/index.html          trang xem bằng mắt, mở bằng trình duyệt
```

## Lắp vào dự án thật

1. Sửa `harness/03-gate/cua-kiem.sh` thành lệnh kiểm của dự án bạn (`typecheck`, `lint`,
   `test`). Đây là file **duy nhất** cần sửa một lần.
2. Với mỗi đầu việc giao cho AI, viết trường hợp cần thử **trước khi giao** — bằng test
   framework sẵn có, hoặc bằng một file trong `cong-viec/` nếu chưa có framework nào.
3. Cho agent chạy lệnh qua `harness/02-tool/chay-lenh.sh`, đừng cho nó shell trần.
4. Đặt `cua-kiem.sh` vào CI, chặn merge khi thoát khác 0.
5. Chụp dữ liệu bằng `05-rollback` trước mọi lần ghi.
6. Bọc mọi lần gọi agent bằng `06-budget` để nó không chạy tới khi có người chặn tay.

## Chạy lại ra kết quả khác thì sao

Model không cố định — lần A có thể viết code khác. **Không sao.** Bài học không phải
"AI hay sai", mà là **không ai biết nó đúng hay sai khi chính nó chọn đề và chính nó chấm**.
Nếu lần A tình cờ đúng hết, vẫn còn chỗ để chỉ: bảy trường hợp đó do AI chọn, không ai duyệt.

## Môi trường

Node 18+ và bash. Đã chạy trên macOS với Node v24.11.1. Script `.sh` chưa thử trên Windows —
dùng WSL hoặc Git Bash.
