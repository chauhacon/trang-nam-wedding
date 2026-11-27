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
  heroImage: { ...photo(2, ""), mobilePosition: "50% 56%" },
  story: "Chúng mình là hai tâm hồn phức tạp nhưng lại tìm thấy bình yên ở những điều giản dị khi bên nhau. Hạnh phúc của chúng mình được góp nhặt từ những niềm vui nhỏ bé, là những ngày ở cạnh nhau, những tiếng cười, những quan tâm và cả những khoảnh khắc vụn vặt mà chỉ hai đứa mới hiểu vì sao lại đáng nhớ đến thế. Sau những ngày tháng thiết kế nền móng vững chãi ấy, chúng mình quyết định đặt những viên gạch đầu tiên để cùng nhau xây dựng \“lâu đài tình ái\”. Mời bạn đến chung vui cùng gia đình chúng mình và tham dự lễ khởi công \“dự án trăm năm\” này.",
  couplePhotos: [
    {
      src: "./assets/photos/web/wedding-photo-7.webp", width: 1200, height: 1800,
      alt: "", person: "bride", role: "Cô dâu",
    },
    {
      src: "./assets/photos/web/wedding-photo-6.webp", width: 1149, height: 1800,
      alt: "", person: "groom", role: "Chú rể",
    },
  ],
  galleryImages: [
    photo(1, ""),
    photo(4, ""),
    photo(2, ""),
    photo(5, ""),
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
