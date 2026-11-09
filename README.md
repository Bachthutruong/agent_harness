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
npm test            # cửa kiểm: chạy 5 trường hợp, trả mã thoát 0/1
npm run thu-lan-A   # đem code AI tự chấm "đạt 7/7" qua cửa kiểm → HỎNG, thoát 1
npm run verify      # ba lượt soát, mỗi lượt tìm một kiểu lỗi
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
| 01 | **Context** | ai quyết phải thử trường hợp nào | [`harness/01-context/truong-hop.js`](harness/01-context/truong-hop.js) |
| 02 | **Tool** | ai quyết AI được chạy lệnh gì | [`harness/02-tool/chay-lenh.sh`](harness/02-tool/chay-lenh.sh) |
| 03 | **Gate** | ai chạy thử trước khi người xem | [`harness/03-gate/gate.js`](harness/03-gate/gate.js) |
| 04 | **Verify** | ai soát lại để tìm lỗi | [`harness/04-verify/verify.js`](harness/04-verify/verify.js) |
| 05 | **Rollback** | ai xoá bỏ được nếu đã sai | [`harness/05-rollback/snapshot.sh`](harness/05-rollback/snapshot.sh) |
| 06 | **Budget** | ai bắt dừng khi quá tốn | [`harness/06-budget/budget.js`](harness/06-budget/budget.js) |

`01-context/truong-hop.js` là **source of truth**: gate và verify đều đọc lại từ đó, không
thành phần nào tự chế danh sách riêng.

Chi tiết từng thành phần và cách lắp vào dự án thật: [`harness/README.md`](harness/README.md).

## Thư mục

```
harness/           sáu thành phần, mỗi cái chạy được một mình
vi-du/giohang.js   chỗ AI ghi code vào — hiện là kết quả lần B
thu-tai-nha/       hai thư mục để tự thử bằng AI của mình
demo/              phát lại lần chạy thật + script chạy lại bằng codex
trang/index.html   trang xem bằng mắt, mở bằng trình duyệt
```

## Lắp vào dự án thật

1. Chép `harness/01-context/truong-hop.js`, thay danh sách bằng trường hợp của mình.
   **Viết nó trước khi giao việc cho AI**, không phải sau.
2. Cho agent chạy lệnh qua `harness/02-tool/chay-lenh.sh`, đừng cho nó shell trần.
3. Đặt `npm test` (gate) vào CI, chặn merge khi thoát khác 0.
4. Chụp dữ liệu bằng `05-rollback` trước mọi lần ghi.
5. Bọc mọi lần gọi agent bằng `06-budget` để nó không chạy tới khi có người chặn tay.

## Chạy lại ra kết quả khác thì sao

Model không cố định — lần A có thể viết code khác. **Không sao.** Bài học không phải
"AI hay sai", mà là **không ai biết nó đúng hay sai khi chính nó chọn đề và chính nó chấm**.
Nếu lần A tình cờ đúng hết, vẫn còn chỗ để chỉ: bảy trường hợp đó do AI chọn, không ai duyệt.

## Môi trường

Node 18+ và bash. Đã chạy trên macOS với Node v24.11.1. Script `.sh` chưa thử trên Windows —
dùng WSL hoặc Git Bash.
