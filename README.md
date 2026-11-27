# Thiệp cưới Hoàng Hải Nam & Nguyễn Hà Trang

Thiệp mời tĩnh bằng HTML, CSS và JavaScript. Tất cả đường dẫn dùng trong trang đều tương đối với thư mục triển khai. Trang sử dụng Cormorant Garamond, Be Vietnam Pro, Lucide và Lenis qua CDN. Trên thiết bị cảm ứng, trang giữ thao tác cuộn gốc của trình duyệt.

## Xem trước

Tại thư mục dự án, chạy:

```sh
python3 -m http.server 8000
```

Mở `http://localhost:8000/`. Hãy dùng máy chủ HTTP để trình duyệt có thể tải các mô-đun JavaScript và `guests.json`.

## Sửa nội dung và ảnh

- Trong `config.js`, sửa tên, lời mời và danh sách `events`. Hai ngày âm lịch là 24/11 và 26/11 năm Bính Ngọ. [Lịch tháng 1/2027](https://amlichvietnam.vn/lich-am/2027/1)
- Để thêm địa chỉ tư gia, điền `address` của mục **Lễ Nạp Tài**. Điền thêm `mapsUrl` nếu muốn hiện nút bản đồ cho tư gia. Giờ của buổi đầu tiên mỗi nhà là mốc đếm ngược cho nhà đó. Các tệp lịch dùng chính xác giờ UTC tương đương với giờ Việt Nam.
- Sau khi sửa tên cô dâu chú rể hoặc thông tin buổi lễ trong `config.js`, chạy `node --experimental-default-type=module scripts/generate-calendars.mjs` (Node.js 20.10 trở lên) rồi commit các tệp cập nhật trong `assets/calendars/`. Nút **Thêm vào Lịch** tải tệp `.ics` từ thư mục này. Nếu Zalo hoặc Messenger chặn tải tệp, mở thiệp trong Safari hoặc Chrome.
- Ảnh dùng trên trang nằm trong `assets/photos/web/`. Mở đầu dùng ảnh 2, phần câu chuyện dùng ảnh 7 cho cô dâu và ảnh 6 cho chú rể, thư viện dùng ảnh 1, 2, 4 và 5. Với ảnh mới, cập nhật `src`, `alt`, `width` và `height` theo ảnh thật. `position` và `mobilePosition` có thể dùng giá trị như `"50% 56%"` để chỉnh tâm cắt. Ảnh thư viện có `wide: true` sẽ có khung ngang. Có thể thêm `fullSrc` cho ảnh phóng to.
- Khi đổi ảnh chia sẻ, đặt ảnh ngang trong `assets/photos/` và cập nhật `og:image`, kích thước và mô tả trong `index.html`. Meta dùng URL HTTPS tuyệt đối để trình thu thập của ứng dụng chat đọc được trực tiếp. Cập nhật tiêu đề và mô tả trong HTML nếu đổi tên hoặc nội dung chia sẻ. [Open Graph](https://ogp.me/)

## Tạo liên kết cho khách

1. Sửa danh sách trong `guests.json` theo ba nhóm `testing` (kiểm thử), `bride` (khách nhà gái) và `groom` (khách nhà trai). Mỗi nhóm tương ứng với một bảng trong `links.html`. Mỗi mục có `slug` duy nhất trong cả ba nhóm, `prefix` (lời xưng hô), `name` (tên hiển thị) và `events`. Thêm trường tùy chọn `"notes": "Nội dung ghi chú"` để hiển thị trong cột **Ghi chú** của `links.html`.
2. Dùng `["nha-gai"]`, `["nha-trai"]` hoặc `["nha-gai", "nha-trai"]` để chọn lịch. Liên kết chung hoặc mã khách không nhận diện được sẽ hiện cả hai lịch.
3. Mở `links.html` trên chính địa chỉ đã triển khai. Nhấn **Copy** bên cạnh tên rồi dán vào Zalo hoặc Messenger. Nếu ứng dụng chặn clipboard, sao chép từ ô liên kết đã được chọn.

`guests.json` và `links.html` đều có thể truy cập công khai trên GitHub Pages. Mã khách dùng để cá nhân hóa và lọc lịch hiển thị. Chỉ đưa thông tin có thể công khai vào các tệp của trang.

## Triển khai GitHub Pages

1. Commit và push các tệp ở thư mục gốc cùng `assets/` lên nhánh xuất bản, thường là `main`.
2. Trong repository trên GitHub, mở **Settings → Pages → Build and deployment**. Chọn **Deploy from a branch**, chọn nhánh xuất bản và **/ (root)**, rồi bấm **Save**.
3. Sau khi GitHub báo triển khai thành công, mở URL hiện trong **Settings → Pages**. Trang đang dùng `https://chauhacon.github.io/trang-nam-wedding/` trong meta chia sẻ, dựa trên repository hiện tại. Nếu GitHub cấp URL khác, sửa cả `og:url` và `og:image` trong `index.html`.
4. Kiểm tra trang chính, `?guest=anh-minh`, `?guest=chi-linh`, `?guest=co-lan-chu-hung` và `links.html` dưới cùng thư mục dự án. [Hướng dẫn GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

## Tạo Google Form xác nhận tham dự

1. Đăng nhập tài khoản Google sẽ quản lý phản hồi rồi tạo dự án tại [Google Apps Script](https://script.google.com/).
2. Dán nội dung của [scripts/create-rsvp-form.gs](scripts/create-rsvp-form.gs) vào `Code.gs`. Chọn hàm `createWeddingRsvpForm`, bấm **Run**, rồi cấp quyền tạo biểu mẫu và bảng tính. Chạy một lần vì mỗi lần chạy sẽ tạo một cặp tệp mới.
3. Mở **Execution log** và dùng đường dẫn **Chỉnh sửa và xuất bản**. Chọn **Publish**, đặt quyền trả lời thành **Anyone with the link** nếu khách không cần đăng nhập, rồi sao chép **Responder link**. Giữ bảng phản hồi ở chế độ riêng tư. [Hướng dẫn chia sẻ Google Form](https://support.google.com/docs/answer/2839588)
4. Kiểm tra bằng cửa sổ ẩn danh. Chọn **Có thể tham dự** để kiểm tra rằng phải chọn ít nhất một buổi và có thể chọn cả hai. Chọn **Không thể tham dự** để kiểm tra rằng form chuyển thẳng đến phần lời nhắn tùy chọn. Kiểm tra phản hồi thử trong bảng tính trước khi gửi link cho khách.
