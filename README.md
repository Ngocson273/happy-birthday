# Happy Birthday VIP

Trang chúc mừng sinh nhật tương tác (HTML/CSS/JS thuần, không cần cài đặt).

## Chạy
Mở `index.html` bằng trình duyệt (hoặc `npx serve .` / Live Server).

## Cấu trúc
```
index.html          Khung các màn (scene)
css/style.css       Toàn bộ giao diện & hiệu ứng
js/config.js        >>> CHỈNH ẢNH, NHẠC, CHỮ Ở ĐÂY <<<
js/utils.js         Hàm tiện ích, co giãn theo màn hình
js/photos.js        Tạo ảnh mẫu khi chưa có ảnh thật
js/background.js    Nền tiệc: bóng bay, bánh, kẹo, mây
js/scenes.js        Luồng: hộp quà -> bánh -> album -> thư -> bấm bánh -> tải
js/finale.js        Cảnh cuối: bánh hạt + ảnh/chữ bay 3D
images/             ảnh của bạn (anh_1.jpg ... anh_13.jpg)
audio/              Happy Birthday To You.mp3
```

## Dùng ảnh & nhạc thật
Trong `js/config.js`:
```js
photos: ['images/anh_1.jpg','images/anh_2.jpg'],
music: 'audio/Happy Birthday To You.mp3',
```
