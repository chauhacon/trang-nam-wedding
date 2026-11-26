export const localTime = (event, session) => `${event.date}T${session.time}:00+07:00`;

export const calendarFilename = (event, session) =>
  `${event.slug}-${session.time.replace(":", "")}.ics`;
