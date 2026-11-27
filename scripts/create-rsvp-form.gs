function createWeddingRsvpForm() {
  const form = FormApp.create('Xác nhận tham dự · Hải Nam & Hà Trang', false);
  form
    .setDescription('Hải Nam và Hà Trang mong được biết bạn có thể đến chung vui cùng chúng mình không.')
    .setConfirmationMessage('Hải Nam và Hà Trang đã nhận được phản hồi. Cảm ơn bạn!')
    .setCollectEmail(false)
    .setPublishingSummary(false);

  form.addTextItem()
    .setTitle('Tên khách mời')
    .setRequired(true);

  const attendance = form.addMultipleChoiceItem()
    .setTitle('Bạn có thể tham dự không?')
    .setRequired(true);

  const events = form.addPageBreakItem().setTitle('Chọn ngày tham dự');
  form.addCheckboxItem()
    .setTitle('Bạn có thể tham dự buổi nào?')
    .setHelpText('Chọn ít nhất một buổi. Bạn có thể chọn cả hai.')
    .setChoiceValues([
      'Lễ Nạp Tài · 01/01/2027 · Thanh Hóa',
      'Lễ Cưới · 03/01/2027 · Hà Nội',
    ])
    .setRequired(true);

  const message = form.addPageBreakItem().setTitle('Lời nhắn cho cô dâu chú rể');
  form.addParagraphTextItem()
    .setTitle('Lời nhắn gửi đến Hải Nam & Hà Trang')
    .setRequired(false);

  attendance.setChoices([
    attendance.createChoice('Có thể tham dự', events),
    attendance.createChoice('Không thể tham dự', message),
  ]);

  const responses = SpreadsheetApp.create('Phản hồi thiệp cưới · Hải Nam & Hà Trang');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, responses.getId());

  console.log('Chỉnh sửa và xuất bản: ' + form.getEditUrl());
  console.log('Bảng phản hồi: ' + responses.getUrl());
}
