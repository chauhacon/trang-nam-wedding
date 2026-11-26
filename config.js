const photo = (number, alt, position = "50% 50%") => ({
  src: `./assets/photos/web/wedding-photo-${number}.jpg`, alt, position,
  width: number === 2 ? 2200 : 1200, height: number === 2 ? 3300 : 1800,
});

const maps = query => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

export const wedding = {
  groom: "Hoàng Hải Nam",
  bride: "Nguyễn Hà Trang",
  signature: "Hải Nam & Hà Trang",
  defaultGreeting: { prefix: "Trân trọng kính mời", name: "Quý khách" },
  invitation: "Có những ngày thật đặc biệt khi được sẻ chia cùng những người mình yêu quý. Hải Nam và Hà Trang trân trọng mời bạn đến chung vui và cùng gia đình chứng kiến khoảnh khắc chúng mình bắt đầu một chương mới.",
  heroImage: { ...photo(2, "Hải Nam và Hà Trang đứng bên nhau trong khu vườn"), mobilePosition: "50% 56%" },
  story: "Điều chúng mình mong chờ nhất khi về chung một nhà là những ngày rất đỗi bình thường: cùng ăn một bữa cơm, kể nhau nghe hôm nay có gì vui, rồi bàn xem cuối tuần sẽ đi đâu. Trước khi bắt đầu những ngày như thế, chúng mình muốn dành một ngày thật đặc biệt để sum họp với gia đình và bạn bè.",
  couplePhotos: [
    photo(4, "Hải Nam và Hà Trang ngồi cạnh nhau trong bộ lễ phục"),
    photo(5, "Hà Trang ôm Hải Nam trong bộ ảnh cưới"),
  ],
  galleryImages: [
    photo(1, "Thiệp cưới, hoa và những kỷ vật của Hải Nam và Hà Trang"),
    { ...photo(3, "Hải Nam và Hà Trang tựa vào nhau dưới tán cây", "50% 76%"), wide: true },
    photo(5, "Khoảnh khắc thân mật của Hải Nam và Hà Trang"),
  ],
  events: [
    {
      slug: "nha-gai", label: "Nhà Gái", city: "Thanh Hóa",
      date: "2027-01-01", weekday: "Thứ Sáu", lunarDate: "24/11 năm Bính Ngọ",
      sessions: [
        {
          title: "Lễ Nạp Tài", time: "09:30", venue: "Tư gia nhà gái",
          address: "8 Lê Hồng Sơn, Hạc Thành, Thanh Hóa, Vietnam",
          mapsUrl: "https://maps.app.goo.gl/iC7HErXdi3NnBKmf7",
        },
        {
          title: "Tiệc Cưới Nhà Gái", time: "11:00",
          venue: "Hội trường DuBai – Sảnh Châu Á – Trung tâm TCSK White Palace",
          address: "Ngã tư Đại lộ Võ Nguyên Giáp – Trịnh Kiểm, Phường Hạc Thành, Tỉnh Thanh Hóa",
          mapsUrl: maps("Trung tâm TCSK White Palace, Đại lộ Võ Nguyên Giáp, Thanh Hóa"),
        },
      ],
    },
    {
      slug: "nha-trai", label: "Nhà Trai", city: "Hà Nội",
      date: "2027-01-03", weekday: "Chủ Nhật", lunarDate: "26/11 năm Bính Ngọ",
      sessions: [
        {
          title: "Lễ Cưới", time: "11:00", venue: "Trung đoàn 280",
          address: "Ngõ 585, Đường Nguyễn Văn Linh, Phường Phúc Lợi, TP. Hà Nội",
          mapsUrl: maps("Ngõ 585 Nguyễn Văn Linh, Phúc Lợi, Long Biên, Hà Nội"),
        },
      ],
    },
  ],
};
